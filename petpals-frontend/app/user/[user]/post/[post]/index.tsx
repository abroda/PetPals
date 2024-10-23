import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import PostReactionPopup from "@/components/popups/PostReactionPopup";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { Href, router, usePathname } from "expo-router";
import { useState } from "react";
import { FlatList } from "react-native-gesture-handler";
import { Avatar, Image } from "react-native-ui-lib";
import Comment from "@/components/display/Comment";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import CommentSection from "@/components/display/CommentSection";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PostScreen() {
  const path = usePathname();
  const username = path.split("/")[2];
  const { userEmail } = useAuth();
  const [liked, setLiked] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{
          paddingTop: percentToDP(20),
          height: heightPercentToDP(90),
        }}
      >
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
                userId={username}
              />
            </ThemedView>

            <ThemedText
              style={{
                backgroundColor: "transparent",
                paddingBottom: percentToDP(1),
              }}
              textStyleName="big"
            >
              {username}
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
            justifyOption="flex-end"
            colorName="transparent"
            style={{
              marginBottom: percentToDP(4),
              marginHorizontal: percentToDP(4),
            }}
          >
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
          <HorizontalView
            justifyOption="flex-start"
            colorName="transparent"
            style={{
              paddingBottom: percentToDP(8),
              paddingHorizontal: percentToDP(4),
            }}
          >
            <ThemedText
              style={{ marginRight: 10 }}
              textStyleName="smallBold"
              backgroundColorName="transparent"
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

        <CommentSection />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
