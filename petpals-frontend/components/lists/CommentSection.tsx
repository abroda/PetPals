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
      colorName="transparent" //"secondary"
      style={{
        borderRadius: percentToDP(10),
        paddingVertical: 0, //percentToDP(4),
        paddingHorizontal: 0, //percentToDP(4),
        marginBottom: percentToDP(30),
        borderColor: "red",
      }}
    >
      <ThemedText
        textStyleOptions={{ weight: "semibold" }}
        backgroundColorName="transparent"
        style={{
          paddingLeft: 0, //percentToDP(3),
          margin: 0,
          paddingBottom: percentToDP(4),
        }}
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
