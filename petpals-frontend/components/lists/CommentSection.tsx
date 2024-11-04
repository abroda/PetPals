import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import Comment from "../display/Comment";
import { CommentContent } from "@/context/WalksContext";

export default function CommentSection({
  commentsData,
}: {
  commentsData: CommentContent[];
}) {
  const percentToDP = useWindowDimension("shorter");
  return (
    <ThemedView
      colorName="secondary"
      style={{
        borderRadius: percentToDP(10),
        paddingVertical: percentToDP(4),
        paddingHorizontal: percentToDP(4),
        marginBottom: percentToDP(30),
      }}
    >
      <ThemedText
        textStyleOptions={{ size: "big", weight: "bold" }}
        backgroundColorName="transparent"
        style={{ paddingLeft: percentToDP(3), paddingBottom: percentToDP(4) }}
      >
        Comments
      </ThemedText>
      <FlatList
        scrollEnabled={false}
        data={
          commentsData
          // TODO: what happens if there is a lot of comments?
          // add floating button "scroll to the top" after certain height?
          // or pagination?
        }
        renderItem={(rowData) => (
          <Comment
            commentId={rowData.item?.id}
            comment={rowData.item}
          />
        )}
      />
    </ThemedView>
  );
}
