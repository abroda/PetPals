import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Pressable, Text, FlatList, Alert, TouchableWithoutFeedback } from "react-native";
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
import {useNavigation, usePathname} from "expo-router";
import { widthPercentageToDP } from "react-native-responsive-screen";
import PostFeed from "@/components/lists/PostFeed";
import { router } from "expo-router";
import {Dog, useDog} from "@/context/DogContext";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png"


export default function UserProfileScreen() {

const path = usePathname();
const [username, setUsername] = useState(path.slice(path.lastIndexOf("/") + 1));
const { logout } = useAuth();
const percentToDP = useWindowDimension("shorter");
const heightPercentToPD = useWindowDimension("height");
const navigation = useNavigation();
const [menuVisible, setMenuVisible] = useState(false);
const {addDog, getDogsByUserId} = useDog();
const [dogName, setDogName] = useState("");
const [dogDescription, setDogDescription] = useState("");
const [dogs, setDogs] = useState<Dog[]>([]);
const { userId } = useAuth();

// Colours
const darkGreen = '#0A2421'
const lightGreen = '#1C302A'
const accentGreen = '#B4D779'
const accentTeal = '#52B8A3'
const cream = '#FAF7EA'

// @ts-ignore
const { getUserById, userProfile, isProcessing } = useContext(UserContext);


useEffect(() => {
    getUserById(username);
}, [username]);


useEffect(() => {
    const fetchDogs = async () => {
        // @ts-ignore
        const userDogs = await getDogsByUserId(userId);

        // Sorting dogs to be displayed by alphabetical order
        const sortedDogs = userDogs
            .map(dog => ({
                ...dog,
                name: dog.name || "Unknown Dog"
            }))
            .sort((a, b) => a.name.localeCompare(b.name));
        setDogs(sortedDogs);
    };
    fetchDogs();
}, [userId]);


useLayoutEffect(() => {
    // Customize the header with icons in the right corner
    navigation.setOptions({
        headerRight: () => (
            <View style={{
                flexDirection: "row",
                backgroundColor: darkGreen,
                padding: percentToDP(2),
                borderRadius: 100,
                alignItems: 'center',
                justifyContent: 'center',
                alignContent: 'center',
                marginTop: 2, // needed for header padding
                marginBottom: 5, // header padding
            }}>
                {username === "me" && (
                    <Pressable onPress={() => Alert.alert("Notifications")}>
                        <ThemedIcon name="notifications-outline" style={{marginHorizontal: widthPercentageToDP(1) }} />
                    </Pressable>
                )}
                <UserAvatar
                    userId={userProfile?.id}
                    imageUrl={userProfile?.imageUrl || null}
                    size={10}
                    doLink={false}
                    style={{}}
                />
                <Pressable onPress={() => setMenuVisible(!menuVisible)}>
                    <ThemedIcon name="ellipsis-vertical-outline" style={{ marginHorizontal: widthPercentageToDP(1) }} />
                </Pressable>
            </View>
        ),
        headerTitle: username,
    });
}, [navigation, username, menuVisible]);


const handleMenuSelect = (option: string) => {
    setMenuVisible(false);
    if (option === "Edit") {
        // @ts-ignore
        router.push("/user/me/editProfile");
    } else if (option === "App Settings") {
        // @ts-ignore
        router.push("/settings");
    }
};

// Close the menu when clicking outside
const closeMenu = () => {
    if (menuVisible) {
        setMenuVisible(false);
    }
};


if (isProcessing) {
    return <Text>Loading...</Text>;
}


return (
    <TouchableWithoutFeedback onPress={closeMenu}>
    <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, }}>
            <ScrollView horizontal={false}>

                {/* User Data Segment */}
                <View style={{
                    // height: heightPercentToPD(65),
                    marginTop: heightPercentToPD(20),
                    marginBottom: heightPercentToPD(3),
                    backgroundColor: darkGreen,
                    paddingBottom: heightPercentToPD(5),
                }}>

                    {/* User Avatar & Username & Description */}
                    <View style={{ alignItems: "center" }}>
                        <View style={{
                            marginTop: heightPercentToPD(-15),
                            marginBottom: heightPercentToPD(1),
                        }}>
                            <UserAvatar
                                size={55}
                                userId={userProfile?.id}
                                imageUrl={userProfile?.imageUrl || null}
                                doLink={false}
                            />
                        </View>
                        <ThemedText style={{
                            width: widthPercentageToDP(85),
                            textAlign: 'center',
                            fontSize: 36,
                            fontFamily: 'JosefinSans-Bold',
                            color: cream,
                            marginVertical: heightPercentToPD(1),
                        }}>
                            {userProfile?.username || "Unknown User"}
                        </ThemedText>

                        <ThemedText style={{
                            width: widthPercentageToDP(85),
                            fontSize: 15,
                            fontFamily: 'JosefinSans-SemiBold',
                            textAlign: "center",
                            color: cream,
                            marginBottom: heightPercentToPD(5),
                        }}>
                            {userProfile?.description || "No description"}
                        </ThemedText>
                    </View>

                    {/* User Info: Friends, KM, Dogs */}
                    <HorizontalView justifyOption="space-evenly" style={{
                        marginBottom: heightPercentToPD(5),
                        backgroundColor: 'transparent',
                    }}>
                        {/* Number of friends */}
                        <View style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            backgroundColor: 'none',
                        }}>
                            <ThemedText style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: '#FAF7EA',
                            }}>
                                21
                            </ThemedText>

                            <ThemedText style={{
                                fontSize: 12,
                                color: '#FAF7EA',
                            }}>
                                friends
                            </ThemedText>
                        </View>

                        {/* Km this week */}
                        <View style={{
                            alignItems: 'center',
                            backgroundColor: 'none',
                        }}>
                            <ThemedText style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: '#FAF7EA',
                            }}>
                                2
                            </ThemedText>

                            <ThemedText style={{
                                fontSize: 12,
                                color: '#FAF7EA',
                            }}>
                                km this week
                            </ThemedText>
                        </View>

                        {/* Number of dogs */}
                        <View style={{
                            alignItems: 'center',
                            backgroundColor: 'none',
                        }}>
                            <ThemedText style={{
                                fontSize: 24,
                                fontWeight: "bold",
                                color: '#FAF7EA',
                            }}>
                                21
                            </ThemedText>
                            <ThemedText style={{
                                fontSize: 12,
                                color: '#FAF7EA',
                            }}>
                                dogs
                            </ThemedText>
                        </View>
                    </HorizontalView>

                    {/* Buttons */}
                    <HorizontalView justifyOption="center" style={{
                        marginBottom: heightPercentToPD(2),
                        backgroundColor: 'transparent',
                    }}>
                        <ThemedButton label="Send invitation" color={darkGreen} style={{
                            width: widthPercentageToDP(35),
                            height: widthPercentageToDP(12),
                            marginHorizontal: widthPercentageToDP(2.5),
                            backgroundColor: accentGreen,
                            paddingHorizontal: widthPercentageToDP(1),
                            borderRadius: 100,
                        }} />

                        <ThemedButton label="Message" color={darkGreen} style={{
                            width: widthPercentageToDP(35),
                            height: widthPercentageToDP(12),
                            marginHorizontal: widthPercentageToDP(2.5),
                            backgroundColor: accentGreen,
                            paddingHorizontal: widthPercentageToDP(1),
                            borderRadius: 100,
                        }} />

                    </HorizontalView>

                    <ThemedButton label="Block" color={darkGreen} style={{
                        marginVertical: 'auto',
                        width: widthPercentageToDP(75),
                        height: widthPercentageToDP(12),
                        backgroundColor: accentTeal,
                        borderRadius: 100,
                        marginHorizontal: "auto",
                        paddingHorizontal: 20,
                    }}/>

                </View>

                <View style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignContent: 'space-between',
                    justifyContent: 'space-between',
                }}>
                    <ThemedText style={{
                        fontSize: 30,
                        color: cream,
                        marginLeft: widthPercentageToDP(5),
                    }}>
                        Dogs
                    </ThemedText>

                    <ThemedButton
                        label="Add dog"
                        onPress={() => router.push(`/user/${username}/pet/new`)}
                        color={darkGreen}
                        style={{
                            width: percentToDP(25),
                            height: percentToDP(12),
                            marginRight: widthPercentageToDP(5),
                            backgroundColor: accentGreen,
                            paddingHorizontal: widthPercentageToDP(1),
                            borderRadius: 100,
                        }}
                    />
                </View>

                <FlatList
                    horizontal
                    data={dogs}
                    keyExtractor={(item) => item.id}
                    style={{
                        marginHorizontal: widthPercentageToDP(5),
                        marginTop: heightPercentToPD(1),
                    }}
                    renderItem={({ item }) => (

                        <View style={{
                            marginRight: 8,
                            paddingVertical: 10
                        }}>
                            <View style={{
                                width: widthPercentageToDP(40),
                                height: widthPercentageToDP(63),
                                backgroundColor: darkGreen,
                                padding: widthPercentageToDP(3),
                                borderRadius: 10,
                                alignItems: 'center'
                            }}>
                                <PetAvatar
                                    size={35}
                                    source={item.imageUrl}
                                    username={userProfile?.username}
                                    pet={item.name}
                                    petId={item.id}
                                    doLink={true}
                                />

                                {/* Dog name */}
                                <ThemedText style={{
                                    fontSize: 22,
                                    color: cream,
                                    fontWeight: 'bold',
                                    marginTop: heightPercentToPD(1),
                                }}>
                                    {item.name}
                                </ThemedText>

                                {/* Dog description */}
                                <ThemedText
                                    numberOfLines={2} // Limit description to 2 lines
                                    ellipsizeMode="tail" // Show "..." at the end if truncated
                                    style={{
                                    fontSize: 14,
                                    color: cream,
                                    fontWeight: 'regular',
                                    marginBottom: heightPercentToPD(2),
                                }}>
                                    {item.description}
                                </ThemedText>

                            </View>
                        </View>
                    )}
                />

                <ThemedText style={{
                    fontSize: 30,
                    color: cream,
                    marginLeft: widthPercentageToDP(5),
                    marginTop: heightPercentToPD(4),
                }}>
                    Posts
                </ThemedText>
                <PostFeed />
            </ScrollView>

            {/* Dropdown Menu */}
            {menuVisible && (

                <View style={{
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
                    alignContent: 'space-evenly',
                    justifyContent: 'space-evenly',
                }}>
                    <Pressable onPress={() => handleMenuSelect("Edit")}>
                        <Text style={{
                            padding: 20,
                            color: cream,
                            borderBottomWidth: 1,
                            borderColor: accentGreen,
                            fontSize: 18,
                        }}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => handleMenuSelect("App Settings")}>
                        <Text style={{
                            padding: 20,
                            color: cream,
                            fontSize: 18,
                        }}>App Settings</Text>
                    </Pressable>
                </View>

            )}
        </ThemedView>
    </SafeAreaView>
    </TouchableWithoutFeedback>
);
}

