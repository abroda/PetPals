import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { router, usePathname } from "expo-router";
import PostFeed from "@/components/lists/PostFeed";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView, View, ScrollView, StyleSheet, ActivityIndicator } from "react-native";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useContext, useEffect, useState } from "react";
import { UserContext } from "@/context/UserContext"; // Import UserContext to fetch user data
import { TouchableOpacity, Text } from 'react-native';
import { useTheme } from '@react-navigation/native';
import { useThemeColor } from "@/hooks/theme/useThemeColor";

import { useAuth } from "@/hooks/useAuth";

export default function UserProfileScreen() {

    const path = usePathname();
    const username = path.slice(path.lastIndexOf("/") + 1);
    const { logout } = useAuth();
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");

    const [loading, setLoading] = useState(true);

    const { getUserById, userProfile, isProcessing, responseMessage } = useContext(UserContext);

    useEffect(() => {
        getUserById(username);
    }, [username]);

    if (isProcessing) {
        return <Text>Loading...</Text>;
    }


    return (
        <SafeAreaView style={{ flex: 1 }}>
            <ThemedView style={{ flex: 1, paddingTop: heightPercentToPD(6) }}>

                <HorizontalView justifyOption="flex-end">
                    <ThemedText style={{ margin: percentToDP(4) }}>{username}</ThemedText>
                    <UserAvatar
                        userId={username}
                        size={13}
                        doLink={false}
                    ></UserAvatar>
                    {username == "me" && (
                        <Pressable
                            onPress={() => {
                                router.push("/user/me/editProfile");
                            }}
                        >
                            <ThemedIcon name="pencil"></ThemedIcon>
                        </Pressable>
                    )}
                </HorizontalView>

                <ScrollView>
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
                                <UserAvatar userId={userProfile?.username} size={40} doLink={false} />
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
                        fontSize: 24,
                        color: "#FAF7EA",
                        marginLeft: 30,
                        marginBottom: 20,
                        marginTop: 20,
                    }}>
                        Dogs
                    </ThemedText>

                    <ScrollView horizontal style={{marginLeft: 20, marginVertical: 10,}}>
                        <View style={{
                            alignItems: "center",
                            marginRight: 20,
                            backgroundColor: '#0A2421',
                            borderTopLeftRadius: 100,
                            borderTopRightRadius: 100,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            padding: 5,
                        }}>
                            <PetAvatar size={30} username={userProfile?.username} pet="Tori" doLink={false} />
                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FAF7EA",
                                marginTop: 10,
                            }}>
                                Tori
                            </ThemedText>
                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 14,
                                color: "#FAF7EA",
                                marginBottom: 10,
                            }}>
                                Golden Retriever
                            </ThemedText>
                        </View>

                        <View style={{
                            alignItems: "center",
                            marginRight: 20,
                            backgroundColor: '#0A2421',
                            borderTopLeftRadius: 100,
                            borderTopRightRadius: 100,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            padding: 5,
                        }}>
                            <PetAvatar size={30} username={userProfile?.username} pet="Abi" doLink={false} />
                            {username == "me" && (
                                <Pressable
                                    onPress={() => {
                                        router.push("/user/me/pet/Cutie/edit");
                                    }}
                                >
                                    <ThemedIcon name="pencil"></ThemedIcon>
                                </Pressable>
                            )}

                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FAF7EA",
                                marginTop: 10,
                            }}>
                                Abi
                            </ThemedText>
                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 14,
                                color: "#FAF7EA",
                                marginBottom: 10,
                            }}>
                                Leonberger
                            </ThemedText>
                        </View>

                        <View style={{
                            alignItems: "center",
                            marginRight: 20,
                            backgroundColor: '#0A2421',
                            borderTopLeftRadius: 100,
                            borderTopRightRadius: 100,
                            borderBottomLeftRadius: 10,
                            borderBottomRightRadius: 10,
                            padding: 5,
                        }}>
                            <PetAvatar size={30} username={userProfile?.username} pet="Fibi" doLink={false} />
                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 16,
                                fontWeight: "bold",
                                color: "#FAF7EA",
                                marginTop: 10,
                            }}>
                                Fibi
                            </ThemedText>
                            <ThemedText style={{
                                backgroundColor: '#0A2421',
                                fontSize: 14,
                                color: "#FAF7EA",
                                marginBottom: 10,
                            }}>
                                Mixed
                            </ThemedText>
                        </View>
                    </ScrollView>

                    {/* PostFeed */}
                    <ThemedText style={{
                        fontSize: 24,
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
        </SafeAreaView>
    );
}