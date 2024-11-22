import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  Pressable,
  Text,
  FlatList,
  Alert,
  TouchableWithoutFeedback,
} from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { UserContext } from "@/context/UserContext";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useAuth } from "@/hooks/useAuth";
import { useNavigation, usePathname, router, Href } from "expo-router";
import { widthPercentageToDP } from "react-native-responsive-screen";
import PostFeed from "@/components/lists/PostFeed";
import { Dog, useDog } from "@/context/DogContext";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import { useUser } from "@/hooks/useUser";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";

export default function UserProfileScreen() {
  const path = usePathname();
  const [username, setUsername] = useState(
    path.slice(path.lastIndexOf("/") + 1)
  );
  const { logout, userId } = useAuth();
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const navigation = useNavigation();
  const [menuVisible, setMenuVisible] = useState(false);
  const { addDog, getDogsByUserId } = useDog();
  const [dogs, setDogs] = useState<Dog[]>([]);

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  // Context
  const { getUserById, userProfile, isProcessing } = useUser();

  useEffect(() => {
    getUserById(username);
  }, [username]);

  useEffect(() => {
    const fetchDogs = async () => {
      const userDogs = await getDogsByUserId(userId ?? "");
      const sortedDogs = userDogs
        .map((dog) => ({ ...dog, name: dog.name || "Unknown Dog" }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setDogs(sortedDogs);
    };
    fetchDogs();
  }, [userId]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: themeColors.tertiary,
            padding: percentToDP(2),
            borderRadius: 100,
            alignItems: "center",
            justifyContent: "center",
            alignContent: "center",
            marginTop: 2,
            marginBottom: 5,
          }}
        >
          {username === "me" && (
            <Pressable onPress={() => Alert.alert("Notifications")}>
              <ThemedIcon
                name="notifications-outline"
                style={{ marginHorizontal: widthPercentageToDP(1) }}
              />
            </Pressable>
          )}
          <UserAvatar
            userId={userProfile?.id ?? ""}
            imageUrl={userProfile?.imageUrl}
            size={10}
            doLink={false}
          />
          <Pressable onPress={() => setMenuVisible(!menuVisible)}>
            <ThemedIcon
              name="ellipsis-vertical-outline"
              style={{ marginHorizontal: widthPercentageToDP(1) }}
            />
          </Pressable>
        </View>
      ),
      headerTitle: username,
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [navigation, username, menuVisible]);

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
    <View style={{
      marginRight: 8,
      paddingVertical: 10,
    }}>
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
      {/* User Info Segment */}
      <View
        style={{
          marginTop: heightPercentToPD(35),
          marginBottom: heightPercentToPD(3),
          backgroundColor: themeColors.tertiary,
          paddingBottom: heightPercentToPD(5),
          width: widthPercentageToDP(100),
        }}
      >
        {/* User Avatar & Username */}
        <View
          style={{
            alignItems: "center",
            backgroundColor: themeColors.tertiary,
            width: widthPercentageToDP(100),
          }}
        >
          <UserAvatar
            size={50}
            userId={userProfile?.id ?? ""}
            imageUrl={userProfile?.imageUrl}
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
            {userProfile?.username || "Unknown User"}
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
            {userProfile?.description || "No description"}
          </ThemedText>
        </View>

        {/* User Info: Friends, KM, Dogs */}
        <HorizontalView
          justifyOption="space-evenly"
          style={{
            marginBottom: heightPercentToPD(5),
            backgroundColor: themeColors.tertiary,
            width: widthPercentageToDP(100),
          }}
        >
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{
                fontSize: 24,
                lineHeight: 26,
                fontWeight: "bold",
                color: themeColors.textOnSecondary
            }}
            >
              21
            </ThemedText>
            <ThemedText style={{
              fontSize: 12,
              lineHeight: 14,
              color: themeColors.textOnSecondary
            }}>
              friends
            </ThemedText>
          </View>
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{
                fontSize: 24,
                lineHeight: 26,
                fontWeight: "bold",
                color: themeColors.textOnSecondary
            }}
            >
              2
            </ThemedText>
            <ThemedText style={{
              fontSize: 12,
              lineHeight: 14,
              color: themeColors.textOnSecondary
            }}>
              km this week
            </ThemedText>
          </View>
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{
                fontSize: 24,
                lineHeight: 26,
                fontWeight: "bold",
                color: themeColors.textOnSecondary
            }}
            >
              21
            </ThemedText>
            <ThemedText style={{
              fontSize: 12,
              lineHeight: 14,
              color: themeColors.textOnSecondary
            }}>dogs</ThemedText>
          </View>
        </HorizontalView>

        <HorizontalView
          justifyOption="center"
          style={{
            backgroundColor: themeColors.tertiary,
            width: widthPercentageToDP(100),
            justifyContent: "space-around",
            paddingHorizontal: widthPercentageToDP(5),
          }}
        >
          <ThemedButton
            label="Send invitation"
            color={themeColors.tertiary}
            style={{
              width: widthPercentageToDP(40),
              backgroundColor: themeColors.primary,
              borderRadius: 100,
            }}
          />
          <ThemedButton
            label="Message"
            color={themeColors.tertiary}
            style={{
              width: widthPercentageToDP(40),
              backgroundColor: themeColors.primary,
              borderRadius: 100,
            }}
          />
        </HorizontalView>
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
        <ThemedText style={{
          fontSize: 30,
          lineHeight: 32,
          backgroundColor: 'transparent',
          color: themeColors.textOnSecondary
        }}>
          Dogs
        </ThemedText>

        <ThemedButton
          label="Add dog"
          onPress={() => router.push(`/user/${username}/pet/new`)}
          color={themeColors.tertiary}
          style={{
            width: widthPercentageToDP(40),
            backgroundColor: themeColors.primary,
            borderRadius: 100,
          }}
        />
      </View>

      {/* Horizontal FlatList for dogs */}
      <FlatList
        data={dogs}
        keyExtractor={(item) => item.id}
        horizontal
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
      <FlatList // question: why not scrollview? or flatlist (unscrollable) with header dogs and posts as children?
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
                backgroundColor: 'transparent',
                marginLeft: widthPercentageToDP(5),
                marginTop: heightPercentToPD(4),
              }}
            >
              Posts
            </ThemedText>
            <PostFeed />
          </>
        )}
        renderItem={(item) => <></>} // required argument!
      />
      {menuVisible && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            top: heightPercentToPD(14),
            right: widthPercentageToDP(5),
            width: widthPercentageToDP(50),
            backgroundColor: themeColors.tertiary,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: themeColors.primary,
          }}
        >
          <Pressable onPress={() => handleMenuSelect("Edit")}>
            <Text
              style={{
                padding: 20,
                color: themeColors.textOnSecondary,
                borderBottomWidth: 1,
                borderColor: themeColors.primary,
                fontSize: 18,
              }}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable onPress={() => handleMenuSelect("App Settings")}>
            <Text style={{ padding: 20, color: themeColors.textOnSecondary, fontSize: 18 }}>
              App Settings
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
