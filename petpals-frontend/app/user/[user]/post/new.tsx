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

export default function NewPostScreen() {
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
            <ThemedText textStyleName="big">TODO: Add post</ThemedText>
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
              uri: "https://www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg",
            }}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </ThemedView>
        <ThemedText>Enter Title</ThemedText>
        <HorizontalView justifyOption="flex-end">
          <ThemedButton
            style={{ width: "30%" }}
            onPress={() => router.replace("./newPostID")}
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
