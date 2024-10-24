import {ThemedView} from "@/components/basic/containers/ThemedView";
import {FlatList} from "react-native-gesture-handler";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import Post from "@/components/display/Post";

export default function PostFeed() {
    const heightPercentToDP = useWindowDimension("height");

    const postsData = [0, 1, 2, 3];

    /*
      TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
      reaction dialog, layout
    */
    return (
        // POST BACKGROUND CONTAINER - flex here is important!
        <ThemedView
            colorName="secondary"
            style={{
                flex: 1,
                height: '100%',
            }}
        >
            {/* ACTUAL POST LIST */}
            <FlatList
                data={postsData}
                keyExtractor={(index) => index.toString()}
                renderItem={({item}) => <Post/>}
                contentContainerStyle={{paddingBottom: 50}}
            />
        </ThemedView>
    );
}
