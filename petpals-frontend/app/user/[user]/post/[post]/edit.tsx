import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import PostReactionPopup from "@/components/popups/PostReactionPopup";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Avatar, Image } from "react-native-ui-lib";
import Comment from "@/components/display/Comment";
import PetAvatar from "@/components/navigation/PetAvatar";

export default function EditPostScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const { userEmail } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  return (
    <ThemedScrollView style={{ paddingTop: "8%" }}>
      <ThemedView
        colorName="tertiary"
        style={{ margin: "3%", paddingVertical: "3%", borderRadius: 30 }}
      >
        <HorizontalView
          colorName="transparent"
          justifyOption="flex-start"
        >
          <ThemedView
            colorName="transparent"
            style={{ margin: "3%", borderRadius: 30 }}
          >
            <ThemedText textStyleName="big">TODO: Edit post</ThemedText>
          </ThemedView>
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
        <HorizontalView justifyOption="flex-end">
          <ThemedButton
            style={{ width: "30%" }}
            onPress={() => router.push("/user/me")}
          >
            Remove
          </ThemedButton>
          <ThemedButton
            style={{ width: "30%" }}
            onPress={() => router.push("../postID")}
          >
            Save
          </ThemedButton>
        </HorizontalView>
        <HorizontalView justifyOption="flex-start">
          <ThemedText
            style={{ marginRight: 10 }}
            textStyleName="smallBold"
          >
            Pets tagged:
          </ThemedText>
          <PetAvatar
            size={40}
            username="Username"
            pet="Cutie"
            doLink={true}
          />
        </HorizontalView>
        {dialogVisible && (
          <PostReactionPopup onDismiss={() => setDialogVisible(false)} />
        )}
      </ThemedView>

      <ThemedView
        colorName="tertiary"
        style={{ borderRadius: 50, margin: "4%" }}
      />
    </ThemedScrollView>
  );
}
