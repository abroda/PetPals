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
import { Pressable } from "react-native";
import { ThemedIcon } from "../decorations/static/ThemedIcon";

export default function Post(props: { username: string }) {
  const { userId } = useAuth();
  const [liked, setLiked] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const percentToDP = useWindowDimension("shorter");

  return (
    <ThemedView
      colorName="tertiary"
      style={{ margin: percentToDP(3), borderRadius: percentToDP(10) }}
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
          width: percentToDP(94),
          height: percentToDP(94), // TODO adapt to image's width to height ratio
          marginBottom: percentToDP(4),
        }}
      >
        <Image
          source={{
            uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
          }}
          style={{
            width: percentToDP(94),
            height: percentToDP(94),
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
        <Pressable
          onPress={() =>
            router.push("/user/Username/post/postId" as Href<string>)
          }
        >
          <ThemedIcon
            size={30}
            name={"chatbox-ellipses"}
            colorName="link"
            style={{
              paddingLeft: percentToDP(1),
              paddingBottom: percentToDP(1),
            }}
          />
        </Pressable>
        <Pressable onPress={() => setLiked(!liked)}>
          <ThemedIcon
            size={30}
            name={liked ? "heart" : "heart-outline"}
            style={{
              paddingRight: percentToDP(1),
              paddingBottom: percentToDP(1),
            }}
          />
        </Pressable>
      </HorizontalView>
      {dialogVisible && (
        <PostReactionPopup onDismiss={() => setDialogVisible(false)} />
      )}
    </ThemedView>
  );
}
