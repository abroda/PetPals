import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import PostReactionPopup from "@/components/popups/PostReactionPopup";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useAuth } from "@/hooks/useAuth";
import { router, usePathname } from "expo-router";
import { useState } from "react";
import { Image } from "react-native-ui-lib";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewPostScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const { userEmail } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView style={{ paddingTop: percentToDP(8) }}>
        <ThemedView
          colorName="tertiary"
          style={{
            margin: percentToDP(3),
            paddingVertical: percentToDP(3),
            borderRadius: percentToDP(10),
          }}
        >
          <HorizontalView
            colorName="transparent"
            justifyOption="flex-start"
          >
            <ThemedView
              colorName="transparent"
              style={{ margin: percentToDP(3), borderRadius: percentToDP(10) }}
            >
              <ThemedText textStyleName="big">TODO: Add post</ThemedText>
            </ThemedView>
          </HorizontalView>
          <ThemedView
            style={{
              alignSelf: "center",
              height: 400,
              marginBottom: percentToDP(5),
            }}
          >
            <Image
              source={{
                uri: "https://www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg",
              }}
              style={{
                width: percentToDP(100),
                height: percentToDP(100),
              }}
            />
          </ThemedView>
          <ThemedText>Enter Title</ThemedText>
          <HorizontalView justifyOption="flex-end">
            <ThemedButton
              style={{ width: percentToDP(30) }}
              onPress={() => router.replace("./newPostID")}
              label="Save"
            ></ThemedButton>
          </HorizontalView>
          <HorizontalView justifyOption="flex-start">
            <ThemedText
              style={{ marginRight: percentToDP(5) }}
              textStyleName="smallBold"
            >
              Pets tagged:
            </ThemedText>
            <PetAvatar
              size={11}
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
          style={{ borderRadius: percentToDP(10), margin: percentToDP(4) }}
        />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
