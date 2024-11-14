import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import Comment from "../display/Comment";
import { CommentContent, GroupWalkTag } from "@/context/WalksContext";
import HorizontalView, {
  HorizontalViewProps,
} from "../basic/containers/HorizontalView";
import { Tag } from "../display/Tag";

export default function TagList({
  tags,
  onPressTag = (tag) => {},
  style,
  ...rest
}: {
  tags: GroupWalkTag[];
  onPressTag?: (tag: GroupWalkTag) => void;
} & HorizontalViewProps) {
  const percentToDP = useWindowDimension("shorter");
  return (
    <HorizontalView
      justifyOption="flex-start"
      colorName="disabled"
      style={[
        {
          flexWrap: "wrap",
          borderRadius: percentToDP(6),
          marginBottom: percentToDP(5),
          padding: percentToDP(3),
        },
        style,
      ]}
      {...rest}
    >
      {Array.from(tags).map((tag: GroupWalkTag) => (
        <Tag
          key={tag}
          label={tag}
          onPress={onPressTag}
        />
      ))}
    </HorizontalView>
  );
}
