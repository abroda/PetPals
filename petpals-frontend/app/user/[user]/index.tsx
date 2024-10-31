import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { router, usePathname } from "expo-router";
import PostFeed from "@/components/lists/PostFeed";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import {SafeAreaView, View, ScrollView, StyleSheet, ActivityIndicator, FlatList} from "react-native";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext"; // Import UserContext to fetch user data
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useThemeColor } from "@/hooks/theme/useThemeColor";

import {Menu, IconButton, PaperProvider} from 'react-native-paper';

import { useAuth } from "@/hooks/useAuth";

export default function UserProfileScreen() {

    const path = usePathname();
    const [username, setUsername] = useState(path.slice(path.lastIndexOf("/") + 1));
    const { logout } = useAuth();
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");

    // Sample pet data
    const pets = [
        { name: "Tori", breed: "Golden Retriever", id: "1" },
        { name: "Abi", breed: "Leonberger", id: "2" },
        { name: "Fibi", breed: "Mixed", id: "3" },
        { name: "Toby", breed: "Mixed", id: "4" },
        { name: "Ronnie", breed: "Mixed", id: "5" },
    ];

    const [loading, setLoading] = useState(true);

    // // Menu visibility
    // const [menuVisible, setMenuVisible] = useState(false);
    //
    // const toggleMenu = () => setMenuVisible(!menuVisible);
    //
    // const handleMenuSelect = (option: string) => {
    //     setMenuVisible(false);
    //     if (option === "Edit") {
    //         router.push("/user/me/editProfile");
    //     } else if (option === "App Settings") {
    //         // router.push("/settings");
    //     }
    // };

    const handleEdit = () => {
        router.push("/user/me/editProfile");
    }



    // @ts-ignore
    const { getUserById, userProfile, isProcessing, responseMessage } = useContext(UserContext);

    useEffect(() => {
        getUserById(username);
    }, [username]);

    if (isProcessing) {
        return <Text>Loading...</Text>;
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PaperProvider>
                <ThemedView style={{ flex: 1, paddingTop: heightPercentToPD(6) }}>
                    <ScrollView horizontal={false}>

                        <HorizontalView justifyOption="flex-end" style={{
                            marginHorizontal: percentToDP(5),
                        }}>
                            {/* Username next to mini user avatar - do we really need this text? */}
                            {/*<ThemedText style={{*/}
                            {/*    color: '#FAF7EA',*/}
                            {/*    alignItems: 'baseline'*/}
                            {/*}}>*/}
                            {/*    {username}*/}
                            {/*</ThemedText>*/}
                            <View style={{
                                flexDirection: 'row',
                                backgroundColor: '#0A2421',
                                padding: percentToDP(2),
                                borderRadius: percentToDP(100),
                                alignContent: 'center',
                                justifyContent: 'center',
                                margin: 0,
                            }}>
                                {username == "me" && (
                                    <Pressable
                                        onPress={() => {
                                            router.push("/user/me/editProfile");
                                        }}
                                        style={{
                                            alignItems: 'center',
                                            padding: percentToDP(2),
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <ThemedIcon name="notifications-outline"></ThemedIcon>
                                    </Pressable>
                                )}
                                <UserAvatar
                                    userId={userProfile?.userId}
                                    imageUrl={userProfile?.imageUrl || null} // Pass the S3 image URL
                                    size={12}
                                    doLink={false}
                                    style={{
                                        alignItems: 'center',
                                        padding: percentToDP(2),
                                        justifyContent: 'center',
                                    }}
                                />

                                {/*/!* Menu Trigger *!/*/}
                                {/*<Pressable*/}
                                {/*    onPress={toggleMenu}*/}
                                {/*    style={{*/}
                                {/*        alignItems: 'center',*/}
                                {/*        padding: percentToDP(2),*/}
                                {/*        justifyContent: 'center',*/}
                                {/*        zIndex: 100,*/}
                                {/*    }}*/}
                                {/*>*/}
                                {/*    <ThemedIcon name="ellipsis-vertical-outline" />*/}
                                {/*</Pressable>*/}

                                <ThemedButton label="Edit" onPress={() => handleEdit()} color="#52B8A3" style={{
                                    width: percentToDP(10),
                                    height: percentToDP(13),
                                    backgroundColor: 'white',
                                    borderRadius: 15,
                                    marginHorizontal: percentToDP(2),

                                }}/>

                            </View>

                        </HorizontalView>



                        {/* Darker background for user info */}
                        <View style={{
                            height: 420,
                            marginTop: 160,
                            marginBottom: 20,
                            backgroundColor: "#0A2421",
                            paddingBottom: 20,
                        }}>

                            {/* Header with Avatar */}
                            <View style={{
                                alignItems: "center",
                                marginBottom: 0,
                            }}>

                                {/* Avatar picture */}
                                <View style={{
                                    marginTop: -90,
                                }}>
                                    <UserAvatar size={40} userId={userProfile?.userId} imageUrl={userProfile?.imageUrl || null} doLink={false}/>
                                </View>

                                {/* Username text */}
                                <ThemedText style={{
                                    fontSize: 34,
                                    fontFamily: 'JosefinSans-Bold',
                                    letterSpacing: 1,
                                    maxWidth: percentToDP(80),
                                    color: '#FAF7EA',
                                    margin: 10,
                                    backgroundColor: "#0A2421",
                                }}>
                                    {userProfile?.username}
                                </ThemedText>

                                {/* Description text */}
                                <ThemedText style={{
                                    fontSize: 16,
                                    fontFamily: 'JosefinSans-SemiBold',
                                    maxWidth: percentToDP(80),
                                    textAlign: "center",
                                    marginHorizontal: 20,
                                    marginBottom: 20,
                                    color: '#FAF7EA',
                                    backgroundColor: "#0A2421",
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


                        {/* Pets Section */}
                        <ThemedText style={{
                            fontSize: 30,
                            color: "#FAF7EA",
                            marginLeft: 30,
                            marginBottom: 20,
                            marginTop: 20,
                        }}>
                            Dogs
                        </ThemedText>

                        <FlatList
                            horizontal
                            data={pets}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <View style={{
                                    marginRight: 10,
                                    paddingVertical: 10,
                                }}>
                                    <View style={{
                                        backgroundColor: '#0A2421',
                                        padding: 10,
                                        borderRadius: 10,
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                    }}>
                                        <PetAvatar size={32} username={userProfile?.username} pet={item.name} doLink={false} />
                                        <ThemedText style={{
                                            fontSize: 22,
                                            color: '#FAF7EA',
                                            fontWeight: 'bold',
                                            backgroundColor: 'none',
                                            marginTop: 10,
                                        }}>
                                            {item.name}
                                        </ThemedText>
                                        <ThemedText style={{
                                            fontSize: 12,
                                            fontStyle: 'italic',
                                            color: '#FAF7EA',
                                            backgroundColor: 'none',
                                        }}>
                                            {item.breed}
                                        </ThemedText>
                                    </View>

                                </View>
                            )}
                            showsHorizontalScrollIndicator={false}
                            style={{
                                marginLeft: 30,
                            }}
                        />

                        {/*{username == "me" && (*/}
                        {/*    <Pressable*/}
                        {/*        onPress={() => {*/}
                        {/*            router.push("/user/me/pet/Cutie/edit");*/}
                        {/*}}*/}


                        {/* PostFeed */}
                        <ThemedText style={{
                            fontSize: 30,
                            color: "#FAF7EA",
                            marginLeft: 30,
                            marginBottom: 0,
                            marginTop: 40,
                        }}>
                            Posts
                        </ThemedText>

                        <PostFeed/>

                    </ScrollView>
                </ThemedView>
            </PaperProvider>

        </SafeAreaView>
    );
}