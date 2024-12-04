import HorizontalView from "@/components/basic/containers/HorizontalView";
import {
  ThemedView,
  ThemedViewProps,
} from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedButton } from "../inputs/ThemedButton";
import { useState } from "react";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Pressable } from "react-native";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { CommentContent } from "@/context/GroupWalksContext";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ViewProps } from "react-native-ui-lib";
import { countToString } from "@/helpers/countToString";

export default function Comment({
  commentId,
  comment,
  ...rest
}: {
  commentId: string;
  comment?: CommentContent;
} & ThemedViewProps) {
  const { userEmail } = useAuth();
  const [liked, setLiked] = useState(false);
  const percentToDP = useWindowDimension("shorter");

  return (
    <ThemedView
      style={
        rest.style ?? {
          padding: percentToDP(4),
          borderRadius: percentToDP(6),
          borderColor: useThemeColor("disabled"),
          borderWidth: percentToDP(0.5),
          marginBottom: percentToDP(4),
        }
      }
      {...rest}
    >
      <HorizontalView
        style={{ flex: 0, alignItems: "center", marginBottom: percentToDP(3) }}
        justifyOption="space-between"
        colorName="transparent"
      >
        <HorizontalView
          style={{ flex: 0 }}
          justifyOption={"flex-start"}
          colorName="transparent"
        >
          <UserAvatar
            size={10}
            userId={"someCommenterId"}
            doLink={true}
          />
          <ThemedText
            backgroundColorName="transparent"
            style={{ marginLeft: percentToDP(4) }}
          >
            {comment?.creator.username ?? "Commenter username"}
          </ThemedText>
        </HorizontalView>
        <HorizontalView
          justifyOption={"flex-end"}
          style={{ alignItems: "center" }}
          colorName="transparent"
        >
          <Pressable onPress={() => setLiked(!liked)}>
            <ThemedIcon
              size={24}
              name={liked ? "heart" : "heart-outline"}
              style={{
                paddingRight: percentToDP(3),
              }}
            />
          </Pressable>
          <ThemedText backgroundColorName="transparent">
            {countToString((comment?.likes ?? 0) + (comment?.liked ? 1 : 0))}
          </ThemedText>
        </HorizontalView>
      </HorizontalView>

      <ThemedText
        backgroundColorName="transparent"
        textStyleOptions={{ size: "small" }}
        style={{ marginBottom: percentToDP(2) }}
      >
        {comment?.content}
      </ThemedText>
    </ThemedView>
    // <ThemedView
    //   style={{
    //     padding: percentToDP(4),
    //     borderRadius: percentToDP(10),
    //     marginBottom: percentToDP(2),
    //   }}
    // >
    //   <HorizontalView
    //     colorName="transparent"
    //     style={{ marginBottom: percentToDP(2) }}
    //   >
    //     <HorizontalView
    //       colorName="transparent"
    //       justifyOption="flex-start"
    //     >
    //       <ThemedView
    //         style={{
    //           marginRight: percentToDP(1),
    //           borderRadius: percentToDP(10),
    //         }}
    //       >
    //         <UserAvatar
    //           size={10}
    //           doLink={true}
    //           userId={comment?.creator.id ?? "me"}
    //         />
    //       </ThemedView>
    //       <ThemedText textStyleOptions={{ size: "big" }}>
    //         {comment?.creator.name ?? "Username"}
    //       </ThemedText>
    //     </HorizontalView>
    //     <Pressable onPress={() => setLiked(!liked)}>
    //       <ThemedIcon name={comment?.liked ? "heart" : "heart-outline"} />
    //     </Pressable>
    //   </HorizontalView>
    //   <ThemedText
    //     backgroundColorName="secondary"
    //     style={{
    //       marginHorizontal: percentToDP(1),
    //       marginVertical: percentToDP(1),
    //       borderRadius: percentToDP(10),
    //       padding: percentToDP(3),
    //     }}
    //   >
    //     {comment?.content ?? "Example comment comment"}
    //   </ThemedText>
    // </ThemedView>
  );
}
