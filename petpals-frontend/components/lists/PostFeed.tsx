import {ThemedView, ThemedViewProps,} from "@/components/basic/containers/ThemedView";
import {FlatList} from "react-native-gesture-handler";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import Post from "@/components/display/Post";
import {ViewStyle} from "react-native";
import {useEffect} from "react";
import {usePosts} from "@/hooks/usePosts";

export type PostFeedProps = {
    outerViewProps?: ThemedViewProps;
    flatListStyle?: ViewStyle;
};

export default function PostFeed({
                                     outerViewProps,
                                     flatListStyle,
                                 }: PostFeedProps) {
    const heightPercentToDP = useWindowDimension("height");
    const {posts, loadPosts, hasMore, isProcessing} = usePosts();

    // Initial load
    useEffect(() => {
        // loadPosts().then(() => {
        // });
        // console.log("TETS")
        loadPosts().then(r => console.log("RES: " + r))
        console.log("POSTS: ", posts)
    }, []);

    // Load more when reaching end of the list
    const loadMoreData = () => {
        if (hasMore && !isProcessing) {
            loadPosts().then(() => {
            });
        }
    };

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
                keyExtractor={(index) => index.toString()}
                renderItem={({item}) => <Post/>} // TODO: pass postData to Post element
                contentContainerStyle={{paddingBottom: 50}}
                {...flatListStyle}
                onEndReached={loadPosts}
            />
        </ThemedView>
    );
}
