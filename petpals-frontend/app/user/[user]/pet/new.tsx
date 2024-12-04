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
import { useDog } from "@/context/DogContext";
import { useAuth } from "@/hooks/useAuth";
import React, { useLayoutEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { router, useRouter } from "expo-router";
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
import UserAvatar from "@/components/navigation/UserAvatar";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useNavigation } from "@react-navigation/native";

export default function NewPetScreen() {
  // @ts-ignore
  const { addDog, updateDogPicture } = useDog();
  const { userId } = useAuth();
  const router = useRouter();

  // Dog Info
  const [dogName, setDogName] = useState("");
  const [dogDescription, setDogDescription] = useState("");
  const [dogTags, setDogTags] = useState("");
  const [image, setImage] = useState<string | null>(null);
  const [breed, setBreed] = useState("");
  const [weight, setWeight] = useState("");
  const [age, setAge] = useState("");

  const [isSaving, setIsSaving] = useState(false); // Track saving state

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const widthPercentToPD = useWindowDimension("width");

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];
  // const navigation = useNavigation();

  // useLayoutEffect(() => {
  //   navigation.setOptions({
  //     headerTitle: "Create new dog",
  //     headerStyle: {
  //       backgroundColor: themeColors.secondary,
  //     },
  //   });
  // }, [navigation]);

  if (!userId) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user profile...</ThemedText>
      </SafeAreaView>
    );
  }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
    // @ts-ignore
    console.log("New image was set to const: ", result.assets[0].uri);
  };

  const handleAddDog = async () => {
    if (!dogName.trim()) {
      Alert.alert("Validation", "Dog name is required.");
      return;
    }

    setIsSaving(true);
    try {
      // Prepare dog data with tags as an array
      const dogData = {
        name: dogName,
        description: dogDescription,
        tagIds: dogTags ? dogTags.split(",").map((tag) => tag.trim()) : [],
      };

      // Add the dog without the image first
      // @ts-ignore
      const newDog = await addDog(userId, dogData);
      console.log("New dog data: ", newDog);
      console.log("New dog id: ", newDog?.id);

      // If there’s an image selected and the new dog was successfully created
      if (image && newDog?.id) {
        // Fetch image as a blob
        const response = await fetch(image);
        const blob = await response.blob();

        // Convert blob to FormData as the backend expects a file
        const formData = new FormData();
        formData.append("file", {
          uri: image,
          name: "dog_image.jpg",
          type: blob.type,
        } as unknown as File);

        console.log("Uploading dog picture...");
        // Use the updated DogContext function to handle file upload
        await updateDogPicture(newDog.id, formData); // Pass FormData directly here
        console.log("Dog picture uploaded successfully!");
      }

      Alert.alert("Success", "Dog added successfully!");
      setIsSaving(false);
      router.back(); // Go back to the previous screen
    } catch (error) {
      console.error("Failed to add dog:", error);
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
              onPress={pickImage}
              style={{
                alignItems: "center",
              }}
            >
              <Image
                source={image ? { uri: image } : DogPlaceholderImage}
                style={{
                  width: widthPercentageToDP(70),
                  height: widthPercentageToDP(70),
                  marginTop: heightPercentageToDP(-15),
                  borderWidth: 1,
                  borderColor: themeColors.tertiary,
                }}
                onError={() => setImage(null)}
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
                maxLength={48}
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

              <ThemedText
                style={{
                  color: themeColors.primary,
                  fontSize: 14,
                  marginLeft: widthPercentToPD(2),
                  backgroundColor: "transparent",
                }}
              >
                Tags
              </ThemedText>
              <TextInput
                placeholder="Enter tags separated by commas"
                placeholderTextColor={"#CAC8BE"}
                value={dogTags}
                onChangeText={setDogTags}
                style={{
                  paddingHorizontal: widthPercentToPD(6),
                  paddingVertical: widthPercentToPD(2),
                  borderRadius: percentToDP(4),
                  borderColor: themeColors.secondary,
                  borderWidth: 1,
                  fontSize: 14,
                  color: themeColors.textOnSecondary,
                  marginBottom: heightPercentToPD(2),
                }}
              />

              <ThemedText
                style={{
                  color: themeColors.primary,
                  fontSize: 14,
                  marginLeft: widthPercentToPD(2),
                  backgroundColor: "transparent",
                }}
              >
                Breed
              </ThemedText>

              <TextInput
                placeholder="Enter dog's breed"
                placeholderTextColor={"#CAC8BE"}
                value={breed}
                onChangeText={setBreed}
                maxLength={24}
                style={{
                  paddingHorizontal: widthPercentToPD(6),
                  paddingVertical: widthPercentToPD(2),
                  borderRadius: percentToDP(4),
                  borderColor: themeColors.secondary,
                  borderWidth: 1,
                  fontSize: 14,
                  color: themeColors.textOnSecondary,
                  marginBottom: heightPercentToPD(2),
                }}
              />

              <View
                style={{
                  flexDirection: "row",
                  height: heightPercentToPD(12),
                  marginVertical: heightPercentToPD(2),
                  width: widthPercentToPD(90),
                }}
              >
                <View style={{ flexDirection: "column" }}>
                  <ThemedText
                    style={{
                      color: themeColors.primary,
                      fontSize: 14,
                      marginLeft: widthPercentToPD(2),
                      backgroundColor: "transparent",
                    }}
                  >
                    Weight
                  </ThemedText>

                  <TextInput
                    placeholder="Enter dog's weight"
                    placeholderTextColor={"#CAC8BE"}
                    value={weight}
                    onChangeText={setWeight}
                    keyboardType={"numeric"}
                    maxLength={24}
                    style={{
                      paddingHorizontal: widthPercentToPD(6),
                      paddingVertical: widthPercentToPD(2),
                      borderRadius: percentToDP(4),
                      borderColor: themeColors.secondary,
                      borderWidth: 1,
                      fontSize: 14,
                      color: themeColors.textOnSecondary,
                      marginBottom: heightPercentToPD(2),
                    }}
                  />
                </View>

                <View style={{ flexDirection: "column" }}>
                  <ThemedText
                    style={{
                      color: themeColors.primary,
                      fontSize: 14,
                      marginLeft: widthPercentToPD(2),
                      backgroundColor: "transparent",
                    }}
                  >
                    Age
                  </ThemedText>
                  <TextInput
                    placeholder="Enter dog's age"
                    placeholderTextColor={"#CAC8BE"}
                    value={age}
                    onChangeText={setAge}
                    keyboardType={"numeric"}
                    maxLength={24}
                    style={{
                      paddingHorizontal: widthPercentToPD(6),
                      paddingVertical: widthPercentToPD(2),
                      borderRadius: percentToDP(4),
                      borderColor: themeColors.secondary,
                      borderWidth: 1,
                      fontSize: 14,
                      color: themeColors.textOnSecondary,
                      marginBottom: heightPercentToPD(2),
                    }}
                  />
                </View>
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
