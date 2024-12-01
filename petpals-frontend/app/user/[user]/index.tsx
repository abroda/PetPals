import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  Alert,
  FlatList,
  Text,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation, usePathname, router, Href, useFocusEffect } from "expo-router";
import { widthPercentageToDP } from "react-native-responsive-screen";
import PostFeed from "@/components/lists/PostFeed";
import { Dog, useDog } from "@/context/DogContext";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import { useUser } from "@/hooks/useUser";
import {UserProfile} from "@/context/UserContext";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";

export default function UserProfileScreen() {
  // Contexts
  const path = usePathname();
  const { addDog, getDogsByUserId } = useDog();
  const { logout, userId: loggedInUserId } = useAuth();
  const { fetchUserById, userProfile } = useUser();
  const navigation = useNavigation();

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  // Functionality
  const [isRefreshing, setIsRefreshing] = useState(false); // For refresh indicator (if needed)
  const [menuVisible, setMenuVisible] = useState(false);

  const [dogs, setDogs] = useState<Dog[]>([]);
  const dogCount = dogs.length;

  const usernameFromPath = path.slice(path.lastIndexOf("/") + 1);
  const [username, setUsername] = useState(usernameFromPath);

  const [visitedUser, setVisitedUser] = useState<UserProfile | null>(null);

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  // Check if viewing own profile
  const isOwnProfile = username === "me" || loggedInUserId === username;

  // Fetch the profile being viewed
  useEffect(() => {
    const resolvedUsername = username === "me" ? loggedInUserId : username;

    if (resolvedUsername) {
      fetchUserById(resolvedUsername)
        .then((user) => {
          setVisitedUser(user);
          console.log("[User/Index] Visited user fetched:", user);
        })
        .catch((error) => {
          console.error("Failed to fetch visited user:", error);
        });
    }
  }, [username, loggedInUserId]);

  // Update username only if it changes
  useEffect(() => {
    if (usernameFromPath !== username) {
      setUsername(usernameFromPath);
    }
  }, [path, usernameFromPath, username]);

  const fetchDogs = async () => {
    const ownerId = username === "me" ? loggedInUserId : username;
    if (!ownerId) return;

    try {
      const userDogs = await getDogsByUserId(ownerId);
      const sortedDogs = userDogs
        .map((dog) => ({ ...dog, name: dog.name || "Unknown Dog" }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setDogs(sortedDogs);
    } catch (error) {
      console.error("Failed to fetch dogs:", error);
    }
  };

  // Refresh data whenever the screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchDogs();
    }, [loggedInUserId]) // Only re-run if userId changes
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: themeColors.tertiary,
            padding: percentToDP(1),
            borderRadius: 100,
            marginVertical: heightPercentToPD(1),
          }}
        >
          {username === "me" && (
            <Pressable onPress={() => Alert.alert("Notifications")}>
              <ThemedIcon
                name="notifications-outline"
                style={{
                  marginHorizontal: widthPercentageToDP(1),
                  padding: percentToDP(2),
                }}
              />
            </Pressable>
          )}

          {/* Avatar of the currently logged-in user */}
          <UserAvatar
            userId={loggedInUserId || ""}
            imageUrl={userProfile?.imageUrl}
            size={10}
            doLink={true}
          />

          {/* Three-dots Menu Pop-up */}
          {isOwnProfile && (
            <Pressable onPress={() => setMenuVisible(!menuVisible)}>
              <ThemedIcon
                name="ellipsis-vertical-outline"
                style={{
                  marginHorizontal: widthPercentageToDP(1),
                  padding: percentToDP(2),
                }}
              />
            </Pressable>
          )}
        </View>
      ),
      headerTitle: isOwnProfile
        ? "My Profile"
        : visitedUser?.username || "Profile",
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [navigation, username, menuVisible, visitedUser]);

  const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    if (option === "Edit") {
      router.push("/user/me/editProfile");
    } else if (option === "App Settings") {
      router.push("/settings" as Href<string>);
    }
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const renderDogItem = ({ item }: { item: any }) => (
    <View
      style={{
        marginRight: 8,
        paddingVertical: 10,
      }}
    >
      <View
        style={{
          width: widthPercentageToDP(42),
          height: widthPercentageToDP(70),
          backgroundColor: themeColors.tertiary,
          padding: widthPercentageToDP(4),
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <PetAvatar
          size={35}
          source={item.imageUrl}
          userId={userProfile?.username ?? ""}
          petId={item.id}
          doLink={true}
        />
        <ThemedText
          style={{
            fontSize: 22,
            lineHeight: 24,
            color: themeColors.textOnSecondary,
            fontWeight: "bold",
            marginVertical: heightPercentToPD(2),
          }}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontSize: 14,
            lineHeight: 18,
            color: themeColors.textOnSecondary,
            fontWeight: "regular",
            marginBottom: heightPercentToPD(2),
          }}
        >
          {item.description}
        </ThemedText>
      </View>
    </View>
  );

  const ListHeaderComponent = () => (
    <ThemedView
      style={{
        flex: 1,
        width: widthPercentageToDP(100),
        backgroundColor: themeColors.secondary,
      }}
    >
      <View
        style={{
          marginTop: heightPercentToPD(35),
          marginBottom: heightPercentToPD(3),
          backgroundColor: themeColors.tertiary,
          paddingBottom: heightPercentToPD(5),
          width: widthPercentageToDP(100),
        }}
      >
        <View
          style={{
            alignItems: "center",
            backgroundColor: themeColors.tertiary,
            width: widthPercentageToDP(100),
          }}
        >
          <UserAvatar
            size={50}
            userId={visitedUser?.id ?? ""}
            imageUrl={visitedUser?.imageUrl}
            doLink={false}
            style={{
              marginTop: heightPercentToPD(-15),
            }}
          />
          <ThemedText
            style={{
              width: widthPercentageToDP(85),
              textAlign: "center",
              fontSize: 36,
              lineHeight: 40,
              color: themeColors.textOnSecondary,
              marginVertical: heightPercentToPD(1),
            }}
          >
            {visitedUser?.username || "Unknown User"}
          </ThemedText>
          <ThemedText
            style={{
              width: widthPercentageToDP(85),
              fontSize: 15,
              lineHeight: 17,
              textAlign: "center",
              color: themeColors.textOnSecondary,
              marginBottom: heightPercentToPD(5),
            }}
          >
            {visitedUser?.description || "No description"}
          </ThemedText>
        </View>
      </View>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: widthPercentageToDP(100),
          paddingHorizontal: widthPercentageToDP(5),
        }}
      >
        <ThemedText
          style={{
            fontSize: 30,
            lineHeight: 32,
            backgroundColor: "transparent",
            color: themeColors.textOnSecondary,
          }}
        >
          Dogs
        </ThemedText>
      </View>
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        horizontal
        refreshing={isRefreshing}
        onRefresh={fetchDogs}
        showsHorizontalScrollIndicator={false}
        renderItem={renderDogItem}
        contentContainerStyle={{
          paddingHorizontal: widthPercentageToDP(5),
          marginTop: heightPercentToPD(1),
        }}
      />
    </ThemedView>
  );

  return (
    <SafeAreaView
      style={{
        flex: 1,
        width: widthPercentageToDP(100),
        backgroundColor: themeColors.secondary,
      }}
    >
      <FlatList
        style={{
          width: widthPercentageToDP(100),
        }}
        data={[]}
        ListHeaderComponent={ListHeaderComponent}
        ListFooterComponent={() => (
          <>
            <ThemedText
              textStyleOptions={{ size: 30 }}
              style={{
                color: themeColors.textOnSecondary,
                backgroundColor: "transparent",
                marginLeft: widthPercentageToDP(5),
                marginTop: heightPercentToPD(4),
              }}
            >
              Posts
            </ThemedText>
            <PostFeed />
          </>
        )}
        renderItem={(item) => <></>}
      />
      {menuVisible && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            elevation: 100,
            top: heightPercentToPD(16),
            right: widthPercentageToDP(5),
            width: widthPercentageToDP(40),
            backgroundColor: themeColors.tertiary,
            borderRadius: percentToDP(4),
            shadowOpacity: 0.3,
            shadowRadius: 10,
            borderWidth: 2,
            borderColor: themeColors.primary,
            alignContent: "space-evenly",
            justifyContent: "space-evenly",
          }}
        >
          <Pressable onPress={() => handleMenuSelect("Edit")}>
            <Text
              style={{
                padding: percentToDP(5),
                color: themeColors.primary,
                borderBottomWidth: 1,
                borderColor: themeColors.primary,
                fontSize: percentToDP(4.5),
                lineHeight: percentToDP(5),
              }}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable onPress={() => handleMenuSelect("App Settings")}>
            <Text
              style={{
                padding: percentToDP(5),
                color: themeColors.primary,
                fontSize: percentToDP(4.5),
                lineHeight: percentToDP(5),
              }}
            >
              App Settings
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
