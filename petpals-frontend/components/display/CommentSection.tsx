import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import Comment from "./Comment";

export default function CommentSection() {
  const percentToDP = useWindowDimension("shorter");
  return (
    <ThemedView
      colorName="tertiary"
      style={{
        borderRadius: percentToDP(10),
        margin: percentToDP(2),
        paddingVertical: percentToDP(4),
        paddingHorizontal: percentToDP(3),
        marginBottom: percentToDP(30),
      }}
    >
      <ThemedText
        textStyleName="bigBold"
        backgroundColorName="transparent"
        style={{ paddingLeft: percentToDP(3), paddingBottom: percentToDP(4) }}
      >
        Comments
      </ThemedText>
      <FlatList
        scrollEnabled={false}
        data={
          ["1", "2", "3"]
          // TODO: what happens if there is a lot of comments?
          // add floating button "scroll to the top" after certain height?
          // or pagination?
        }
        renderItem={(commentId) => <Comment commentId={commentId.item} />}
      />
    </ThemedView>
  );
}
