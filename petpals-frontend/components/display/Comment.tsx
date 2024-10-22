import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "../inputs/ThemedButton";
import { useState } from "react";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";

export default function Comment(props: { commentId: string }) {
  const { userEmail } = useAuth();
  const [liked, setLiked] = useState(false);

  return (
    <ThemedView style={{ margin: "3%", padding: "3%", borderRadius: 30 }}>
      <HorizontalView colorName="transparent">
        <HorizontalView
          colorName="transparent"
          justifyOption="flex-start"
        >
          <ThemedView style={{ marginRight: "3%", borderRadius: 30 }}>
            <UserAvatar
              size={10}
              doLink={true}
              username={(userEmail?.length ?? 0) > 0 ? userEmail ?? "me" : "me"}
            />
          </ThemedView>
          <ThemedText textStyleName="big">Username</ThemedText>
        </HorizontalView>
        <Pressable onPress={() => setLiked(!liked)}>
          <ThemedIcon name={liked ? "heart" : "heart-outline"} />
        </Pressable>
      </HorizontalView>
      <ThemedView colorName="secondary">
        <ThemedText
          backgroundColorName="secondary"
          style={{ marginHorizontal: "1%", marginVertical: "3%" }}
        >
          Example comment comment
        </ThemedText>
      </ThemedView>
    </ThemedView>
  );
}
