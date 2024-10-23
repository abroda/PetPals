import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedText} from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useAuth} from "@/hooks/useAuth";
import {useState} from "react";
import {Image} from "react-native-ui-lib";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {Href, router} from "expo-router";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";

export default function Post() {
    const {userId} = useAuth();
    const [dialogVisible, setDialogVisible] = useState(false);
    return (
        <ThemedView
            colorName="tertiary"
            style={{margin: 20, borderRadius: 10, paddingHorizontal: 20, paddingTop: 10, paddingBottom: 20}}
        >
            {/*POST HEADER*/}
            {/*<HorizontalView justifyOption="flex-start" colorName="transparent" shouldExpand={false}*/}
            {/*>*/}
            <ThemedView colorName="transparent" style={{
                flexDirection: "row",
                alignItems: "center",
                marginBottom: 10
            }}>
                <UserAvatar
                    size={50}
                    doLink={true}
                    userId={"userIdFromList"}
                />
                <ThemedText style={{backgroundColor: "transparent", marginLeft: 10}}
                            textStyleName="big">Username</ThemedText>

            </ThemedView>

            {/*</HorizontalView>*/}

            {/*IMAGE*/}
            <ThemedView
                style={{
                    // width: "100%",
                    height: 300,
                    marginBottom: 20,
                    borderRadius: 30
                }}
            >
                <Image
                    source={{
                        uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
                    }}
                    style={{
                        width: "100%",
                        height: "100%",
                        borderRadius: 10,
                    }}
                />
            </ThemedView>

            {/*TITLE AND DESCRIPTION*/}
            <ThemedText style={{backgroundColor: "transparent", marginBottom: 10}}
                        textStyleName="big">Example post with
                a cutie</ThemedText>
            <ThemedText style={{backgroundColor: "transparent", marginBottom: 30}}
                        textStyleName="small">Oh what a great description! Surely written by a genius. Also look at this
                cute doggo.</ThemedText>


            {/*COMMENTS AND LIKES*/}
            <HorizontalView shouldExpand={false} colorName="transparent">
                <ThemedButton
                    style={{width: 200, flexDirection: "row", alignItems: "center", justifyContent: "center"}}
                    backgroundColorName="secondary"
                    // textColorName="secondary"
                    onPress={() =>
                        router.push("/user/Username/post/postId" as Href<string>)
                    }
                >
                    {/*Go to comment section*/}
                    <ThemedIcon name="chatbox" size={18} style={{marginRight: 10}}/>
                    <ThemedText style={{backgroundColor: "transparent"}}
                                textStyleName="small" textColorName="primary">21 comments</ThemedText>
                </ThemedButton>
                <ThemedIcon name="heart" />
            </HorizontalView>


            {/*<HorizontalView colorName="transparent" >*/}
            {/*<HorizontalView>*/}
            {/*    <ThemedButton*/}
            {/*        style={{width: 250}}*/}
            {/*        backgroundColorName="secondary"*/}
            {/*        // textColorName="secondary"*/}
            {/*        onPress={() =>*/}
            {/*            router.push("/user/Username/post/postId" as Href<string>)*/}
            {/*        }*/}
            {/*    >*/}
            {/*        /!*Go to comment section*!/*/}
            {/*        <ThemedText style={{backgroundColor: "transparent"}}*/}
            {/*                    textStyleName="small" textColorName="primary">21 comments</ThemedText>*/}
            {/*    </ThemedButton>*/}
            {/*    <ThemedButton*/}
            {/*        style={{width: 250}}*/}
            {/*        backgroundColorName="secondary"*/}
            {/*        // textColorName="secondary"*/}
            {/*        onPress={() =>*/}
            {/*            router.push("/user/Username/post/postId" as Href<string>)*/}
            {/*        }*/}
            {/*    >*/}
            {/*        /!*Go to comment section*!/*/}
            {/*        <ThemedText style={{backgroundColor: "transparent"}}*/}
            {/*                    textStyleName="small" textColorName="primary">11 comments</ThemedText>*/}
            {/*    </ThemedButton>*/}
            {/*</HorizontalView>*/}

            {/*</HorizontalView>*/}


            {/*<HorizontalView*/}
            {/*    colorName="transparent"*/}
            {/*    justifyOption="flex-start"*/}
            {/*>*/}
            {/*    <ThemedView*/}
            {/*        colorName="transparent"*/}
            {/*        style={{marginHorizontal: 10, marginVertical: 20, borderTopRightRadius: 30, borderTopLeftRadius: 30}}*/}
            {/*    >*/}
            {/*        <UserAvatar*/}
            {/*            size={50}*/}
            {/*            doLink={true}*/}
            {/*            username={props.username}*/}
            {/*        />*/}
            {/*    </ThemedView>*/}


            {/*    <ThemedText style={{backgroundColor: "transparent"}} textStyleName="big">{props.username}</ThemedText>*/}
            {/*</HorizontalView>*/}

            {/*<ThemedView*/}
            {/*    style={{*/}
            {/*        width: "100%",*/}
            {/*        height: 400,*/}
            {/*        marginBottom: 20,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <Image*/}
            {/*        source={{*/}
            {/*            uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",*/}
            {/*        }}*/}
            {/*        style={{*/}
            {/*            width: "100%",*/}
            {/*            height: "100%",*/}
            {/*        }}*/}
            {/*    />*/}
            {/*</ThemedView>*/}

            {/*<ThemedText style={{backgroundColor: "transparent", marginHorizontal: 10, marginBottom: 20}}>Example post with*/}
            {/*    a cutie</ThemedText>*/}
            {/*<HorizontalView colorName="transparent">*/}
            {/*    <ThemedButton*/}
            {/*        style={{width: "40%"}}*/}
            {/*        onPress={() =>*/}
            {/*            router.push("/user/Username/post/postId" as Href<string>)*/}
            {/*        }*/}
            {/*    >*/}
            {/*        Go to comment section*/}
            {/*    </ThemedButton>*/}
            {/*    <ThemedButton*/}
            {/*        style={{width: "30%"}}*/}
            {/*        onPress={() =>*/}
            {/*            props.username === "me"*/}
            {/*                ? router.push("/user/me/post/postID/edit")*/}
            {/*                : setDialogVisible(true)*/}
            {/*        }*/}
            {/*    >*/}
            {/*        {props.username === "me" ? "Edit" : "Add reaction"}*/}
            {/*    </ThemedButton>*/}
            {/*</HorizontalView>*/}
            {/*{dialogVisible && (*/}
            {/*    <PostReactionPopup onDismiss={() => setDialogVisible(false)}/>*/}
            {/*)}*/}
        </ThemedView>
    );
}
