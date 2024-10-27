import {ThemedView} from "@/components/basic/containers/ThemedView";
import {Href, router, useNavigation, usePathname} from "expo-router";
import React, {useLayoutEffect, useState} from "react";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedScrollView} from "@/components/basic/containers/ThemedScrollView";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {ThemedText} from "@/components/basic/ThemedText";
import {Image} from "react-native-ui-lib";
import {Pressable} from "react-native";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import PetAvatar from "@/components/navigation/PetAvatar";
import {useThemeColor} from "@/hooks/theme/useThemeColor";
import {ThemedButton} from "@/components/inputs/ThemedButton";

export default function PostScreen() {
    const path = usePathname();
    const username = path.split("/")[2];
    const [liked, setLiked] = useState(false);
    const [dialogVisible, setDialogVisible] = useState(false);
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");
    const tertiaryColor = useThemeColor("tertiary")
    const comments = ["1", "2", "3"]

    // HIDING DEFAULT NAVIGATION
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);

    return (
        <SafeAreaView style={{height: "100%"}}>
            <ThemedView style={{height: heightPercentToDP(10)}}>
                <HorizontalView colorName="secondary"
                                style={{height: heightPercentToDP(10), paddingHorizontal: percentToDP(5)}}
                >
                    {/* BACK BUTTON */}
                    <ThemedButton backgroundColorName="background"
                                  style={{
                                      height: heightPercentToDP(7),
                                      width: heightPercentToDP(7),
                                      minWidth: heightPercentToDP(7) // MIN WIDTH HAS TO BE OVERWRITTEN FOR WIDTH TO TAKE EFFECT!
                                  }}
                                  onPress={() => {
                                      router.back()
                                  }}>
                        <ThemedIcon size={heightPercentToDP(4)}
                                    style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}
                                    colorName="primary" name={"arrow-back"}/>
                    </ThemedButton>

                    {/* EDIT BUTTON */}
                    <ThemedButton backgroundColorName="background"
                                  style={{
                                      height: heightPercentToDP(7),
                                      width: heightPercentToDP(7),
                                      minWidth: heightPercentToDP(7) // MIN WIDTH HAS TO BE OVERWRITTEN FOR WIDTH TO TAKE EFFECT!
                                  }}
                                  onPress={() => {
                                      router.push("/user/Username/post/postId/edit" as Href<string>)
                                  }}
                    >
                        <ThemedIcon size={heightPercentToDP(4)}
                                    style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}
                                    colorName="primary" name={"pencil"}/>
                    </ThemedButton>
                </HorizontalView>
            </ThemedView>
            <ThemedScrollView colorName="secondary" style={{flex: 1}}>
                <ThemedView
                    style={{
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        padding: percentToDP(5),
                        marginTop: 32
                    }}
                >
                    {/*POST HEADER*/}
                    <HorizontalView justifyOption="flex-start" colorName="transparent"
                                    style={{marginBottom: percentToDP(5)}}>
                        <UserAvatar
                            size={10}
                            doLink={true}
                            userId={"userIdFromList"}
                        />
                        <ThemedText style={{backgroundColor: "transparent", marginLeft: percentToDP(3)}}
                                    textStyleName="big">Username</ThemedText>
                    </HorizontalView>

                    {/*IMAGE*/}
                    <ThemedView
                        style={{
                            width: percentToDP(90),
                            height: percentToDP(90),
                            marginBottom: percentToDP(5),
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
                    <ThemedText style={{backgroundColor: "transparent", marginBottom: 24}}
                                textStyleName="small">Oh what a great description! Surely written by a genius. Also look
                        at this
                        cute doggo.</ThemedText>


                    {/*COMMENTS AND LIKES*/}
                    <HorizontalView colorName="transparent" style={{alignItems: "center", marginBottom: 16}}
                                    justifyOption={"space-between"}>
                        <HorizontalView
                            justifyOption="flex-start"
                        >
                            <PetAvatar
                                size={8}
                                username="Username"
                                pet="Cutie1"
                                doLink={true}
                            />
                            <PetAvatar
                                size={8}
                                username="Username"
                                pet="Cutie2"
                                doLink={true}
                            />
                            <PetAvatar
                                size={8}
                                username="Username"
                                pet="Cutie3"
                                doLink={true}

                            />
                        </HorizontalView>
                        <HorizontalView justifyOption={"flex-end"}>
                            <Pressable onPress={() => setLiked(!liked)}>
                                <ThemedIcon
                                    // size={32}
                                    name={liked ? "heart" : "heart-outline"}
                                    style={{
                                        paddingRight: 8,
                                        // paddingBottom: percentToDP(1),
                                    }}
                                />
                            </Pressable>
                            <ThemedText style={{fontSize: 24}}>21</ThemedText>
                        </HorizontalView>
                    </HorizontalView>
                </ThemedView>
                <ThemedView colorName="secondary" style={{marginTop: 32, marginBottom: 48}}>
                    <ThemedText backgroundColorName="transparent" style={{paddingHorizontal: 16, paddingTop: 16}}
                                textStyleName="big">Comments</ThemedText>
                    {comments.map((item, index) => (
                        <ThemedView key={index} colorName="transparent"
                                    style={{
                                        margin: 16,
                                        padding: 16,
                                        borderRadius: 10,
                                        borderColor: tertiaryColor,
                                        borderWidth: 2
                                    }}>

                            <HorizontalView style={{flex: 0, alignItems: "center", marginBottom: 6}}
                                            justifyOption="space-between"
                                            colorName="transparent">
                                <HorizontalView style={{flex: 0}} justifyOption={"flex-start"} colorName="transparent">
                                    <UserAvatar size={10} userId={"someCommenterId"} doLink={true}/>
                                    <ThemedText backgroundColorName="transparent" style={{marginLeft: 16}}>Commenter
                                        username</ThemedText>
                                </HorizontalView>
                                <HorizontalView justifyOption={"flex-end"} style={{alignItems: "center"}}
                                                colorName="transparent">
                                    <Pressable onPress={() => setLiked(!liked)}>
                                        <ThemedIcon
                                            size={24}
                                            name={liked ? "heart" : "heart-outline"}
                                            style={{
                                                paddingRight: 6,
                                            }}
                                        />
                                    </Pressable>
                                    <ThemedText textStyleName="default" backgroundColorName="transparent">3</ThemedText>
                                </HorizontalView>
                            </HorizontalView>

                            <ThemedText backgroundColorName="transparent" textStyleName="small">Absolutely gorgeous
                                post! The IQ of the poster
                                is over 9000! Can't believe this
                                is finally working. Probably. Maybe. Hopefully. Please don't let it break
                                somehow...</ThemedText>
                        </ThemedView>
                    ))}
                </ThemedView>
            </ThemedScrollView>
            {/*<ThemedScrollView colorName="tertiary"*/}
            {/*                  style={{*/}
            {/*                      paddingTop: percentToDP(20),*/}
            {/*                      height: heightPercentToDP(100),*/}
            {/*                  }}*/}
            {/*>*/}
            {/*    <ThemedView*/}
            {/*        colorName="background"*/}
            {/*        style={{*/}
            {/*            borderTopLeftRadius: 30,*/}
            {/*            borderTopRightRadius: 30,*/}
            {/*            padding: percentToDP(5),*/}
            {/*        }}*/}
            {/*    >*/}
            {/*        /!*POST HEADER*!/*/}
            {/*        <HorizontalView justifyOption="flex-start" colorName="transparent"*/}
            {/*                        style={{marginBottom: percentToDP(5)}}>*/}
            {/*            <UserAvatar*/}
            {/*                size={10}*/}
            {/*                doLink={true}*/}
            {/*                userId={"userIdFromList"}*/}
            {/*            />*/}
            {/*            <ThemedText style={{backgroundColor: "transparent", marginLeft: percentToDP(3)}}*/}
            {/*                        textStyleName="big">Username</ThemedText>*/}
            {/*        </HorizontalView>*/}

            {/*        /!*IMAGE*!/*/}
            {/*        <ThemedView*/}
            {/*            style={{*/}
            {/*                height: percentToDP(80),*/}
            {/*                marginBottom: percentToDP(5),*/}
            {/*                borderRadius: 30*/}
            {/*            }}*/}
            {/*        >*/}
            {/*            <Image*/}
            {/*                source={{*/}
            {/*                    uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",*/}
            {/*                }}*/}
            {/*                style={{*/}
            {/*                    width: "100%",*/}
            {/*                    height: "100%",*/}
            {/*                    borderRadius: 10,*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </ThemedView>*/}

            {/*        /!*TITLE AND DESCRIPTION*!/*/}
            {/*        <ThemedText style={{backgroundColor: "transparent", marginBottom: percentToDP(2)}}*/}
            {/*                    textStyleName="big">Example post with*/}
            {/*            a cutie</ThemedText>*/}
            {/*        <ThemedText style={{backgroundColor: "transparent", marginBottom: percentToDP(5)}}*/}
            {/*                    textStyleName="small">Oh what a great description! Surely written by a genius. Also look*/}
            {/*            at this*/}
            {/*            cute doggo.</ThemedText>*/}


            {/* TAGGED PETS - TO BE ADDED IN LATER VERSION */}
            {/*<HorizontalView*/}
            {/*    justifyOption="flex-start"*/}
            {/*    colorName="transparent"*/}
            {/*    style={{*/}
            {/*        paddingBottom: 32,*/}
            {/*    }}*/}
            {/*>*/}
            {/*    <PetAvatar*/}
            {/*        size={8}*/}
            {/*        username="Username"*/}
            {/*        pet="Cutie"*/}
            {/*        doLink={true}*/}
            {/*    />*/}
            {/*</HorizontalView>*/}

            {/*COMMENTS AND LIKES*/}
            {/*<HorizontalView colorName="transparent" style={{alignItems: "center"}}*/}
            {/*                justifyOption={"flex-end"}>*/}
            {/*    <HorizontalView justifyOption={"flex-end"} style={{alignItems: "center"}}>*/}
            {/*        <ThemedIcon*/}
            {/*            size={32}*/}
            {/*            name={"chatbox-outline"}*/}
            {/*            style={{*/}
            {/*                paddingRight: percentToDP(1),*/}
            {/*                paddingBottom: percentToDP(1),*/}
            {/*            }}*/}
            {/*        />*/}
            {/*        <ThemedText style={{backgroundColor: "transparent"}} textStyleName="big">3</ThemedText>*/}
            {/*    </HorizontalView>*/}
            {/*    <HorizontalView justifyOption={"flex-end"} style={{alignItems: "center"}}>*/}
            {/*        <Pressable onPress={() => setLiked(!liked)}>*/}
            {/*            <ThemedIcon*/}
            {/*                size={20}*/}
            {/*                name={liked ? "heart" : "heart-outline"}*/}
            {/*                style={{*/}
            {/*                    paddingRight: 10,*/}
            {/*                    paddingBottom: percentToDP(1),*/}
            {/*                }}*/}
            {/*            />*/}
            {/*        </Pressable>*/}
            {/*        <ThemedText style={{backgroundColor: "transparent"}} textStyleName="small">21</ThemedText>*/}
            {/*    </HorizontalView>*/}
            {/*</HorizontalView>*/}


            {/*        {dialogVisible && (*/}
            {/*            <PostReactionPopup onDismiss={() => setDialogVisible(false)}/>*/}
            {/*        )}*/}
            {/*    </ThemedView>*/}

            {/*    <CommentSection/>*/}
            {/*</ThemedScrollView>*/}
        </SafeAreaView>
    );
}
