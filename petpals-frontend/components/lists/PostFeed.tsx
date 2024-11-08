import {ThemedView, ThemedViewProps,} from "@/components/basic/containers/ThemedView";
import {FlatList} from "react-native-gesture-handler";
import Post from "@/components/display/Post";
import {RefreshControl, View, ViewStyle} from "react-native";
import {useCallback, useEffect, useRef, useState} from "react";
import {usePosts} from "@/hooks/usePosts";
import {PostType} from "@/context/PostContext";
import {ThemedText} from "@/components/basic/ThemedText";

export type PostFeedProps = {
    outerViewProps?: ThemedViewProps;
    flatListStyle?: ViewStyle;
};

export default function PostFeed({
                                     outerViewProps,
                                     flatListStyle,
                                 }: PostFeedProps) {
    const {getFeed, isProcessing} = usePosts();
    const asyncAbortController = useRef<AbortController | undefined>();

    const [posts, setPosts] = useState<PostType[]>([])
    const [hasMore, setHasMore] = useState(true);
    const [currentPage, setCurrentPage] = useState(0);
    const size = 5;

    const [refreshing, setRefreshing] = useState(false);

    // Initial load
    useEffect(() => {
        console.log("INITIAL!")
        setHasMore(true)
        setCurrentPage(0)
        setPosts([])
        getData()

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
            <ThemedText>{refreshing ? "true" : "false"}</ThemedText>

            {/* ACTUAL POST LIST */}
            <FlatList
                data={posts}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({item}) =>
                    <Post postFromFeed={item}/>
                    // <View>
                    //     <ThemedText>TEST</ThemedText>
                    // </View>
            }
                contentContainerStyle={{paddingBottom: 50}}
                {...flatListStyle}
                onEndReached={() => {
                    if (hasMore && !isProcessing) {
                        getData();
                    }
                }}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={() => console.log("TESTING REFRESH!")}
                        colors={['#009688']} // Customize loading indicator color (optional)
                    />
                }
            />
        </ThemedView>
    );

}
