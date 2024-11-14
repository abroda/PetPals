import React, {useEffect, useLayoutEffect, useState} from "react";
import {SafeAreaView, TextInput, Alert, View, Pressable, Text, ScrollView} from "react-native";
import {usePathname, router} from "expo-router";
import {ThemedText} from "@/components/basic/ThemedText";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {useDog} from "@/context/DogContext";
import * as ImagePicker from "expo-image-picker";
import {Image} from "react-native-ui-lib";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {useNavigation} from "expo-router";

// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useWindowDimension} from "@/hooks/useWindowDimension";

// Colors for styling
const darkGreen = '#0A2421';
const lightGreen = '#1C302A';
const accentGreen = '#B4D779';
const cream = '#FAF7EA';

export default function EditDogProfileScreen() {
    const path = usePathname();
    const username = path.split("/")[2];
    const petId = path.split("/")[4];
    const navigation = useNavigation();
    const percentToDP = useWindowDimension("shorter");

    const title = "Edit Dog";
    const {getDogById, updateDog, updateDogPicture} = useDog();

    // State
    const [dog, setDog] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [tags, setTags] = useState<string[]>([]);
    const [newTag, setNewTag] = useState("");
    const [imageUri, setImageUri] = useState<string | null>(null);

    // Fetch the dog's data
    // @ts-ignore
    useEffect(() => {
        const fetchDogData = async () => {
            try {
                console.log("[Pet\/Edit] Dog owner username: ", username);
                console.log("[Pet\/Edit] Fetching data for dog with id: ", petId);
                const dogData = await getDogById(petId);
                setDog(dogData);
                setName(dogData.name);
                setDescription(dogData.description);
                setTags(dogData.tags.map(tag => tag.tag));
                setImageUri(dogData.imageUrl || null);
                console.log("[Pet\/Edit] Dog data fetched: ", dogData);
            } catch (error) {
                console.error("[Pet\/Edit] Failed to fetch dog data:", error);
            }
        };
        fetchDogData();
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
            // Update the dog's information
            await updateDog(petId, {
                name,
                description,
                tagIds: tags, // Ideally, convert tags to tag IDs if needed
            });

            // Update the dog's image if a new one was picked
            if (imageUri && imageUri !== dog.imageUrl) {
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

    // Add New Tag
    const handleAddTag = () => {
        if (newTag.trim()) {
            setTags([...tags, newTag.trim()]);
            setNewTag("");
        }
    };


    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: title,
        });
    }, []);


    return (
        <SafeAreaView style={{
            flex: 1
        }}>

            <ThemedView style={{
                flex: 1
            }}>
                <ScrollView>
                    {/* Dog Avatar Container */}
                    <View style={{
                        height: heightPercentageToDP(30),
                        backgroundColor: lightGreen,
                        alignItems: 'center',
                    }}>
                        {/* TODO: Background image in the future? */}
                    </View>

                    {/* Dog Info Container */}
                    <View style={{
                        backgroundColor: darkGreen,
                        height: heightPercentageToDP(70),
                    }}>

                        {/* Change Dog Image */}
                        <Pressable onPress={handlePickImage} style={{
                            alignItems: 'center',
                        }}>
                            <Image
                                source={imageUri ? {uri: imageUri} : DogPlaceholderImage}
                                style={{
                                    width: widthPercentageToDP(70),
                                    height: widthPercentageToDP(70),
                                    marginTop: heightPercentageToDP(-25),
                                    borderWidth: 1,
                                    borderColor: darkGreen,
                                }}
                                onError={() => setImageUri(null)}
                                borderRadius={percentToDP(8)}
                            />
                            <ThemedText style={{
                                textAlign: "center",
                                color: accentGreen,
                                marginTop: heightPercentageToDP(-35),
                                marginBottom: heightPercentageToDP(33),
                                fontSize: 16,
                            }}>
                                Click to change picture
                            </ThemedText>

                        </Pressable>

                        <View style={{
                            marginHorizontal: 'auto',
                            width: widthPercentageToDP(90),
                            justifyContent: 'space-evenly',
                            alignContent: 'space-evenly',

                        }}>
                            {/* Dog Name */}
                            <ThemedText style={{
                                backgroundColor: 'none',
                                color: accentGreen,
                                fontSize: 14,
                                fontWeight: 'light',
                                marginBottom: heightPercentageToDP(-1),
                                marginLeft: heightPercentageToDP(3),
                                zIndex: 2,
                            }}>
                                Name
                            </ThemedText>
                            <TextInput
                                style={{
                                    paddingHorizontal: percentToDP(6),
                                    paddingVertical: percentToDP(2),
                                    borderRadius: percentToDP(5),
                                    borderWidth: 1,
                                    borderColor: lightGreen,
                                    color: cream,
                                    fontSize: 14,
                                    letterSpacing: 0.5,
                                }}
                                value={name}
                                onChangeText={setName}
                                placeholder="Dog's Name"
                                placeholderTextColor="#AAA"
                            />

                            {/* Dog Description */}
                            <ThemedText style={{
                                backgroundColor: 'none',
                                color: accentGreen,
                                fontSize: 14,
                                fontWeight: 'light',
                                marginBottom: heightPercentageToDP(-1),
                                marginLeft: heightPercentageToDP(3),
                                zIndex: 2,
                            }}>
                                Description
                            </ThemedText>
                            <TextInput
                                style={{
                                    paddingHorizontal: percentToDP(6),
                                    paddingVertical: percentToDP(2),
                                    borderRadius: percentToDP(5),
                                    borderWidth: 1,
                                    borderColor: lightGreen,
                                    color: cream,
                                    fontSize: 14,
                                    letterSpacing: 0.5,
                                }}
                                value={description}
                                onChangeText={setDescription}
                                placeholder="Description"
                                placeholderTextColor="#AAA"
                                multiline
                            />

                            {/* Tags */}
                            <ThemedText style={{
                                backgroundColor: 'none',
                                color: accentGreen,
                                fontSize: 14,
                                fontWeight: 'light',
                                marginBottom: heightPercentageToDP(-3),
                                marginLeft: heightPercentageToDP(3),
                                zIndex: 2,
                            }}>
                                Tags
                            </ThemedText>
                            <HorizontalView justifyOption="flex-start" style={{flexWrap: "wrap", marginBottom: 15}}>
                                {tags.map((tag, index) => (
                                    <View
                                        key={index}
                                        style={{
                                            backgroundColor: accentGreen,
                                            paddingHorizontal: 10,
                                            paddingVertical: 2,
                                            borderRadius: 5,
                                            marginRight: 5,
                                            marginTop: 5,
                                        }}
                                    >
                                        <ThemedText>{tag}</ThemedText>
                                    </View>
                                ))}
                            </HorizontalView>

                            {/* Add New Tag */}
                            <TextInput
                                style={{
                                    paddingHorizontal: percentToDP(6),
                                    paddingVertical: percentToDP(2),
                                    borderRadius: percentToDP(6),
                                    borderWidth: 1,
                                    borderColor: lightGreen,
                                    color: cream,
                                    fontSize: 16,
                                    letterSpacing: 0.5,
                                }}
                                value={newTag}
                                onChangeText={setNewTag}
                                placeholder="Add new tag"
                                placeholderTextColor="#AAA"
                            />
                            <Pressable
                                onPress={handleAddTag}
                                style={{
                                    padding: widthPercentageToDP(2),
                                    backgroundColor: accentGreen,
                                    borderRadius: 100,
                                    alignItems: "center",
                                    marginVertical: heightPercentageToDP(2)
                                }}
                            >
                                <ThemedText style={{color: darkGreen}}>Add Tag</ThemedText>
                            </Pressable>

                            {/* Save Button */}
                            <Pressable
                                onPress={handleSave}
                                style={{
                                    padding: widthPercentageToDP(2),
                                    backgroundColor: accentGreen,
                                    borderRadius: 100,
                                    alignItems: "center",
                                    marginBottom: heightPercentageToDP(2)
                                }}
                            >
                                <ThemedText style={{color: darkGreen}}>Save Changes</ThemedText>
                            </Pressable>
                        </View>

                    </View>


                </ScrollView>
            </ThemedView>

        </SafeAreaView>
    );
}
