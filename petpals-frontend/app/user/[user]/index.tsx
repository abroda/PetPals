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
import { useNavigation, usePathname, router } from "expo-router";
import { widthPercentageToDP } from "react-native-responsive-screen";
import PostFeed from "@/components/lists/PostFeed";
import { Dog, useDog } from "@/context/DogContext";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import { useUser } from "@/hooks/useUser";

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
  const darkGreen = "#0A2421";
  const lightGreen = "#1C302A";
  const accentGreen = "#B4D779";
  const accentTeal = "#52B8A3";
  const cream = "#FAF7EA";

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
            backgroundColor: darkGreen,
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
            imageUrl={userProfile?.imageUrl || null}
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
    });
  }, [navigation, username, menuVisible]);

  const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    if (option === "Edit") {
      router.push("/user/me/editProfile");
    } else if (option === "App Settings") {
      router.push("/settings");
    }
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  const renderDogItem = ({ item }: { item: any }) => (
    <View style={{ marginRight: 8, paddingVertical: 10 }}>
      <View
        style={{
          width: widthPercentageToDP(40),
          height: widthPercentageToDP(63),
          backgroundColor: darkGreen,
          padding: widthPercentageToDP(3),
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <PetAvatar
          size={35}
          source={item.imageUrl}
          username={userProfile?.username ?? ""}
          pet={item.name}
          petId={item.id}
          doLink={true}
        />
        <ThemedText
          style={{
            fontSize: 22,
            color: cream,
            fontWeight: "bold",
            marginTop: heightPercentToPD(1),
          }}
        >
          {item.name}
        </ThemedText>
        <ThemedText
          numberOfLines={2}
          ellipsizeMode="tail"
          style={{
            fontSize: 14,
            color: cream,
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
      }}
    >
      {/* User Info Segment */}
      <View
        style={{
          marginTop: heightPercentToPD(20),
          marginBottom: heightPercentToPD(3),
          backgroundColor: darkGreen,
          paddingBottom: heightPercentToPD(5),
          width: widthPercentageToDP(100),
        }}
      >
        {/* User Avatar & Username */}
        <View
          style={{
            alignItems: "center",
            backgroundColor: darkGreen,
            width: widthPercentageToDP(100),
          }}
        >
          <UserAvatar
            size={50}
            userId={userProfile?.id ?? ""}
            imageUrl={userProfile?.imageUrl || null}
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
              color: cream,
              marginVertical: heightPercentToPD(1),
            }}
          >
            {userProfile?.username || "Unknown User"}
          </ThemedText>
          <ThemedText
            style={{
              width: widthPercentageToDP(85),
              fontSize: 15,
              textAlign: "center",
              color: cream,
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
            backgroundColor: darkGreen,
            width: widthPercentageToDP(100),
          }}
        >
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{ fontSize: 24, fontWeight: "bold", color: cream }}
            >
              21
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: cream }}>
              friends
            </ThemedText>
          </View>
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{ fontSize: 24, fontWeight: "bold", color: cream }}
            >
              2
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: cream }}>
              km this week
            </ThemedText>
          </View>
          <View style={{ alignItems: "center" }}>
            <ThemedText
              style={{ fontSize: 24, fontWeight: "bold", color: cream }}
            >
              21
            </ThemedText>
            <ThemedText style={{ fontSize: 12, color: cream }}>dogs</ThemedText>
          </View>
        </HorizontalView>

        <HorizontalView
          justifyOption="center"
          style={{
            backgroundColor: darkGreen,
            width: widthPercentageToDP(100),
            justifyContent: "space-around",
            paddingHorizontal: widthPercentageToDP(5),
          }}
        >
          <ThemedButton
            label="Send invitation"
            color={darkGreen}
            style={{
              width: widthPercentageToDP(40),
              backgroundColor: accentGreen,
              borderRadius: 100,
            }}
          />
          <ThemedButton
            label="Message"
            color={darkGreen}
            style={{
              width: widthPercentageToDP(40),
              backgroundColor: accentGreen,
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
        <ThemedText style={{ fontSize: 30, color: cream }}>Dogs</ThemedText>
        <ThemedButton
          label="Add dog"
          onPress={() => router.push(`/user/${username}/pet/new`)}
          color={darkGreen}
          style={{
            width: widthPercentageToDP(40),
            backgroundColor: accentGreen,
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
        backgroundColor: lightGreen,
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
              style={{
                fontSize: 30,
                color: cream,
                marginLeft: widthPercentageToDP(5),
                marginTop: heightPercentToPD(4),
              }}
            >
              Posts
            </ThemedText>
            <PostFeed />
          </>
        )}
        renderItem={(item) => <View />} // TODO ???
      />
      {menuVisible && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            top: heightPercentToPD(0),
            right: widthPercentageToDP(5),
            width: widthPercentageToDP(50),
            backgroundColor: darkGreen,
            borderRadius: 5,
            borderWidth: 1,
            borderColor: accentGreen,
          }}
        >
          <Pressable onPress={() => handleMenuSelect("Edit")}>
            <Text
              style={{
                padding: 20,
                color: cream,
                borderBottomWidth: 1,
                borderColor: accentGreen,
                fontSize: 18,
              }}
            >
              Edit
            </Text>
          </Pressable>
          <Pressable onPress={() => handleMenuSelect("App Settings")}>
            <Text style={{ padding: 20, color: cream, fontSize: 18 }}>
              App Settings
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
