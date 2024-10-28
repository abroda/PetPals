import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import {useAuth} from "@/hooks/useAuth";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {useContext, useState} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {Pressable} from "react-native";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import UserAvatar from "@/components/navigation/UserAvatar";
import PostFeed from "@/components/lists/PostFeed";
import Post from "@/components/display/Post";
import {UserContext} from "@/context/UserContext";

export default function HomeScreen() {
    const {userId} = useAuth();
    const [notificationsVisible, setNotificationsVisible] = useState(false);

    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");

    const userContext = useContext(UserContext);
    const { userProfile, isProcessing, getUserById, responseMessage } = useContext(UserContext)!;

    return (
        <SafeAreaView>
            <ThemedView colorName="primary" style={{height: heightPercentToDP(100)}}>
                <ThemedView colorName="secondary" style={{height: 80}}>
                    <HorizontalView style={{paddingHorizontal: 10}}>

                        {/* APP LOGO */}
                        <AppLogo
                            size={10}
                            version="horizontal"
                        />

                        {/* NOTIFICATIONS ICON */}
                        <Pressable
                            onPress={() => {
                                console.log(notificationsVisible);
                                setNotificationsVisible(!notificationsVisible);
                            }}
                        >
                            <ThemedIcon
                                size={percentToDP(6)}
                                name="notifications"
                            />
                        </Pressable>

                        {/* USER AVATAR */}
                        <ThemedView style={{marginLeft: percentToDP(3)}}>
                            <UserAvatar
                                size={10}
                                doLink={true}
                                userId={(userId?.length ?? 0) > 0 ? userId ?? "me" : "me"}
                                imageUrl={userProfile?.imageUrl || null}
                            />
                        </ThemedView>
                    </HorizontalView>
                </ThemedView>

                {/* POST FEED */}
                <PostFeed></PostFeed>
            </ThemedView>
            {/*/!* BACKGROUND BEHIND ALL POSTS AND TOP BAR - COLOR VISIBLE BELOW NAVBAR*!/*/}
            {/*<ThemedView colorName="transparent" style={{height: heightPercentToDP(100)}}>*/}

            {/*    /!*APP LOGO AND USER AVATAR - TOP OF APP *!/*/}
            {/*    <HorizontalView colorName="background" style={{padding: percentToDP(3)}}>*/}
            {/*        <AppLogo*/}
            {/*            size={13}*/}
            {/*            version="horizontal"*/}
            {/*        />*/}
            {/*        <Pressable*/}
            {/*            onPress={() => {*/}
            {/*                console.log(notificationsVisible);*/}
            {/*                setNotificationsVisible(!notificationsVisible);*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <ThemedIcon*/}
            {/*                size={percentToDP(8)}*/}
            {/*                name="notifications"*/}
            {/*            />*/}
            {/*        </Pressable>*/}

            {/*        <ThemedView style={{marginLeft: percentToDP(3)}}>*/}
            {/*            <UserAvatar*/}
            {/*                size={13}*/}
            {/*                doLink={true}*/}
            {/*                userId={(userId?.length ?? 0) > 0 ? userId ?? "me" : "me"}*/}
            {/*            />*/}
            {/*        </ThemedView>*/}
            {/*    </HorizontalView>*/}

            {/*    {notificationsVisible && (*/}
            {/*        <NotificationsPopup*/}
            {/*            onDismiss={() => setNotificationsVisible(false)}*/}
            {/*        />*/}
            {/*    )}*/}


            {/*    /!* POST FEED *!/*/}
            {/*    <PostFeed username="Dominika_Xyz"></PostFeed>*/}

            {/*</ThemedView>*/}

        </SafeAreaView>
    );
}
