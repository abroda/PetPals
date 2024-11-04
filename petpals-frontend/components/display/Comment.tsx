import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "../inputs/ThemedButton";
import { useState } from "react";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { CommentContent } from "@/context/WalksContext";

export default function Comment({
  commentId,
  comment,
}: {
  commentId: string;
  comment?: CommentContent;
}) {
  const { userEmail } = useAuth();
  const [liked, setLiked] = useState(false);
  const percentToDP = useWindowDimension("shorter");

  return (
    <ThemedView
      style={{
        padding: percentToDP(4),
        borderRadius: percentToDP(10),
        marginBottom: percentToDP(2),
      }}
    >
      <HorizontalView
        colorName="transparent"
        style={{ marginBottom: percentToDP(2) }}
      >
        <HorizontalView
          colorName="transparent"
          justifyOption="flex-start"
        >
          <ThemedView
            style={{
              marginRight: percentToDP(1),
              borderRadius: percentToDP(10),
            }}
          >
            <UserAvatar
              size={10}
              doLink={true}
              userId={comment?.creator.id ?? "me"}
            />
          </ThemedView>
          <ThemedText textStyleOptions={{ size: "big" }}>
            {comment?.creator.name ?? "Username"}
          </ThemedText>
        </HorizontalView>
        <Pressable onPress={() => setLiked(!liked)}>
          <ThemedIcon name={comment?.liked ? "heart" : "heart-outline"} />
        </Pressable>
      </HorizontalView>
      <ThemedText
        backgroundColorName="secondary"
        style={{
          marginHorizontal: percentToDP(1),
          marginVertical: percentToDP(1),
          borderRadius: percentToDP(10),
          padding: percentToDP(3),
        }}
      >
        {comment?.content ?? "Example comment comment"}
      </ThemedText>
    </ThemedView>
  );
}
