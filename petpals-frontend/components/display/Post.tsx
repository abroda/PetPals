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

export default function Post(props: { username: string }) {
  const { userEmail } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);
  return (
    <ThemedView
      colorName="tertiary"
      style={{ margin: "3%", borderRadius: 30 }}
    >
      <HorizontalView
        colorName="transparent"
        justifyOption="flex-start"
      >
        <ThemedView
          colorName="tertiary"
          style={{ margin: "3%", borderRadius: 30 }}
        >
          <UserAvatar
            size={50}
            doLink={true}
            username={props.username}
          />
        </ThemedView>
        <ThemedText textStyleName="big">{props.username}</ThemedText>
      </HorizontalView>
      <ThemedView
        style={{
          width: "100%",
          height: 400,
          marginBottom: "5%",
        }}
      >
        <Image
          source={{
            uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
        />
      </ThemedView>
      <ThemedText>Example post with a cutie</ThemedText>
      <HorizontalView>
        <ThemedButton
          style={{ width: "40%" }}
          onPress={() =>
            router.push("/user/Username/post/postId" as Href<string>)
          }
        >
          Go to comment section
        </ThemedButton>
        <ThemedButton
          style={{ width: "30%" }}
          onPress={() =>
            props.username === "me"
              ? router.push("/user/me/post/postID/edit")
              : setDialogVisible(true)
          }
        >
          {props.username === "me" ? "Edit" : "Add reaction"}
        </ThemedButton>
      </HorizontalView>
      {dialogVisible && (
        <PostReactionPopup onDismiss={() => setDialogVisible(false)} />
      )}
    </ThemedView>
  );
}
