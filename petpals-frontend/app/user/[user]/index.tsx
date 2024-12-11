import React, {useCallback, useEffect, useLayoutEffect, useState} from "react";
import {
    SafeAreaView,
    View,
    Pressable,
    Alert,
    FlatList,
    Text,
    TouchableWithoutFeedback,
} from "react-native";
import {ThemedText} from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import PetAvatar from "@/components/navigation/PetAvatar";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {useAuth} from "@/hooks/useAuth";
import {useNavigation, usePathname, router, Href, useFocusEffect, useRouter} from "expo-router";
import {widthPercentageToDP} from "react-native-responsive-screen";
import PostFeed from "@/components/lists/PostFeed";
import {Dog, useDog} from "@/context/DogContext";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";
import {useUser} from "@/hooks/useUser";
import {UserProfile} from "@/context/UserContext";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {useFriendship} from "@/context/FriendshipContext";
import {useChat} from "@/context/ChatContext";
import {useWebSocket} from "@/context/WebSocketContext";

export default function UserProfileScreen() {

    // Contexts
    const path = usePathname();
    const router = useRouter();
    const {addDog, getDogsByUserId, deleteDog} = useDog();
    const {logout, userId: loggedInUserId} = useAuth();
    const {fetchUserById, userProfile} = useUser();
    const navigation = useNavigation();
    const {friends, sendFriendRequest, removePendingFriendRequest, sentRequests, receivedRequests} =
        useFriendship(); // Use friendship context


    // Styling
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];


    // Functionality
    const [isRefreshing, setIsRefreshing] = useState(false); // For refresh indicator (if needed)
    const [menuVisible, setMenuVisible] = useState(false);
    const [dogs, setDogs] = useState<Dog[]>([]);
    const dogCount = dogs.length;

    const usernameFromPath = path.slice(path.lastIndexOf("/") + 1);
    const [username, setUsername] = useState(usernameFromPath);

    const [visitedUser, setVisitedUser] = useState<UserProfile | null>(null);
    const [hasPendingRequest, setHasPendingRequest] = useState(false); // Track friendship request state

    const {getOrCreateChat} = useChat()
    // Check if viewing own profile
    const isOwnProfile = username === "me" || loggedInUserId === username;

    useEffect(() => {
        console.log("FRIENDS: ", friends)
    }, []);

    // Fetch the profile being viewed
    useEffect(() => {
        const resolvedUsername = username === "me" ? loggedInUserId : username;

        if (resolvedUsername) {
            console.log("[User/Index] UserProfile | Fetching user by id: ", resolvedUsername)
            fetchUserById(resolvedUsername)
                .then((user) => {
                    setVisitedUser(user);
                })
                .catch((error) => {
                    console.error("Failed to fetch visited user:", error);
                });


            const pendingRequest = sentRequests.find(
                (request) =>
                    request.receiverId === resolvedUsername &&
                    request.status === "PENDING"
            );
            setHasPendingRequest(!!pendingRequest);

        }
    }, [username, loggedInUserId]);


    const fetchDogs = async () => {
        const ownerId = username === "me" ? loggedInUserId : username;
        if (!ownerId) return;

        try {
            const userDogs = await getDogsByUserId(ownerId);
            const sortedDogs = userDogs
                .map((dog) => ({...dog, name: dog.name || "Unknown Dog"}))
                .sort((a, b) => a.name.localeCompare(b.name));
            setDogs(sortedDogs);
        } catch (error) {
            console.error("Failed to fetch dogs:", error);
        }
    };

    // Refresh data whenever the screen is focused
    useFocusEffect(
        useCallback(() => {
            if (loggedInUserId && username) {
                fetchDogs();
            }

        }, [loggedInUserId]) // Only re-run if userId changes
    );


    // Send Friendship Request
    const handleSendRequest = async () => {
        if (!visitedUser) return;
        const success = await sendFriendRequest(loggedInUserId, visitedUser.id);
        if (success) {
            Alert.alert("Friend Request", "Invitation sent!");
            setHasPendingRequest(true);
        } else {
            Alert.alert("Error", "Failed to send invitation.");
        }
    };

    // Cancel Pending Friendship Requests
    const handleCancelRequest = async () => {
        if (!visitedUser) return;

        const resolvedUsername = username === "me" ? loggedInUserId : username;

        const pendingRequest = sentRequests.find(
            (request) =>
                request.receiverId === resolvedUsername &&
                request.status === "PENDING"
        );
        if (pendingRequest) {
            const success = await removePendingFriendRequest(pendingRequest.id);
            if (success) {
                Alert.alert("Friend Request", "Invitation canceled.");
                setHasPendingRequest(false);
            } else {
                Alert.alert("Error", "Failed to cancel invitation.");
            }
        } else {
            console.log("[User/Index] Tried to cancel a friend request, that was not found")
            return
        }

    };

    // message
    const handleMessageRequest = async () => {
        if (!visitedUser) return;
        const result = await getOrCreateChat(visitedUser.id)
        if (result.success) {
            // if (stompClient){
            //     console.log('Cleaning up WebSocket connection');
            //     stompClient.deactivate();
            // }
            router.replace("/home/socials" as Href<string>);
            router.push(`/chat/${result.returnValue.chatroomId}` as Href<string>);
        } else {
            Alert.alert("Error", "Failed to initiate a chat.");
        }
    };

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <View
                    style={{
                        flexDirection: "row",
                        backgroundColor: themeColors.tertiary,
                        padding: percentToDP(1),
                        borderRadius: 100,
                        marginVertical: heightPercentToPD(1),
                    }}
                >
                    {username === "me" && (
                        <Pressable onPressOut={() => Alert.alert("Notifications")}>
                            <ThemedIcon
                                name="notifications-outline"
                                style={{
                                    marginHorizontal: widthPercentageToDP(1),
                                    padding: percentToDP(2),
                                }}
                            />
                        </Pressable>
                    )}

                    {/* Avatar of the currently logged-in user */}
                    <UserAvatar
                        userId={loggedInUserId || ""}
                        imageUrl={userProfile?.imageUrl}
                        size={10}
                        doLink={true}
                    />

                    {/* Three-dots Menu Pop-up */}
                    {isOwnProfile && (
                        <Pressable onPressOut={() => setMenuVisible(!menuVisible)}>
                            <ThemedIcon
                                name="ellipsis-vertical-outline"
                                style={{
                                    marginHorizontal: widthPercentageToDP(1),
                                    padding: percentToDP(2),
                                }}
                            />
                        </Pressable>
                    )}
                </View>
            ),
            headerTitle: isOwnProfile
                ? "My Profile"
                : visitedUser?.username || "Profile",
            headerStyle: {
                backgroundColor: themeColors.secondary,
            },
        });
    }, [navigation, username, menuVisible, visitedUser]);

    const handleMenuSelect = (option: string) => {
        setMenuVisible(false);
        if (option === "Edit") {
            router.push("/user/me/editProfile");
        } else if (option === "App Settings") {
            router.push("/settings" as Href<string>);
        }
    };

    const closeMenu = () => {
        if (menuVisible) {
            setMenuVisible(false);
        }
    };

    const renderDogItem = ({item}: { item: Dog }) => {
        const handleDeleteDog = () => {
            Alert.alert(
                "Delete Dog",
                "Are you sure you want to delete this dog?",
                [
                    {
                        text: "Cancel",
                        style: "cancel",
                    },
                    {
                        text: "Yes",
                        onPress: async () => {
                            try {
                                await deleteDog(item.id); // Call the context function
                                Alert.alert("Success", "Dog was successfully deleted.");
                                fetchDogs(); // Refresh the dog list after deletion
                            } catch (error) {
                                Alert.alert("Error", "Failed to delete the dog.");
                            }
                        },
                    },
                ],
                {cancelable: true}
            );
        };

        return (
            <Pressable onLongPress={isOwnProfile ? handleDeleteDog : undefined}>
                <View
                    style={{
                        marginRight: 8,
                        paddingVertical: 10,
                    }}
                >
                    <View
                        style={{
                            width: widthPercentageToDP(42),
                            height: widthPercentageToDP(70),
                            backgroundColor: themeColors.tertiary,
                            padding: widthPercentageToDP(4),
                            borderRadius: 10,
                            alignItems: "center",
                        }}
                    >
                        <PetAvatar
                            size={35}
                            source={item.imageUrl}
                            userId={username}
                            petId={item.id}
                            doLink={true}
                        />
                        <ThemedText
                            style={{
                                fontSize: 22,
                                lineHeight: 24,
                                color: themeColors.textOnSecondary,
                                fontWeight: "bold",
                                marginVertical: heightPercentToPD(2),
                            }}
                        >
                            {item.name}
                        </ThemedText>
                        <ThemedText
                            numberOfLines={2}
                            ellipsizeMode="tail"
                            style={{
                                fontSize: 14,
                                lineHeight: 18,
                                color: themeColors.textOnSecondary,
                                fontWeight: "regular",
                                marginBottom: heightPercentToPD(2),
                            }}
                        >
                            {item.description}
                        </ThemedText>
                    </View>
                </View>
            </Pressable>
        );
    };

    const ListHeaderComponent = () => (
        <ThemedView
            style={{
                flex: 1,
                width: widthPercentageToDP(100),
                backgroundColor: themeColors.secondary,
            }}
        >
            <View
                style={{
                    marginTop: heightPercentToPD(30),
                    marginBottom: heightPercentToPD(3),
                    backgroundColor: themeColors.tertiary,
                    paddingBottom: heightPercentToPD(5),
                    width: widthPercentageToDP(100),
                }}
            >
                <View
                    style={{
                        alignItems: "center",
                        backgroundColor: themeColors.tertiary,
                        width: widthPercentageToDP(100),
                    }}
                >
                    <UserAvatar
                        size={50}
                        imageUrl={visitedUser?.imageUrl}
                        doLink={false}
                        style={{
                            marginTop: heightPercentToPD(-15),
                        }}
                    />
                    <ThemedText
                        style={{
                            width: widthPercentageToDP(85),
                            textAlign: "center",
                            fontSize: percentToDP(8),
                            lineHeight: percentToDP(8),
                            color: themeColors.textOnSecondary,
                            marginVertical: heightPercentToPD(2),
                        }}
                    >
                        {visitedUser?.username || "Unknown User"}
                    </ThemedText>
                    <ThemedText
                        style={{
                            width: widthPercentageToDP(85),
                            fontSize: percentToDP(4),
                            lineHeight: percentToDP(5),
                            textAlign: "center",
                            color: themeColors.textOnSecondary,
                            marginBottom: heightPercentToPD(5),
                        }}
                    >
                        {visitedUser?.description || "No description"}
                    </ThemedText>
                </View>

                {/* User Info: Friends, KM, Dogs */}
                <HorizontalView
                    justifyOption="space-evenly"
                    style={{
                        marginBottom: heightPercentToPD(5),
                        backgroundColor: themeColors.tertiary,
                        width: widthPercentageToDP(100),
                    }}
                >
                    <View style={{alignItems: "center"}}>
                        <ThemedText
                            style={{
                                fontSize: 24,
                                lineHeight: 26,
                                fontWeight: "bold",
                                color: themeColors.textOnSecondary
                            }}
                        >
                            21
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 12,
                            lineHeight: 14,
                            color: themeColors.textOnSecondary
                        }}>
                            friends
                        </ThemedText>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <ThemedText
                            style={{
                                fontSize: 24,
                                lineHeight: 26,
                                fontWeight: "bold",
                                color: themeColors.textOnSecondary
                            }}
                        >
                            2
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 12,
                            lineHeight: 14,
                            color: themeColors.textOnSecondary
                        }}>
                            km this week
                        </ThemedText>
                    </View>
                    <View style={{alignItems: "center"}}>
                        <ThemedText
                            style={{
                                fontSize: 24,
                                lineHeight: 26,
                                fontWeight: "bold",
                                color: themeColors.textOnSecondary
                            }}
                        >
                            {dogCount}
                        </ThemedText>
                        <ThemedText style={{
                            fontSize: 12,
                            lineHeight: 14,
                            color: themeColors.textOnSecondary
                        }}>{dogCount === 1 ? "dog" : "dogs"}</ThemedText>
                    </View>
                </HorizontalView>


                {/* Buttons */}
                {!isOwnProfile && (
                    <HorizontalView
                        justifyOption="center"
                        style={{
                            backgroundColor: themeColors.tertiary,
                            width: widthPercentageToDP(100),
                            justifyContent: "space-around",
                            paddingHorizontal: widthPercentageToDP(5),
                        }}
                    >
                        {hasPendingRequest ? (
                            <ThemedButton
                                label="Cancel invitation"
                                onPress={handleCancelRequest}
                                color={themeColors.tertiary}
                                style={{
                                    width: widthPercentageToDP(40),
                                    backgroundColor: themeColors.primary,
                                    borderRadius: 100,
                                }}
                            />
                        ) : (
                            <ThemedButton
                                label="Send invitation"
                                onPress={handleSendRequest}
                                color={themeColors.tertiary}
                                style={{
                                    width: widthPercentageToDP(40),
                                    backgroundColor: themeColors.primary,
                                    borderRadius: 100,
                                }}
                            />
                        )}
                        <ThemedButton
                            label="Message"
                            onPress={handleMessageRequest}
                            color={themeColors.tertiary}
                            style={{
                                width: widthPercentageToDP(40),
                                backgroundColor: themeColors.primary,
                                borderRadius: 100,
                            }}
                        />
                    </HorizontalView>
                )}

                {isOwnProfile && (
                    <HorizontalView
                        justifyOption="center"
                        style={{
                            backgroundColor: themeColors.tertiary,
                            width: widthPercentageToDP(100),
                            justifyContent: "space-around",
                            paddingHorizontal: widthPercentageToDP(5),
                        }}
                    >
                        <ThemedButton
                            label="My friends"
                            color={themeColors.tertiary}
                            onPress={() => router.push(`/home/socials`)}
                            style={{
                                width: widthPercentageToDP(40),
                                backgroundColor: themeColors.primary,
                                borderRadius: 100,
                            }}
                        />
                        <ThemedButton
                            label="Add dog"
                            onPress={() => router.push(`/user/${username}/pet/new`)}
                            color={themeColors.tertiary}
                            style={{
                                width: widthPercentageToDP(40),
                                backgroundColor: themeColors.primary,
                                borderRadius: 100,
                            }}
                        />
                    </HorizontalView>
                )}

            </View>
            <View
                style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    width: widthPercentageToDP(100),
                    paddingHorizontal: widthPercentageToDP(5),
                }}
            >
                <ThemedText
                    style={{
                        fontSize: 30,
                        lineHeight: 32,
                        backgroundColor: "transparent",
                        color: themeColors.textOnSecondary,
                    }}
                >
                    Dogs
                </ThemedText>
            </View>
            <FlatList
                data={dogs}
                keyExtractor={(item) => item.id}
                horizontal
                refreshing={isRefreshing}
                onRefresh={fetchDogs}
                showsHorizontalScrollIndicator={false}
                renderItem={renderDogItem}
                contentContainerStyle={{
                    paddingHorizontal: widthPercentageToDP(5),
                    marginTop: heightPercentToPD(1),
                }}
            />
        </ThemedView>
    );

    return (
        <SafeAreaView
            style={{
                flex: 1,
                width: widthPercentageToDP(100),
                backgroundColor: themeColors.secondary,
            }}
        >
            <FlatList
                style={{
                    width: widthPercentageToDP(100),
                }}
                data={[]}
                ListHeaderComponent={ListHeaderComponent}
                ListFooterComponent={() => (
                    <>
                        <ThemedText
                            textStyleOptions={{size: 30}}
                            style={{
                                color: themeColors.textOnSecondary,
                                backgroundColor: "transparent",
                                marginLeft: widthPercentageToDP(5),
                                marginTop: heightPercentToPD(4),
                            }}
                        >
                            Posts
                        </ThemedText>
                        <PostFeed/>
                    </>
                )}
                renderItem={(item) => <></>}
            />

            {menuVisible && (
                <View
                    style={{
                        position: "absolute",
                        zIndex: 100,
                        elevation: 100,
                        top: percentToDP(30),
                        right: widthPercentageToDP(4),
                        width: widthPercentageToDP(50),
                        backgroundColor: themeColors.tertiary,
                        borderRadius: percentToDP(4),
                        shadowOpacity: 0.3,
                        shadowRadius: 10,
                        borderWidth: 2,
                        borderColor: themeColors.primary,
                        alignContent: "space-evenly",
                        justifyContent: "space-evenly",
                    }}
                >
                    <Pressable onPress={() => handleMenuSelect("Edit")}>
                        <Text
                            style={{
                                padding: percentToDP(5),
                                color: themeColors.primary,
                                borderBottomWidth: 1,
                                borderColor: themeColors.primary,
                                fontSize: percentToDP(4.5),
                                lineHeight: percentToDP(5),
                            }}
                        >
                            Edit
                        </Text>
                    </Pressable>
                    <Pressable onPress={() => handleMenuSelect("App Settings")}>
                        <Text
                            style={{
                                padding: percentToDP(5),
                                color: themeColors.primary,
                                fontSize: percentToDP(4.5),
                                lineHeight: percentToDP(5),
                            }}
                        >
                            App Settings
                        </Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
}
