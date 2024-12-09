import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import {
  SafeAreaView,
  TextInput,
  Alert,
  Image,
  ScrollView,
  View,
  Pressable,
} from "react-native";
import {Dog, Tag, useDog} from "@/context/DogContext";
import { useAuth } from "@/hooks/useAuth";
import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import * as ImagePicker from "expo-image-picker";
import {router, useNavigation, useRouter} from "expo-router";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { Assets } from "react-native-ui-lib";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
// const DogPlaceholderImage = Assets.getAssetByPath(
//   "@/assets/images/dog_placeholder_theme-color-fair.png"
// );
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import TagSelector from "@/components/display/DogTagSelector";
import BreedInputField from "@/components/inputs/BreedInputField";



export default function NewPetScreen() {
  const { userId } = useAuth();
  const router = useRouter();

  const {addDog, getDogById, updateDog, updateDogPicture, getAvailableTags} = useDog();

  // Dog Info
  const [dog, setDog] = useState<Dog | null>(null);

  const [dogName, setDogName] = useState("");
  const [dogDescription, setDogDescription] = useState("");
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [newBreed, setNewBreed] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newWeight, setNewWeight] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const [availableTags, setAvailableTags] = useState<Record<string, Tag[]>>({});
  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>({});

  const [isSaving, setIsSaving] = useState(false); // Track saving state

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const widthPercentToPD = useWindowDimension("width");

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  const fetchTags = useCallback(async () => {
    try {
      const tagsByCategory = await getAvailableTags();
      console.log("[Pet/New] Fetched Tags:", tagsByCategory);

      // Restructure the data so each category directly contains the tags
      const groupedTags = tagsByCategory.reduce(
        // @ts-ignore
        (acc: Record<string, Tag[]>, categoryObj: { category: string; tags: Tag[] }) => {
          acc[categoryObj.category] = categoryObj.tags; // Assign tags directly under the category
          return acc;
        },
        {}
      );
      console.log("[Pet/New] Grouped Tags After Processing:", groupedTags);
      // @ts-ignore
      setAvailableTags(groupedTags);
    } catch (error) {
      console.error("[Pet/New] Failed to fetch tags:", error);
    }
  }, [getAvailableTags]);

  useEffect(() => {
    fetchTags();
  }, []);



  if (!userId) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user profile...</ThemedText>
      </SafeAreaView>
    );
  }

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


  const handleAddDog = async () => {
    if (!dogName.trim()) {
      Alert.alert("Validation", "Dog name is required.");
      return;
    }

    setIsSaving(true);
    try {
      // Flatten selectedTags into a single array of tag IDs
      const tagIds = Object.values(selectedTags).flat();
      console.log("[NewDog] Tags sent: ", tagIds);

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


      // Prepare dog data with tags as an array
      const dogData = {
        name: dogName,
        description: dogDescription,
        breed: newBreed,
        age: ageValue,
        weight: weightValue,
        tagIds: tagIds, // Make sure to use `tagIds` if this is what your backend expects
      };

      console.log("[NewDog] Dog data being sent: ", dogData);

      // Add the dog without the image first
      const newDog = await addDog(userId, dogData);

      console.log("[NewDog] New dog response: ", newDog);

      // Update the dog's image if a new one was picked
      if (imageUri && newDog?.id) {
        console.log("[NewDog] Uploading image for dog ID: ", newDog.id);

        const response = await fetch(imageUri);
        const blob = await response.blob();

        const formData = new FormData();
        formData.append("file", {
          uri: imageUri,
          name: "dog_image.jpg",
          type: blob.type,
        } as unknown as File);

        console.log("[NewDog] FormData prepared: ", formData);

        await updateDogPicture(newDog.id, formData);

        console.log("[NewDog] Image uploaded successfully");
      }

      Alert.alert("Success", "Dog added successfully!");
      setIsSaving(false);
      router.back(); // Go back to the previous screen
    } catch (error) {
      console.error("[NewDog] Failed to add dog: ", error);
      Alert.alert("Error", "Failed to add dog.");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          flex: 1,
          backgroundColor: themeColors.secondary,
        }}
      >
        <ScrollView
          style={{
            backgroundColor: themeColors.secondary,
          }}
        >
          <View
            style={{
              backgroundColor: themeColors.secondary,
              height: heightPercentToPD(30),
            }}
          ></View>
          <View
            style={{
              backgroundColor: themeColors.tertiary,
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
                  marginTop: heightPercentageToDP(-20),
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
                width: widthPercentToPD(80),
                alignSelf: "center",
                justifyContent: "center",
              }}
            >
              {/* Dog name */}
              <ThemedText
                style={{
                  color: themeColors.primary,
                  fontSize: 14,
                  zIndex: 3,
                  marginLeft: widthPercentToPD(2),
                  backgroundColor: "transparent",
                }}
              >
                Dog Name
              </ThemedText>

              <TextInput
                placeholder="Enter dog's name"
                placeholderTextColor={"#CAC8BE"}
                value={dogName}
                onChangeText={setDogName}
                maxLength={12}
                style={{
                  paddingHorizontal: widthPercentToPD(6),
                  paddingVertical: widthPercentToPD(2),
                  borderRadius: 10,
                  borderColor: themeColors.secondary,
                  borderWidth: 1,
                  fontSize: 14,
                  color: themeColors.textOnSecondary,
                  marginBottom: heightPercentToPD(2),
                }}
              />

              {/* Description */}
              <ThemedText
                style={{
                  color: themeColors.primary,
                  fontSize: 14,
                  marginLeft: widthPercentToPD(2),
                  backgroundColor: "transparent",
                }}
              >
                Description
              </ThemedText>
              <TextInput
                placeholder="Enter description"
                placeholderTextColor={"#CAC8BE"}
                value={dogDescription}
                onChangeText={setDogDescription}
                multiline
                numberOfLines={4}
                maxLength={200}
                style={{
                  paddingHorizontal: widthPercentToPD(6),
                  paddingVertical: widthPercentToPD(2),
                  borderRadius: percentToDP(4),
                  borderColor: themeColors.secondary,
                  borderWidth: 1,
                  fontSize: 14,
                  textAlignVertical: "top",
                  color: themeColors.textOnSecondary,
                  marginBottom: heightPercentToPD(2),
                }}
              />


              {/* Breed */}
              <ThemedText
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  fontSize: percentToDP(4),
                  fontWeight: "light",
                  marginBottom: heightPercentageToDP(0),
                  marginLeft: heightPercentageToDP(3),
                  zIndex: 10,
                }}
              >
                Breed
              </ThemedText>
              {/*<TextInput*/}
              {/*  style={{*/}
              {/*    paddingHorizontal: percentToDP(7),*/}
              {/*    paddingVertical: percentToDP(3),*/}
              {/*    borderRadius: percentToDP(5),*/}
              {/*    borderWidth: 1,*/}
              {/*    borderColor: themeColors.secondary,*/}
              {/*    color: themeColors.textOnSecondary,*/}
              {/*    fontSize: percentToDP(4),*/}
              {/*    letterSpacing: 0.5,*/}
              {/*    marginBottom: heightPercentageToDP(2),*/}
              {/*  }}*/}
              {/*  value={newBreed}*/}
              {/*  maxLength={48}*/}
              {/*  onChangeText={setNewBreed}*/}
              {/*  placeholder="Dog's Breed"*/}
              {/*  placeholderTextColor="#AAA"*/}
              {/*/>*/}
              <BreedInputField
                newBreed={newBreed}
                setNewBreed={setNewBreed}
                themeColors={themeColors}
                percentToDP={percentToDP}
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



              {isSaving ? (
                <ThemedText
                  textColorName={"primary"}
                  style={{
                    width: widthPercentToPD(80),
                    fontSize: percentToDP(4),
                    lineHeight: percentToDP(4),
                    marginVertical: heightPercentToPD(2),
                    textAlign: "center",
                  }}
                >
                  Creating new dog...
                </ThemedText>
              ) : null}

              <ThemedButton
                label="Save"
                color={isSaving ? themeColors.tertiary : themeColors.primary}
                onPress={handleAddDog}
                disabled={isSaving} // Disable button while saving
                style={{
                  width: widthPercentageToDP(80),
                  backgroundColor: isSaving
                    ? themeColors.primary
                    : "transparent",
                  paddingVertical: percentToDP(2),
                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                  borderColor: themeColors.primary,
                  marginBottom: heightPercentageToDP(1),
                }}
              />
            </View>
          </View>
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
