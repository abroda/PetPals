import {ThemedView, ThemedViewProps,} from "@/components/basic/containers/ThemedView";
import {FlatList} from "react-native-gesture-handler";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import Post from "@/components/display/Post";
import {ActivityIndicator, ViewStyle} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import {usePosts} from "@/hooks/usePosts";
import {PostType} from "@/context/PostContext";
import {ThemedText} from "@/components/basic/ThemedText";
import {has} from "react-native-reanimated/lib/typescript/createAnimatedComponent/utils";
import {View} from "react-native-ui-lib";

export type PostFeedProps = {
    outerViewProps?: ThemedViewProps;
    flatListStyle?: ViewStyle;
};

export default function PostFeed({
                                     outerViewProps,
                                     flatListStyle,
                                 }: PostFeedProps) {
    const heightPercentToDP = useWindowDimension("height");
    const {getFeed, isProcessing} = usePosts();
    const asyncAbortController = useRef<AbortController | undefined>();
    const [isLoading, setIsLoading] = useState(true)
    const [posts, setPosts] = useState<PostType[]>([])
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const size = 2;


    // Initial load
    useEffect(() => {
        getData().then(() => setIsLoading(false));

        return () => {
            asyncAbortController.current?.abort();
        };
    }, []);

    const getData = useCallback(async () => {
        if (!hasMore) return;
        console.log("Start loading");
        asyncAbortController.current = new AbortController();
        let result = await getFeed(
            currentPage,
            size,
            asyncAbortController.current
        );
        if (result.success) {
            setPosts((prevPosts) => [...prevPosts, ...result.returnValue.content]);
            setHasMore(result.returnValue.page.totalPages > currentPage);
            setCurrentPage((prevPage) => prevPage + 1)
        }
        console.log("Stop loading");
    }, [currentPage, posts, hasMore]);


    return (
        // POST BACKGROUND CONTAINER - flex here is important!
        <ThemedView
            colorName="secondary"
            style={[
                {
                    flex: 1,
                    height: "100%",
                },
                outerViewProps?.style,
            ]}
            {...outerViewProps}
        >
            {/* ACTUAL POST LIST */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) => <Post post={item}/>}
                contentContainerStyle={{paddingBottom: 50}}
                {...flatListStyle}
                onEndReached={() => {
                    if (hasMore && !isProcessing) {
                        getData();
                    }
                }}
            />
        </ThemedView>
    );

}
