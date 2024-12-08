import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useContext,
  useCallback,
} from "react";
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
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import {usePathname, router, useNavigation} from "expo-router";
import { Image } from "react-native-ui-lib";

import {Dog, Tag, useDog} from "@/context/DogContext";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";

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

  const { getDogById, deleteDog, getAvailableTags, getTagById } = useDog();

  // States
  const [dog, setDog] = useState<Dog | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [menuVisible, setMenuVisible] = useState(false);
  const [imageUri, setImageUri] = useState<string | null>(null);
  // const navigation = useNavigation();

  const [flatListTags, setFlatListTags] = useState<Tag[]>([]);

  const fetchDogData = useCallback(async () => {
    try {
      console.log("[Pet/Index] getDogById: ", petId)
      if(petId){
        const dogData = await getDogById(petId ?? "");
        setDog(dogData);
        setImageUri(dogData?.imageUrl ?? null);
        console.log("[Pet/Index] Dog was fetched: ", dogData);
      }

    } catch (error) {
      console.error("[Pet/Index] Failed to fetch dog data:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Get dog data
  useEffect(() => {
    fetchDogData();
  }, [petId]);

  useEffect(() => {
    if (dog?.tags) {
      const allTags: Tag[] = dog.tags.flatMap((category) => {
        // Check if `tags` exists in the category and return them
        return category.tags?.map((tag) => ({
          id: tag.id,
          tag: tag.tag,
          category: category.category, // Include category if needed
        })) || [];
      });

      console.log("[Dog/Index] Fetched Tags for FlatList:", allTags);
      setFlatListTags(allTags);
    }
  }, [dog]);




  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  const navigation = useNavigation();

  const dogTags = [
    "playful",
    "dog-friendly",
    "reserved",
    "puppy",
    "well-mannered",
  ];
  // Display Dog Tags
  const renderDogTag = ({ item }: { item: Tag }) => (
    <DogTag id={item.id} tag={item.tag} category={item.category} />
  );

  // Functions
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");





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


          {/* Three-dots Icon for Dropdown Menu */}
          <Pressable
            onPressOut={() => setMenuVisible(!menuVisible)}
            style={{
              padding: percentToDP(2),
            }}
          >
            <ThemedIcon name="ellipsis-vertical-outline" />
          </Pressable>
        </View>
      ),
      headerTitle: dog ? dog.name : "Dog Profile",
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [navigation, username, dog, menuVisible]);


  const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    if (option === "Edit") {
      router.push(`/user/${username}/pet/${petId}/edit`);
    } else if (option === "Delete") {
      handleDeleteDog();
    }
  };


  const handleDeleteDog = async () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this dog?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteDog(petId ?? ""); // Call deleteDog from the context
              Alert.alert("Success", "Successfully deleted dog");
              router.back(); // Navigate back to the user profile
            } catch (error) {
              console.error("Failed to delete dog:", error);
              Alert.alert("Error", "Failed to delete dog");
            }
          },
        },
      ],
      { cancelable: true }
    );
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
            backgroundColor: themeColors.tertiary,
          }}
        >
          {/* Dog Avatar Container */}
          <View
            style={{
              height: heightPercentToPD(30),
              backgroundColor: themeColors.secondary,
              alignItems: "center",
            }}
          >
            {/* TODO: Background image in the future? */}
          </View>

          {/* Dog Info Container */}
          <View
            style={{
              backgroundColor: themeColors.tertiary,
              width: widthPercentageToDP(100),
              paddingBottom: percentToDP(10),
            }}
          >
            {/* Dog Image with Placeholder on Error */}
            <Image
              source={imageUri ? { uri: imageUri } : DogPlaceholderImage}
              style={{
                width: widthPercentageToDP(75),
                height: widthPercentageToDP(75),
                alignSelf: "center",
                marginTop: percentToDP(-30),
                borderWidth: 1,
                borderColor: themeColors.tertiary,
              }}
              onError={() => setImageUri(null)}
              borderRadius={20}
            />

            <View
              style={{
                alignItems: "center",
              }}
            >

              {/* Name */}
              <ThemedText
                textColorName={"textOnSecondary"}
                textStyleOptions={{size: 'veryBig', weight: 'bold'}}
                style={{
                  textAlign: "center",
                  marginTop: heightPercentToPD(2),
                  marginBottom: heightPercentToPD(1),
                }}
              >
                {dog.name}
              </ThemedText>


              {/* Breed */}
              <ThemedText
                textColorName={"placeholderText"}
                textStyleOptions={{size: "tiny", }}
                style={{
                  fontStyle: "italic",
                  fontWeight: 'light',
                  marginBottom: heightPercentToPD(2),
                }}
              >
                {dog.breed ? dog.breed : "Unknown Breed"}
              </ThemedText>


              {/* Dog Tags */}
              {flatListTags?.length ? (
                <FlatList
                  data={flatListTags}
                  keyExtractor={(item) => item.id}
                  renderItem={renderDogTag}
                  horizontal={true}
                  scrollEnabled={true}
                  showsHorizontalScrollIndicator={false}
                  style={{
                    width: widthPercentageToDP(80),
                  }}
                  contentContainerStyle={{
                    flexDirection: "row",
                    backgroundColor: 'transparent',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}
                />
              ) : (
                <ThemedText
                  textColorName={"tertiary"}
                  textStyleOptions={{size: "tiny"}}
                  style={{
                    backgroundColor: themeColors.primary,
                    borderRadius: widthPercentageToDP(5), // Strongly rounded rectangle
                    paddingVertical: widthPercentageToDP(1),
                    paddingHorizontal: widthPercentageToDP(1.8),
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: widthPercentageToDP(0.7),
                    fontWeight: 'bold',
                  }}
                >
                  No tags yet
                </ThemedText>
              )}


              {/* Separator */}
              <View
                style={{
                  backgroundColor: themeColors.secondary,
                  height: heightPercentToPD(0.6),
                  width: widthPercentageToDP(80),
                  marginTop: heightPercentToPD(2),
                  marginBottom: heightPercentToPD(5),
                }}
              />

              {/* Dog Description */}
              <ThemedText
                textStyleOptions={{size: "medium"}}
                textColorName={"textOnSecondary"}
                style={{
                  backgroundColor: "transparent",
                  textAlign: "center",
                  paddingHorizontal: widthPercentageToDP(10),
                }}
              >
                {dog.description || "No description available"}
              </ThemedText>

              {/* Separator */}
              <View
                style={{
                  alignSelf: "center",
                  backgroundColor: themeColors.secondary,
                  height: heightPercentToPD(0.6),
                  width: widthPercentageToDP(80),
                  marginTop: heightPercentToPD(5),
                  marginBottom: heightPercentToPD(2),
                }}
              />
            </View>

            {/* Horizontal box for weight and age */}
            <View
              style={{
                flexDirection: "row",
                width: widthPercentageToDP(80),
                marginHorizontal: 'auto',
                alignContent: "center",
                justifyContent:'center',
              }}>

              {/* Weight */}
              <View style={{
                flexDirection: 'column',
                marginHorizontal: 'auto',
                padding: percentToDP(2),
              }}>
                {dog.weight && dog.weight != 0 ? (
                  <ThemedText
                    textStyleOptions={{size: "veryBig", weight: "bold"}}
                    style={{
                      textAlign: "center",
                    }}>
                    {dog.weight}
                  </ThemedText>) : (

                  <ThemedText
                    textStyleOptions={{size: "veryBig", weight: "bold"}}
                    style={{
                      textAlign: "center",
                    }}>
                  -
                  </ThemedText>)
                }

                <ThemedText style={{
                  textAlign: "center",
                }}>
                  kg of weight
                </ThemedText>
              </View>

              {/* Age */}
              <View style={{
                flexDirection: 'column',
                marginHorizontal: 'auto',
                padding: percentToDP(2),
              }}>
                {dog.age && dog.age != 0 ? (
                  <ThemedText
                    textColorName={"textOnSecondary"}
                    textStyleOptions={{size: "veryBig", weight: "bold"}}
                    style={{
                      textAlign: "center",
                    }}>
                    {dog.age}
                  </ThemedText>) : (
                  <ThemedText textStyleOptions={{size: "veryBig", weight: "bold"}}
                    style={{
                      textAlign: "center",
                  }}>
                    -
                  </ThemedText>
                )}
                <ThemedText style={{

                  textAlign: "center",
                }}>
                  years old
                </ThemedText>
              </View>

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
            top: heightPercentToPD(15),
            right: widthPercentageToDP(4),
            width: widthPercentageToDP(50),
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
          <Pressable onPressOut={() => handleMenuSelect("Edit")}>
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
          <Pressable onPressOut={() => handleMenuSelect("Delete")}>
            <Text
              style={{
                padding: percentToDP(5),
                color: themeColors.primary,
                fontSize: percentToDP(4.5),
                lineHeight: percentToDP(5),
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
