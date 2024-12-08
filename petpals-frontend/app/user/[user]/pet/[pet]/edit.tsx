import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import {
  SafeAreaView,
  TextInput,
  Alert,
  View,
  Pressable,
  Text,
  ScrollView,
  TouchableOpacity, FlatList,
} from "react-native";
import {usePathname, router} from "expo-router";
import {ThemedText} from "@/components/basic/ThemedText";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {Dog, Tag, useDog} from "@/context/DogContext";
import * as ImagePicker from "expo-image-picker";
import {Image} from "react-native-ui-lib";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {useNavigation} from "expo-router";

// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import TagSelector from "@/components/display/DogTagSelector";


export default function EditDogProfileScreen() {

  const path = usePathname();
  const username = path.split("/")[2];
  const petId = path.split("/")[4];
  const navigation = useNavigation();
  const percentToDP = useWindowDimension("shorter");

  const title = "Edit Dog";

  const {getDogById, updateDog, updateDogPicture, getAvailableTags} = useDog();

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  // State
  const [dog, setDog] = useState<Dog | null>(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [availableTags, setAvailableTags] = useState<Record<string, Tag[]>>({});
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});


  const fetchDogData = useCallback(async () => {
    try {
      const dogData = await getDogById(petId);
      setDog(dogData);
      setName(dogData?.name ?? "");
      setDescription(dogData?.description ?? "");
      setNewAge(dogData?.age?.toString() ?? "");
      setNewBreed(dogData?.breed ?? "");
      setNewWeight(dogData?.weight?.toString() ?? "");
      setTags(dogData?.tags.map((tag) => tag.id) ?? []);
      setImageUri(dogData?.imageUrl ?? null);

      // Construct initialSelectedTags for DogTagSelector
      const initialSelectedTags: Record<string, string[]> = {};
      dogData?.tags.forEach((category) => {
        if (category.tags) {
          category.tags.forEach((tag) => {
            if (!initialSelectedTags[category.category]) {
              initialSelectedTags[category.category] = [];
            }
            initialSelectedTags[category.category].push(tag.id);
          });
        }
      });
      setSelectedTags(initialSelectedTags);
      console.log("[EditDogProfileScreen] Initial Selected Tags: ", initialSelectedTags);
    } catch (error) {
      console.error("[EditDogScreen] Failed to fetch dog data:", error);
    }
  }, [petId]);

  // const fetchDogData = useCallback(async () => {
  //   try {
  //     const dogData = await getDogById(petId);
  //     setDog(dogData);
  //     setName(dogData?.name ?? "");
  //     setDescription(dogData?.description ?? "");
  //     setTags(dogData?.tags.map((tag) => tag.id) ?? []);
  //     setImageUri(dogData?.imageUrl ?? null);
  //   } catch (error) {
  //     console.error("[EditDogScreen] Failed to fetch dog data:", error);
  //   }
  // }, []);


  const fetchTags = useCallback(async () => {
    try {
      const tagsByCategory = await getAvailableTags();
      console.log("[EditDogScreen] Fetched Tags:", tagsByCategory);

      // Restructure the data so each category directly contains the tags
      const groupedTags = tagsByCategory.reduce(
        (acc: Record<string, Tag[]>, categoryObj: { category: string; tags: Tag[] }) => {
          acc[categoryObj.category] = categoryObj.tags; // Assign tags directly under the category
          return acc;
        },
        {}
      );
      console.log("[EditDogScreen] Grouped Tags After Processing:", groupedTags);
      setAvailableTags(groupedTags);
    } catch (error) {
      console.error("[EditDogScreen] Failed to fetch tags:", error);
    }
  }, [getAvailableTags]);

  useEffect(() => {
    fetchDogData();
    fetchTags();
  }, [petId]);


  // Image Picker
  const handlePickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  // Handle Save
  const handleSave = async () => {
    try {
      // Flatten selectedTags into a single array of tag IDs
      const tagIds = Object.values(selectedTags).flat();
      console.log("[EditDog] Tags sent: ", tagIds);

      // Weight validation - checks if 0 <= weight < 130
      // and rounds weight to 0.1
      let weightValue = Number(Number(newWeight).toFixed(1));
      if (isNaN(weightValue) || Number(newWeight) <= 0 || Number(newWeight)>130.0) {
        Alert.alert("Validation", "Weight must be a valid number (0.1 - 130) with one decimal point");
        // @ts-ignore
        weightValue = null;
        return;
      }

      // Age validation - checks if 0 <= age < 35
      let ageValue = Number(Number(newAge).toFixed(0));
      if (isNaN(ageValue) || Number(newAge) <= 0 || Number(newAge) > 35) {
        Alert.alert("Validation", "Age must be a valid number (1-35)");
        // @ts-ignore
        ageValue = null;
      }


      // Update the dog's information
      await updateDog(petId, {
        name: name,
        description: description,
        breed: newBreed,
        age: ageValue,
        weight: weightValue,
        tags: tagIds, // Convert to tag objects
      });

      // Update the dog's image if a new one was picked
      if (imageUri && imageUri !== dog?.imageUrl) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          name: "dog_image.jpg",
          type: blob.type,
        } as unknown as File);
        await updateDogPicture(petId, formData);
      }

      Alert.alert("Success", "Dog profile updated successfully!");
      router.back();
    } catch (error) {
      console.error("Failed to update dog profile:", error);
      Alert.alert("Error", "Failed to update dog profile.");
    }
  };

  const handleTagToggle = (tagId: string, category: string, isMulti: boolean) => {
    setTags((prevTags) => {
      if (isMulti) {
        // Multi-choice: Add or remove the tag
        if (prevTags.includes(tagId)) {
          return prevTags.filter((id) => id !== tagId);
        } else {
          return [...prevTags, tagId];
        }
      } else {
        // Single-choice: Replace all tags of the same category
        const tagsWithoutCategory = prevTags.filter(
          (id) => !availableTags[category].some((tag) => tag.id === id)
        );
        return [...tagsWithoutCategory, tagId];
      }
    });
  };

  const isTagSelected = (tagId: string) => tags.includes(tagId);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Dog",
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, []);

  return (

    <SafeAreaView
      style={{
        flex: 1,

      }}
    >
      <ScrollView scrollEnabled={true} style={{
        flexGrow: 1,
        paddingBottom: percentToDP(5),
      }}>
        <ThemedView
          style={{
            flex: 1,
          }}
        >

          {/* Background rectangle */}
          <View
            style={{
              height: heightPercentageToDP(30),
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
              paddingHorizontal: percentToDP(10),
              paddingBottom: percentToDP(10),
            }}
          >
            {/* Change Dog Image */}
            <Pressable
              onPress={handlePickImage}
              style={{
                alignItems: "center",
              }}
            >
              <Image
                source={imageUri ? {uri: imageUri} : DogPlaceholderImage}
                style={{
                  width: widthPercentageToDP(80),
                  height: widthPercentageToDP(80),
                  marginTop: heightPercentageToDP(-15),
                  borderWidth: 1,
                  borderColor: themeColors.tertiary,
                }}
                onError={() => setImageUri(null)}
                borderRadius={percentToDP(8)}
              />

              <ThemedText
                style={{
                  textAlign: "center",
                  color: themeColors.primary,
                  marginTop: heightPercentageToDP(-6),
                  marginBottom: heightPercentageToDP(4),
                  backgroundColor: themeColors.secondary,
                  opacity: 0.9,
                  borderRadius: percentToDP(100),
                  padding: percentToDP(1),
                  fontSize: 16,
                }}
              >
                Click to change picture
              </ThemedText>
            </Pressable>

            <View
              style={{
                marginHorizontal: "auto",
                marginTop: percentToDP(2),
                width: widthPercentageToDP(80),
                justifyContent: "space-evenly",
                alignContent: "space-evenly",
                backgroundColor: themeColors.tertiary,
              }}
            >
              {/* Dog Name */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Name
              </ThemedText>
              <TextInput
                style={{
                  paddingHorizontal: percentToDP(7),
                  paddingVertical: percentToDP(3),
                  borderRadius: percentToDP(5),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: themeColors.textOnSecondary,
                  fontSize: percentToDP(4),
                  letterSpacing: 0.5,
                  marginBottom: heightPercentageToDP(2),
                }}
                value={name}
                maxLength={48}
                onChangeText={setName}
                placeholder="Dog's Name"
                placeholderTextColor="#AAA"
              />

              {/* Dog Description */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Description
              </ThemedText>
              <TextInput
                style={{
                  paddingHorizontal: percentToDP(7),
                  paddingVertical: percentToDP(3),
                  borderRadius: percentToDP(5),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: themeColors.textOnSecondary,
                  fontSize: percentToDP(4),
                  letterSpacing: 0.5,
                  marginBottom: heightPercentageToDP(2),
                }}
                value={description}
                onChangeText={setDescription}
                placeholder="Description"
                placeholderTextColor="#AAA"
                maxLength={200}
                multiline
              />

              {/* Breed */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Breed
              </ThemedText>
              <TextInput
                style={{
                  paddingHorizontal: percentToDP(7),
                  paddingVertical: percentToDP(3),
                  borderRadius: percentToDP(5),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: themeColors.textOnSecondary,
                  fontSize: percentToDP(4),
                  letterSpacing: 0.5,
                  marginBottom: heightPercentageToDP(2),
                }}
                value={newBreed}
                maxLength={48}
                onChangeText={setNewBreed}
                placeholder="Dog's Breed"
                placeholderTextColor="#AAA"
              />

              {/* Age */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Age
              </ThemedText>
              <TextInput
                keyboardType={"numeric"}
                style={{
                  paddingHorizontal: percentToDP(7),
                  paddingVertical: percentToDP(3),
                  borderRadius: percentToDP(5),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: themeColors.textOnSecondary,
                  fontSize: percentToDP(4),
                  letterSpacing: 0.5,
                  marginBottom: heightPercentageToDP(2),
                }}
                value={newAge}
                onChangeText={setNewAge}
                placeholder="Dog's Age (in years)"
                placeholderTextColor="#AAA"
              />

              {/* Weight */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Weight
              </ThemedText>
              <TextInput
                keyboardType={"numeric"}
                style={{
                  paddingHorizontal: percentToDP(7),
                  paddingVertical: percentToDP(3),
                  borderRadius: percentToDP(5),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: themeColors.textOnSecondary,
                  fontSize: percentToDP(4),
                  letterSpacing: 0.5,
                  marginBottom: heightPercentageToDP(2),
                }}
                value={newWeight}
                onChangeText={setNewWeight}
                placeholder="Dog's Weight (in kg)"
                placeholderTextColor="#AAA"
              />

              {/* Tags */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(-1),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 2,
                }}
              >
                Tags
              </ThemedText>

              <View style={{
                borderWidth: 1,
                borderColor: themeColors.secondary,
                borderRadius: percentToDP(5),
                paddingVertical: percentToDP(5),
                paddingHorizontal: percentToDP(2),
                marginBottom: percentToDP(10),
              }}>
                <TagSelector
                  availableTags={availableTags}
                  selectedTags={selectedTags} // Pass initial selected tags
                  onTagSelectionChange={setSelectedTags} // Capture tag selections
                />
              </View>



              <ThemedButton
                label="Save"
                onPress={handleSave}
                color={themeColors.primary}
                style={{
                  width: widthPercentageToDP(80),
                  backgroundColor: "transparent",
                  paddingVertical: percentToDP(2),
                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                  borderColor: themeColors.primary,
                  marginBottom: heightPercentageToDP(1),
                }}
              />
            </View>
          </View>

        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}
