import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import { SafeAreaView, ScrollView, View, Pressable, Text, FlatList, Alert } from "react-native";
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


// Sample pet data
const pets = [
    { name: "Tori", breed: "Golden Retriever", id: "1" },
    { name: "Abi", breed: "Leonberger", id: "2" },
    { name: "Fibi", breed: "Mixed", id: "3" },
    { name: "Toby", breed: "Mixed", id: "4" },
    { name: "Ronnie", breed: "Mixed", id: "5" },
];

// @ts-ignore
const { getUserById, userProfile, isProcessing } = useContext(UserContext);


useEffect(() => {
    getUserById(username);
}, [username]);

useEffect(() => {
    const fetchDogs = async () => {
        // @ts-ignore
        const userDogs = await getDogsByUserId(userId);
        setDogs(userDogs);
    };
    fetchDogs();
}, [userId]);



useLayoutEffect(() => {
    // Customize the header with icons in the right corner
    navigation.setOptions({
        headerRight: () => (
            <View style={{ flexDirection: "row", padding: percentToDP(2), borderRadius: percentToDP(100) }}>
                {username === "me" && (
                    <Pressable onPress={() => Alert.alert("Notifications")}>
                        <ThemedIcon name="notifications-outline" style={{ marginHorizontal: 10 }} />
                    </Pressable>
                )}
                <UserAvatar
                    userId={userProfile?.id}
                    imageUrl={userProfile?.imageUrl || null}
                    size={12}
                    doLink={false}
                    style={{ alignItems: "center", padding: percentToDP(2), justifyContent: "center" }}
                />
                <Pressable onPress={() => setMenuVisible(!menuVisible)}>
                    <ThemedIcon name="ellipsis-vertical-outline" />
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

if (isProcessing) {
    return <Text>Loading...</Text>;
}


return (
    <SafeAreaView style={{ flex: 1 }}>
        <ThemedView style={{ flex: 1, paddingTop: heightPercentToPD(6) }}>
            <ScrollView horizontal={false}>
                <HorizontalView justifyOption="flex-end" style={{ marginHorizontal: percentToDP(5) }}>
                    <View style={{ flexDirection: 'row', backgroundColor: darkGreen, padding: percentToDP(2), borderRadius: percentToDP(100) }}>
                        {/* Empty space for headerRight buttons */}
                    </View>
                </HorizontalView>

                {/* User Data Segment */}
                <View style={{ height: heightPercentToPD(65), marginTop: 160, marginBottom: 20, backgroundColor: darkGreen, paddingBottom: 20 }}>

                    {/* User Avatar & Username & Description */}
                    <View style={{ alignItems: "center" }}>
                        <View style={{
                            marginTop: heightPercentToPD(-10),
                            marginBottom: heightPercentToPD(1),
                        }}>
                            <UserAvatar size={40} userId={userProfile?.id} imageUrl={userProfile?.imageUrl || null} doLink={false}/>
                        </View>
                        <ThemedText style={{
                            fontSize: 34,
                            fontFamily: 'JosefinSans-Bold',
                            letterSpacing: 1,
                            color: cream,
                            marginBottom: heightPercentToPD(1),
                        }}>
                            {userProfile?.username}
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 16,
                            fontFamily: 'JosefinSans-SemiBold',
                            textAlign: "center",
                            color: cream,
                            marginBottom: heightPercentToPD(1),
                            height: heightPercentToPD(8),
                        }}>
                            {userProfile?.description || "No description"}
                        </ThemedText>
                    </View>

                    {/* User Info: Friends, KM, Dogs */}
                    <HorizontalView justifyOption="space-evenly" style={{
                        backgroundColor: '#0A2421',
                    }}>
                        {/* Number of friends */}
                        <View style={{
                            marginVertical: 10,
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
                            marginVertical: 10,
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
                            marginVertical: 10,
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
                        marginTop: 20,
                        backgroundColor: '#0A2421',
                    }}>
                        <ThemedButton label="Send invitation" color="#B4D779" style={{
                            width: percentToDP(40),
                            height: percentToDP(13),
                            backgroundColor: 'none',
                            borderWidth: 2,
                            borderColor: '#B4D779',
                            marginHorizontal: 10,
                            paddingHorizontal: 20,
                            borderRadius: 15,
                            alignItems: 'center',
                            justifyContent: 'center',
                            alignContent: 'center',
                        }} />

                        <ThemedButton label="Message" color="#B4D779" style={{
                            width: percentToDP(40),
                            height: percentToDP(13),
                            backgroundColor: 'none',
                            borderWidth: 2,
                            borderColor: '#B4D779',
                            marginHorizontal: 10,
                            paddingHorizontal: 20,
                            borderRadius: 15,
                        }} />
                    </HorizontalView>

                    <ThemedButton label="Block" color="#52B8A3" style={{
                        width: percentToDP(85),
                        height: percentToDP(13),
                        backgroundColor: 'none',
                        borderWidth: 2,
                        borderColor: '#52B8A3',
                        borderRadius: 15,
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
                        marginLeft: widthPercentageToDP(7.5),
                    }}>
                        Dogs
                    </ThemedText>
                    <ThemedButton
                        label="Add dog"
                        onPress={() => router.push(`/user/${username}/pet/new`)}
                        color={darkGreen}
                        style={{
                            width: percentToDP(25),
                            height: percentToDP(13),
                            marginRight: widthPercentageToDP(7.5),
                            backgroundColor: accentGreen,
                            borderWidth: 2,
                            paddingHorizontal: widthPercentageToDP(1),
                            borderRadius: 15,
                        }}
                    />
                </View>
                <FlatList
                    horizontal
                    data={dogs}
                    keyExtractor={(item) => item.id}
                    style={{
                        marginHorizontal: widthPercentageToDP(7.5),
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
                                    pet={item.name} doLink={false} />

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
                    marginLeft: widthPercentageToDP(7.5),
                    marginTop: 20
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
                    top: heightPercentToPD(15),
                    right: widthPercentageToDP(8),
                    width: widthPercentageToDP(40),
                    height: percentToDP(30),
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
                            borderBottomWidth: 1,
                            borderColor: accentGreen,
                            fontSize: 18,
                        }}>Edit</Text>
                    </Pressable>
                    <Pressable onPress={() => handleMenuSelect("App Settings")}>
                        <Text style={{
                            paddingVertical: 10,
                            color: cream,
                            fontSize: 18,
                        }}>App Settings</Text>
                    </Pressable>
                </View>
            )}
        </ThemedView>
    </SafeAreaView>
);
}

