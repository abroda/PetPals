import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import Comment from "../display/Comment";
import { CommentContent, GroupWalkTag } from "@/context/GroupWalksContext";
import HorizontalView, {
  HorizontalViewProps,
} from "../basic/containers/HorizontalView";
import { Tag } from "../display/Tag";
import { router, Href } from "expo-router";

export default function TagList({
  tags,
  onPressTag,
  style,
  showDeleteIcons,
  ...rest
}: {
  tags: GroupWalkTag[];
  onPressTag?: (tag: GroupWalkTag) => void;
  showDeleteIcons?: boolean;
} & HorizontalViewProps) {
  const percentToDP = useWindowDimension("shorter");
  return (
    <HorizontalView
      justifyOption="flex-start"
      colorName={rest.colorName ?? "textField"}
      style={[
        {
          flexWrap: "wrap",
          borderRadius: percentToDP(5),
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
          onPress={onPressTag ? () => onPressTag(tag) : undefined}
          showDeleteIcon={showDeleteIcons}
        />
      ))}
      {tags.length == 0 && (
        <ThemedText
          textColorName="placeholderText"
          backgroundColorName="transparent"
          style={{ paddingVertical: percentToDP(1.5) }}
        >
          {"No tags"}
        </ThemedText>
      )}
    </HorizontalView>
  );
}
