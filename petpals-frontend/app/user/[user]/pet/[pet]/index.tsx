import React, { useEffect, useState, useLayoutEffect, useContext } from "react";
import {
  SafeAreaView,
  Pressable,
  View,
  Text,
  Alert,
  FlatList,
  ScrollView,
} from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { usePathname, router } from "expo-router";
import { Image } from "react-native-ui-lib";
import { Dog, useDog } from "@/context/DogContext";
import { useNavigation } from "@react-navigation/native";
import { UserContext } from "@/context/UserContext";

// @ts-ignore
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import {
  widthPercentageToDP,
  heightPercentageToDP,
} from "react-native-responsive-screen";
import { useAuth } from "@/hooks/useAuth";
import DogTag from "@/components/display/DogTag";

export default function PetProfileScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const petId = path.split("/").pop();
  const { userId } = useAuth();
  // @ts-ignore
  const { getUserById, userProfile, isProcessing } = useContext(UserContext);

  // States
  const { getDogById } = useDog();
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  const navigation = useNavigation();

  // Colours
  const darkGreen = "#0A2421";
  const lightGreen = "#1C302A";
  const accentGreen = "#B4D779";
  const accentTeal = "#52B8A3";
  const cream = "#FAF7EA";

  const dogTags = [
    "playful",
    "dog-friendly",
    "reserved",
    "puppy",
    "well-mannered",
  ];
  const renderDogTag = ({ item }: { item: string }) => <DogTag tag={item} />;

  // Functions
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  // Get dog data
  useEffect(() => {
    const fetchDogData = async () => {
      try {
        const dogData = await getDogById(petId ?? "");
        setDog(dogData ?? null);
        setImageUri(dogData?.imageUrl ?? null);
      } catch (error) {
        console.error("Failed to fetch dog data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDogData();
  }, [petId]);

  // Customize header layout and options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <View
          style={{
            flexDirection: "row",
            backgroundColor: darkGreen,
            padding: percentToDP(2),
            borderRadius: 100,
          }}
        >
          {/* User Avatar Link to User Profile */}
          <Pressable
            onPress={() => router.push(`/user/${username}`)}
            style={{ marginRight: percentToDP(3) }}
          >
            <UserAvatar
              userId={userId ?? ""}
              size={12}
              doLink={false}
              imageUrl={userProfile.imageUrl}
            />
          </Pressable>

          {/* Three-dots Icon for Dropdown Menu */}
          <Pressable onPress={() => setMenuVisible(!menuVisible)}>
            <ThemedIcon name="ellipsis-vertical-outline" />
          </Pressable>
        </View>
      ),
      headerTitle: dog ? dog.name : "Dog Profile",
    });
  }, [navigation, username, dog, menuVisible]);

  const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    if (option === "Edit") {
      router.push(`/user/${username}/pet/${petId}/edit`);
    } else if (option === "Delete") {
      // TODO
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!dog) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <ThemedText>Dog data not found</ThemedText>
      </SafeAreaView>
    );
  }

  // @ts-ignore
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        <ScrollView
          style={{
            flex: 1,
            backgroundColor: darkGreen,
          }}
        >
          {/* Dog Avatar Container */}
          <View
            style={{
              height: heightPercentToPD(30),
              backgroundColor: lightGreen,
              alignItems: "center",
            }}
          >
            {/* TODO: Background image in the future? */}
          </View>

          {/* Dog Info Container */}
          <View
            style={{
              backgroundColor: darkGreen,
              height: heightPercentToPD(70),
            }}
          >
            {/* Dog Image with Placeholder on Error */}
            <Image
              source={imageUri ? { uri: imageUri } : DogPlaceholderImage}
              style={{
                width: widthPercentageToDP(80),
                height: widthPercentageToDP(80),
                alignSelf: "center",
                marginTop: heightPercentToPD(-25),
                borderWidth: 1,
                borderColor: darkGreen,
              }}
              onError={() => setImageUri(null)}
              borderRadius={20}
            />

            <View
              style={{
                alignItems: "center",
                marginBottom: heightPercentToPD(2),
                backgroundColor: "transparent",
              }}
            >
              <ThemedText
                style={{
                  textAlign: "center",
                  fontSize: 34,
                  letterSpacing: 1,
                  fontWeight: "bold",
                  color: cream,
                  marginTop: heightPercentToPD(2),
                  marginBottom: heightPercentToPD(1),
                }}
              >
                {dog.name}
              </ThemedText>

              <ThemedText
                style={{
                  color: "grey",
                  fontSize: 14,
                  fontStyle: "italic",
                  marginBottom: heightPercentToPD(2),
                }}
              >
                Dog Breed Placeholder
              </ThemedText>

              <FlatList
                data={dogTags}
                horizontal
                scrollEnabled={true}
                style={{
                  width: widthPercentageToDP(80),
                }}
                showsHorizontalScrollIndicator={false}
                renderItem={renderDogTag}
                contentContainerStyle={{
                  flexDirection: "row",
                  backgroundColor: "transparent",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              />

              {/* Separator */}
              <View
                style={{
                  backgroundColor: lightGreen,
                  height: heightPercentToPD(0.5),
                  width: widthPercentageToDP(80),
                  marginTop: heightPercentToPD(2),
                  marginBottom: heightPercentToPD(5),
                }}
              />

              {/* Dog Description */}
              <ThemedText
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  fontSize: 15,
                  color: cream,
                  paddingHorizontal: widthPercentageToDP(10),
                }}
              >
                {dog.description || "No description available"}
              </ThemedText>

              {/* Separator */}
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: lightGreen,
                  height: heightPercentToPD(0.5),
                  width: widthPercentageToDP(80),
                  marginTop: heightPercentToPD(5),
                  marginBottom: heightPercentToPD(2),
                }}
              />
            </View>

            <View
              style={{
                flexDirection: "row",
                width: widthPercentageToDP(50),
                marginHorizontal: "auto",
                alignContent: "center",
                marginBottom: heightPercentToPD(5),
              }}
            >
              <ThemedText
                style={{
                  width: widthPercentageToDP(70),
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                  color: cream,
                }}
              >
                Weight
              </ThemedText>

              <ThemedText
                style={{
                  width: widthPercentageToDP(70),
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                  color: cream,
                }}
              >
                Age
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                width: widthPercentageToDP(50),
                marginHorizontal: "auto",
                alignContent: "center",
              }}
            >
              <ThemedText
                style={{
                  width: widthPercentageToDP(70),
                  textAlign: "center",
                  fontWeight: "bold",
                  fontSize: 15,
                  color: cream,
                }}
              >
                Owner:
              </ThemedText>
              <ThemedText
                style={{
                  width: widthPercentageToDP(70),
                  textAlign: "center",
                  fontSize: 15,
                  color: "gray",
                }}
              >
                {username}
              </ThemedText>
            </View>
          </View>
        </ScrollView>
      </ThemedView>

      {/* Dropdown Menu */}
      {menuVisible && (
        <View
          style={{
            position: "absolute",
            zIndex: 100,
            elevation: 100,
            top: heightPercentToPD(0),
            right: widthPercentageToDP(5),
            width: widthPercentageToDP(50),
            backgroundColor: darkGreen,

            borderRadius: 5,
            shadowOpacity: 0.3,
            shadowRadius: 10,
            borderWidth: 1,
            borderColor: accentGreen,
            alignContent: "space-evenly",
            justifyContent: "space-evenly",
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
          <Pressable onPress={() => handleMenuSelect("Delete")}>
            <Text
              style={{
                padding: 20,
                color: cream,
                fontSize: 18,
              }}
            >
              Delete
            </Text>
          </Pressable>
        </View>
      )}
    </SafeAreaView>
  );
}
