import React, { useEffect, useState, useLayoutEffect } from "react";
import { SafeAreaView, Pressable, View, Text, Alert } from "react-native";
import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { usePathname, router } from "expo-router";
import { Image } from "react-native-ui-lib";
import { useDog } from "@/context/DogContext";
import { useNavigation } from "@react-navigation/native";
// @ts-ignore
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";

export default function PetProfileScreen() {
    const path = usePathname();
    const username = path.split("/")[2];
    const petId = path.split("/").pop();

    const { getDogById } = useDog();
    const [dog, setDog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false); // For dropdown menu visibility
    const [imageUri, setImageUri] = useState<string | null>(null); // To control image source
    const navigation = useNavigation();

    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");

    useEffect(() => {
        const fetchDogData = async () => {
            try {
                const dogData = await getDogById(petId);
                setDog(dogData);
                setImageUri(dogData.imageUrl || null); // Set initial image source to either the dog's URL or null if missing
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
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                    {/* User Avatar Link to User Profile */}
                    <Pressable
                        onPress={() => router.push(`/user/${username}`)}
                        style={{ marginRight: percentToDP(3) }}
                    >
                        <UserAvatar username={username} size={12} doLink={false} />
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
        }
    };

    if (isLoading) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <Text>Loading...</Text>
            </SafeAreaView>
        );
    }

    if (!dog) {
        return (
            <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                <ThemedText>Dog data not found</ThemedText>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={{ flex: 1, paddingTop: percentToDP(5) }}>
                {/* Dog Profile Content */}
                <HorizontalView justifyOption="flex-end" style={{ marginBottom: percentToDP(5) }}>
                    <ThemedText>Owner:</ThemedText>
                    <ThemedText>{username}</ThemedText>
                    <UserAvatar username={username} size={13} doLink={true} />
                </HorizontalView>

                <ThemedView style={{ alignItems: "center", marginBottom: percentToDP(5) }}>
                    <ThemedText style={{ fontSize: 24, fontWeight: "bold" }}>Pet: {dog.name}</ThemedText>
                    <ThemedText style={{ fontSize: 16, color: "gray" }}>{dog.description}</ThemedText>
                </ThemedView>

                {/* Dog Image with Placeholder on Error */}
                <Image
                    source={imageUri ? { uri: imageUri } : DogPlaceholderImage} // Use placeholder if imageUri is null
                    style={{
                        width: percentToDP(100),
                        height: percentToDP(100),
                    }}
                    onError={() => setImageUri(null)} // Set imageUri to null to force placeholder if load fails
                />

                {/* Tags */}
                <ThemedText style={{ marginTop: percentToDP(5), fontWeight: "bold" }}>Tags:</ThemedText>
                <HorizontalView justifyOption="flex-start" style={{ flexWrap: "wrap" }}>
                    {dog.tags.map((tag) => (
                        <ThemedText
                            key={tag.id}
                            style={{
                                backgroundColor: "#e0e0e0",
                                paddingHorizontal: 10,
                                paddingVertical: 5,
                                borderRadius: 5,
                                marginRight: 5,
                                marginTop: 5,
                            }}
                        >
                            {tag.tag}
                        </ThemedText>
                    ))}
                </HorizontalView>
            </ThemedView>

            {/* Dropdown Menu */}
            {menuVisible && (
                <View style={{
                    position: "absolute",
                    top: percentToDP(15),
                    right: percentToDP(5),
                    backgroundColor: "#fff",
                    borderRadius: 8,
                    padding: 10,
                    elevation: 5,
                    shadowColor: "#000",
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                }}>
                    <Pressable onPress={() => handleMenuSelect("Edit")}>
                        <Text style={{
                            padding: 10,
                            color: "#333",
                            fontSize: 18,
                        }}>Edit</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
