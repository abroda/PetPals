import {FlatList} from "react-native-gesture-handler";
import Post from "./Post";
import {ViewStyle} from "react-native";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {useThemeColor} from "@/hooks/theme/useThemeColor";
import {ThemedView} from "@/components/basic/containers/ThemedView";

export type PostFeedProps = {
    style?: ViewStyle;
    username: string;
};

export default function PostFeed({style, username}: PostFeedProps) {
    const postsData = [0, 1, 2, 3];
    const percentToDP = useWindowDimension("height");

    /*
      TODO PostFeed: pull posts from context, refreshing, comment/reaction icons,
      reaction dialog, layout
    */
    return (
        <ThemedView colorName={"secondary"}>
            <FlatList
                style={[
                    {
                        height: style?.height ?? percentToDP(76),
                        marginBottom: style?.marginBottom ?? percentToDP(6),
                    },
                    style,
                ]}
                data={postsData}
                renderItem={(item) => <Post/>}
            />
        </ThemedView>

    );
}
