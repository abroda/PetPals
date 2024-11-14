import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedText} from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import React, {useCallback, useRef, useState} from "react";
import {Image} from "react-native-ui-lib";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {Href, router} from "expo-router";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {Pressable} from "react-native";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {PostType} from "@/context/PostContext";
import {usePosts} from "@/hooks/usePosts";
import {useAuth} from "@/hooks/useAuth";

export default function Post({postFromFeed}: { postFromFeed: PostType }) {
    const {userId} = useAuth()
    const [post, setPost] = useState(postFromFeed)
    const {likePostById, removeLikePostById} = usePosts();
    const [liked, setLiked] = useState(post.likes.includes(userId!));
    const percentToDP = useWindowDimension("shorter");
    const asyncAbortController = useRef<AbortController | undefined>();


    const handlePostLike = useCallback(async () => {
        console.log("Start loading");
        asyncAbortController.current = new AbortController();
        let result;
        console.log("LIKED: ", liked)
        if (!liked) {
            result = await likePostById(
                postFromFeed.id,
                asyncAbortController.current
            );
        } else {
            result = await removeLikePostById(
                postFromFeed.id,
                asyncAbortController.current
            );
        }

        console.log("result: ", result)

        if (result.success) {
            setPost(result.returnValue);
            setLiked(!liked)
        }
        console.log("Stop loading");
    }, [liked]);


    return (
        <ThemedView
            colorName="background"
            style={{
                margin: percentToDP(5),
                borderRadius: 10,
                paddingHorizontal: percentToDP(5),
                paddingTop: 16,
                paddingBottom: 24
            }}
        >
            {/*POST HEADER*/}
            <HorizontalView justifyOption="flex-start" colorName="transparent" style={{marginBottom: 16}}>
                <UserAvatar
                    size={10}
                    doLink={true}
                    userId={post.author.id}
                    imgUrl={post.author.imageUrl}
                />
                <ThemedText style={{backgroundColor: "transparent", marginLeft: 16}}
                            textStyleName="big">{post.author.username}</ThemedText>
            </HorizontalView>

            {/*IMAGE*/}
            {post.imageUrl &&
                <ThemedView
                    style={{
                        width: percentToDP(80),
                        height: percentToDP(80),
                        marginBottom: 24,
                        borderRadius: 30
                    }}
                >
                    <Image
                        source={{
                            uri: post.imageUrl,
                        }}
                        style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 10,
                        }}
                    />
                </ThemedView>
            }

            {/*TITLE AND DESCRIPTION*/}
            <ThemedText style={{backgroundColor: "transparent", marginBottom: 10}}
                        textStyleName="big">{post.title}</ThemedText>
            <ThemedText style={{backgroundColor: "transparent", marginBottom: 36}}
                        textStyleName="small">{post.description}</ThemedText>


            {/*COMMENTS AND LIKES*/}
            <HorizontalView colorName="transparent" style={{alignItems: "flex-start"}} justifyOption={"space-between"}>
                <ThemedButton
                    style={{
                        flexDirection: "row",
                        alignItems: "flex-end",
                        justifyContent: "center",
                        width: null,
                        paddingHorizontal: percentToDP(6)
                    }}
                    backgroundColorName="secondary"
                    onPress={() =>
                        router.push(`/user/${post.author.username}/post/${post.id}` as Href<string>)
                    }
                >
                    {/*Go to comment section*/}
                    <ThemedIcon name="chatbox" size={20} style={{marginRight: 10}}/>
                    <ThemedText style={{backgroundColor: "transparent"}}
                                textStyleName="small"
                                textColorName="primary">{post.comments.length} comments</ThemedText>
                </ThemedButton>
                <HorizontalView justifyOption={"flex-end"}>
                    <Pressable onPress={() => {
                        handlePostLike()
                    }
                    }>
                        <ThemedIcon
                            name={liked ? "heart" : "heart-outline"}
                            style={{
                                paddingRight: 8,
                            }}
                        />
                    </Pressable>
                    <ThemedText style={{fontSize: 24}}>{post.likes.length}</ThemedText>
                </HorizontalView>
            </HorizontalView>
        </ThemedView>
    );
}
