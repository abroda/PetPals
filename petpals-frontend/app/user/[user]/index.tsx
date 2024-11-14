import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { router, usePathname } from "expo-router";
import PostFeed from "@/components/lists/PostFeed";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { useAuth } from "@/hooks/useAuth";

export default function UserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const { logout } = useAuth();
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  return (
    <SafeAreaView>
      <ThemedView
        style={{
          height: heightPercentToDP(100),
          paddingTop: heightPercentToDP(6),
        }}
      >
        <HorizontalView justifyOption="flex-end">
          <ThemedText style={{ margin: percentToDP(4) }}>{username}</ThemedText>
          <UserAvatar
            userId={username}
            size={13}
            doLink={false}
          ></UserAvatar>
          {username == "me" && (
            <Pressable
              onPress={() => {
                router.push("/user/me/editProfile");
              }}
            >
              <ThemedIcon name="pencil"></ThemedIcon>
            </Pressable>
          )}
        </HorizontalView>
        <HorizontalView
          justifyOption="flex-start"
          style={{ paddingHorizontal: percentToDP(4) }}
        >
          <ThemedText
            style={{ marginRight: percentToDP(2) }}
            textStyleOptions={{ size: "small", weight: "bold" }}
          >
            Pets:
          </ThemedText>
          <PetAvatar
            size={11}
            username={username}
            pet="Cutie"
            doLink={true}
          />
          {username == "me" && (
            <Pressable
              onPress={() => {
                router.push("/user/me/pet/Cutie/edit");
              }}
            >
              <ThemedIcon name="pencil"></ThemedIcon>
            </Pressable>
          )}
        </HorizontalView>
        <ThemedView
          style={{
            height: heightPercentToDP(70),
          }}
        >
          <ThemedView
            style={{
              height: heightPercentToDP(18),
              paddingBottom: percentToDP(2),
            }}
          >
            {username === "me" && (
              <HorizontalView
                justifyOption="space-evenly"
                style={{
                  height: heightPercentToDP(10),
                  marginBottom: percentToDP(1),
                }}
              >
                <ThemedButton
                  onPress={() => {
                    router.push("/user/me/settings");
                  }}
                  label="Settings"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
                <ThemedButton
                  onPress={async () => {
                    logout();
                    router.dismissAll();
                    router.replace("/");
                  }}
                  label="Logout"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
              </HorizontalView>
            )}
            {username === "me" && (
              <HorizontalView
                justifyOption="space-evenly"
                style={{
                  height: heightPercentToDP(10),
                  marginBottom: percentToDP(1),
                }}
              >
                <ThemedButton
                  onPress={() => {
                    router.push("./post/new");
                  }}
                  label="Add post"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
                <ThemedButton
                  onPress={() => {
                    router.push("./pet/new");
                  }}
                  label="Add pet"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
              </HorizontalView>
            )}
            {username !== "me" && (
              <HorizontalView
                style={{
                  height: heightPercentToDP(10),
                  marginBottom: percentToDP(4),
                }}
              >
                <ThemedButton
                  onPress={() => {
                    router.push(`/chat/${username}`);
                  }}
                  label="Chat"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
                <ThemedButton
                  onPress={() => {}}
                  label="Send friend request"
                  style={{ width: percentToDP(63) }}
                ></ThemedButton>
              </HorizontalView>
            )}
            {username !== "me" && (
              <HorizontalView
                style={{
                  height: heightPercentToDP(20),
                  marginBottom: percentToDP(4),
                }}
              >
                <ThemedButton
                  onPress={() => {}}
                  label="Block"
                  style={{ width: percentToDP(33) }}
                ></ThemedButton>
              </HorizontalView>
            )}
          </ThemedView>
          <PostFeed
            outerViewProps={{
              style: {
                marginBottom: percentToDP(1),
              },
            }}
          />
        </ThemedView>
      </ThemedView>
    </SafeAreaView>
  );
}
