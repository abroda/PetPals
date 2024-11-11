import React, { useEffect, useState, useLayoutEffect, useContext, } from "react";
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
import { UserContext } from "@/context/UserContext";

// @ts-ignore
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import {widthPercentageToDP} from "react-native-responsive-screen";
import {useAuth} from "@/hooks/useAuth";

export default function PetProfileScreen() {
    const path = usePathname();
    const username = path.split("/")[2];
    const petId = path.split("/").pop();
    const { userId } = useAuth();
    // @ts-ignore
    const { getUserById, userProfile, isProcessing } = useContext(UserContext);

    // States
    const { getDogById } = useDog();
    const [dog, setDog] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [menuVisible, setMenuVisible] = useState(false);
    const [imageUri, setImageUri] = useState<string | null>(null);
    const navigation = useNavigation();

    // Colours
    const darkGreen = '#0A2421'
    const lightGreen = '#1C302A'
    const accentGreen = '#B4D779'
    const accentTeal = '#52B8A3'
    const cream = '#FAF7EA'

    // Functions
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");

    // Get dog data
    useEffect(() => {
        const fetchDogData = async () => {
            try {
                const dogData = await getDogById(petId);
                setDog(dogData);
                setImageUri(dogData.imageUrl || null);
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
                <View style={{
                    flexDirection: "row",
                    backgroundColor: darkGreen,
                    padding: percentToDP(2),
                    borderRadius: 100,
                }}>
                    {/* User Avatar Link to User Profile */}
                    <Pressable
                        onPress={() => router.push(`/user/${username}`)}
                        style={{ marginRight: percentToDP(3) }}
                    >
                        <UserAvatar userId={userId} size={12} doLink={false}  imageUrl={userProfile.imageUrl} />
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
        <SafeAreaView style={{ flex: 1,  }}>
            <ThemedView style={{ flex: 1, }}>

                {/* Dog Avatar Container */}
                <View style={{
                    flex: 3,
                    backgroundColor: lightGreen,
                    alignItems: 'center',
                }}>
                    {/* TODO: Background image in the future? */}
                </View>

                {/* Dog Info Container */}
                <View style={{
                    backgroundColor: darkGreen,
                    flex: 7,
                    alignItems: 'center',
                }}>
                    {/* Dog Image with Placeholder on Error */}
                    <Image
                        source={imageUri ? { uri: imageUri } : DogPlaceholderImage}
                        style={{
                            width: widthPercentageToDP(70),
                            height: widthPercentageToDP(70),
                            marginTop: heightPercentToPD(-15),
                            borderWidth: 1,
                            borderColor: darkGreen,
                        }}
                        onError={() => setImageUri(null)}
                        borderRadius={20}
                    />

                    <ThemedView style={{
                        alignItems: "center",
                        marginBottom: heightPercentToPD(2),
                        backgroundColor: 'transparent',
                    }}>
                        <ThemedText style={{
                            width: widthPercentageToDP(70),
                            textAlign: 'center',
                            fontSize: 28,
                            letterSpacing: 1,
                            fontWeight: "bold",
                            color: cream,
                            marginVertical: heightPercentToPD(3),
                        }}>
                            {dog.name}
                        </ThemedText>

                        <ThemedText style={{
                            width: widthPercentageToDP(70),
                            textAlign: 'center',
                            fontSize: 15,
                            color: "gray",
                            marginBottom: heightPercentToPD(3),
                        }}>
                            {dog.description}
                        </ThemedText>
                    </ThemedView>

                    <ThemedText style={{
                        width: widthPercentageToDP(70),
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: cream,
                    }}>
                        Owner
                    </ThemedText>
                    <ThemedText style={{
                        width: widthPercentageToDP(70),
                        textAlign: 'center',
                        fontSize: 15,
                        color: 'gray',
                    }}>
                        {username}
                    </ThemedText>


                    {/* Tags */}
                    <ThemedText style={{
                        width: widthPercentageToDP(70),
                        marginTop: heightPercentToPD(3),
                        textAlign: 'center',
                        fontWeight: 'bold',
                        fontSize: 15,
                        color: cream,
                    }}>
                        Tags
                    </ThemedText>

                    <HorizontalView justifyOption="flex-start" style={{ flexWrap: "wrap" }}>
                        {dog.tags.map((tag) => (
                            <ThemedText
                                key={tag.id}
                                style={{
                                    backgroundColor: accentGreen,
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
                </View>

            </ThemedView>

            {/* Dropdown Menu */}
            {menuVisible && (
                <View style={{
                    position: "absolute",
                    zIndex: 100,
                    elevation: 100,
                    top: heightPercentToPD(15),
                    right: widthPercentageToDP(8),
                    width: widthPercentageToDP(40),
                    backgroundColor: darkGreen,
                    padding: 10,
                    borderRadius: 5,
                    shadowOpacity: 0.3,
                    shadowRadius: 10,
                    borderWidth: 1,
                    borderColor: accentGreen,
                    alignContent: 'space-evenly',
                    justifyContent: 'space-evenly',
                }}>
                    <Pressable onPress={() => handleMenuSelect("Edit")}>
                        <Text style={{
                            paddingVertical: 10,
                            color: cream,
                            fontSize: 18,
                            borderBottomWidth: 1,
                            borderColor: accentGreen,
                        }}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => handleMenuSelect("Delete")}>
                        <Text style={{
                            paddingVertical: 10,
                            color: cream,
                            fontSize: 18,
                        }}>Delete</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
