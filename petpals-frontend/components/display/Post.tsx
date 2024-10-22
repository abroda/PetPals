import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { Image } from "react-native-ui-lib";
import { ThemedButton } from "../inputs/ThemedButton";
import { Href, router } from "expo-router";
import PostReactionPopup from "../popups/PostReactionPopup";
import { useState } from "react";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export default function Post(props: { username: string }) {
  const { userId } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  const percentToDP = useWindowDimension("shorter");

  return (
    <ThemedView
      colorName="tertiary"
      style={{ margin: percentToDP(5), borderRadius: percentToDP(10) }}
    >
      <HorizontalView
        colorName="transparent"
        justifyOption="flex-start"
      >
        <ThemedView
          colorName="transparent"
          style={{
            marginLeft: percentToDP(4),
            marginRight: percentToDP(2),
            marginVertical: percentToDP(4),
          }}
        >
          <UserAvatar
            size={11}
            doLink={true}
            username={props.username}
          />
        </ThemedView>

        <ThemedText
          style={{
            backgroundColor: "transparent",
            paddingBottom: percentToDP(1),
          }}
          textStyleName="big"
        >
          {props.username}
        </ThemedText>
      </HorizontalView>
      <ThemedView
        style={{
          width: percentToDP(90),
          height: percentToDP(90), // TODO adapt to image's width to height ratio
          marginBottom: percentToDP(4),
        }}
      >
        <Image
          source={{
            uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
          }}
          style={{
            width: percentToDP(90),
            height: percentToDP(90),
          }}
        />
      </ThemedView>
      <ThemedText
        style={{
          backgroundColor: "transparent",
          marginHorizontal: percentToDP(4),
          marginBottom: percentToDP(6),
        }}
      >
        Example post with a cutie
      </ThemedText>
      <HorizontalView
        colorName="transparent"
        style={{
          marginBottom: percentToDP(4),
          marginHorizontal: percentToDP(4),
        }}
      >
        <ThemedButton
          style={{ width: percentToDP(39) }}
          onPress={() =>
            router.push("/user/Username/post/postId" as Href<string>)
          }
          label="Comments"
        />
        <ThemedButton
          style={{ width: percentToDP(39) }}
          onPress={() =>
            props.username === "me"
              ? router.push("/user/me/post/postID/edit")
              : setDialogVisible(true)
          }
          label={props.username === "me" ? "Edit" : "Add reaction"}
        />
      </HorizontalView>
      {dialogVisible && (
        <PostReactionPopup onDismiss={() => setDialogVisible(false)} />
      )}
    </ThemedView>
  );
}
