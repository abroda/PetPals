import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { SafeAreaView, TextInput, Alert, Image } from "react-native";
import { useDog } from "@/context/DogContext";
import { useAuth } from "@/hooks/useAuth";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {widthPercentageToDP} from "react-native-responsive-screen";
import HorizontalView from "@/components/basic/containers/HorizontalView";

export default function NewPetScreen() {
    // @ts-ignore
    const { addDog, updateDogPicture } = useDog();
    const { userId } = useAuth();
    const router = useRouter();
    const [dogName, setDogName] = useState("");
    const [dogDescription, setDogDescription] = useState("");
    const [dogTags, setDogTags] = useState("");
    const [image, setImage] = useState<string | null>(null);


    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");
    const widthPercentToPD = useWindowDimension("width");

    // Colours
    const darkGreen = '#0A2421'
    const lightGreen = '#1C302A'
    const accentGreen = '#B4D779'
    const accentTeal = '#52B8A3'
    const cream = '#FAF7EA'


    const pickImage = async () => {
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
        console.log("New image was set to const: ", result.assets[0].uri);
    };

    const handleAddDog = async () => {
        if (!dogName.trim()) {
            Alert.alert("Validation", "Dog name is required.");
            return;
        }

        try {
            // Prepare dog data with tags as an array
            const dogData = {
                name: dogName,
                description: dogDescription,
                tagIds: dogTags ? dogTags.split(",").map(tag => tag.trim()) : [],
            };

            // Add the dog without the image first
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
            router.back(); // Go back to the previous screen
        } catch (error) {
            console.error("Failed to add dog:", error);
            Alert.alert("Error", "Failed to add dog.");
        }
    };


    return (
        <SafeAreaView style={{flex: 1}}>
            <ThemedView
                style={{
                    flex: 1,
                    paddingVertical: heightPercentToPD(10),
                    paddingHorizontal: widthPercentToPD(10),
                }}
            >
                <ThemedText style={{
                    color: accentGreen,
                    fontSize: 15,
                    marginTop: heightPercentToPD(5),
                    marginBottom: heightPercentToPD(-2),
                    zIndex: 3,
                    elevation: 3,
                    marginLeft: widthPercentToPD(1),
                }}>
                    Dog Name
                </ThemedText>
                <TextInput
                    placeholder="Enter dog's name"
                    placeholderTextColor={'#CAC8BE'}
                    value={dogName}
                    onChangeText={setDogName}
                    maxLength={12}
                    style={{
                        paddingHorizontal: widthPercentToPD(6),
                        paddingVertical: widthPercentToPD(3),
                        marginVertical: heightPercentToPD(1),
                        borderRadius: 10,
                        borderColor: darkGreen,
                        borderWidth: 1,
                        fontSize: 18,
                        color: cream,
                    }}
                />

                <ThemedText style={{
                    color: accentGreen,
                    fontSize: 15,
                    marginTop: heightPercentToPD(5),
                    marginBottom: heightPercentToPD(-2),
                    zIndex: 3,
                    elevation: 3,
                    marginLeft: widthPercentToPD(1),
                }}>
                    Description
                </ThemedText>
                <TextInput
                    placeholder="Enter description"
                    placeholderTextColor={'#CAC8BE'}
                    value={dogDescription}
                    onChangeText={setDogDescription}
                    multiline
                    numberOfLines={4}
                    maxLength={48}
                    style={{
                        paddingHorizontal: widthPercentToPD(6),
                        paddingVertical: widthPercentToPD(3),
                        marginVertical: heightPercentToPD(1),
                        borderRadius: 10,
                        borderColor: darkGreen,
                        borderWidth: 1,
                        fontSize: 18,
                        textAlignVertical: 'top',
                        color: cream,
                    }}
                />

                <ThemedText style={{
                    color: accentGreen,
                    fontSize: 15,
                    marginTop: heightPercentToPD(5),
                    marginBottom: heightPercentToPD(-2),
                    zIndex: 3,
                    elevation: 3,
                    marginLeft: widthPercentToPD(1),
                }}>
                    Tags
                </ThemedText>
                <TextInput
                    placeholder="Enter tags separated by commas"
                    placeholderTextColor={'#CAC8BE'}
                    value={dogTags}
                    onChangeText={setDogTags}
                    style={{
                        paddingHorizontal: widthPercentToPD(6),
                        paddingVertical: widthPercentToPD(3),
                        marginVertical: heightPercentToPD(1),
                        borderRadius: 10,
                        borderColor: darkGreen,
                        borderWidth: 1,
                        fontSize: 18,
                        color: cream,
                    }}
                />
                <ThemedText style={{
                    color: accentGreen,
                    fontSize: 15,
                    marginTop: heightPercentToPD(5),
                    marginBottom: heightPercentToPD(-2),
                    zIndex: 3,
                    elevation: 3,
                    marginLeft: widthPercentToPD(1),
                }}>
                    Dog Photo
                </ThemedText>
                {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
                <ThemedButton label="Pick an Image" onPress={pickImage} style={{
                    width: widthPercentToPD(80),
                    marginTop: heightPercentToPD(5),
                }}/>
                <ThemedButton label="Add Dog" onPress={handleAddDog} style={{
                    width: widthPercentToPD(80),
                    marginTop: heightPercentToPD(5),
                }}/>
            </ThemedView>
        </SafeAreaView>
    );
}
