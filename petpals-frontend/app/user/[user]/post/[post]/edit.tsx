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

export default function EditPostScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const { userEmail } = useAuth();
  const [dialogVisible, setDialogVisible] = useState(false);

  const percentToDP = useWindowDimension("shorter");
  const heighPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{ height: heighPercentToDP(100), paddingTop: percentToDP(8) }}
      >
        <ThemedView
          colorName="tertiary"
          style={{
            margin: percentToDP(3),
            paddingVertical: percentToDP(3),
            borderRadius: 30,
          }}
        >
          <HorizontalView
            colorName="transparent"
            justifyOption="flex-start"
          >
            <ThemedView
              colorName="transparent"
              style={{ margin: percentToDP(3), borderRadius: 30 }}
            >
              <ThemedText textStyleName="big">TODO: Edit post</ThemedText>
            </ThemedView>
          </HorizontalView>
          <ThemedView
            style={{
              alignSelf: "center",
              height: 400,
              marginBottom: percentToDP(4),
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
              style={{ width: percentToDP(30) }}
              onPress={() => router.push("/user/me")}
              label="Remove"
            ></ThemedButton>
            <ThemedButton
              style={{ width: percentToDP(30) }}
              onPress={() => router.push("../postID")}
              label="Save"
            ></ThemedButton>
          </HorizontalView>
          <HorizontalView justifyOption="flex-start">
            <ThemedText
              style={{ marginRight: 10 }}
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
