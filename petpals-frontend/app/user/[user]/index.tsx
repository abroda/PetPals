import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import { router, usePathname } from "expo-router";
import Post from "./post/[post]";
import PostFeed from "@/components/lists/PostFeed";
import PetAvatar from "@/components/navigation/PetAvatar";

export default function UserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  return (
    <ThemedView style={{ height: "100%", paddingTop: 10 }}>
      <HorizontalView justifyOption="flex-end">
        <ThemedText style={{ margin: 10 }}>{username}</ThemedText>
        <UserAvatar
          username={username}
          size={50}
          doLink={false}
        ></UserAvatar>
      </HorizontalView>
      <HorizontalView justifyOption="flex-start">
        <ThemedText
          style={{ marginRight: 10 }}
          textStyleName="smallBold"
        >
          Pets:
        </ThemedText>
        <PetAvatar
          size={40}
          username={username}
          pet="Cutie"
          doLink={true}
        />
      </HorizontalView>
      <ThemedView style={{ height: "80%" }}>
        <ThemedText>TODO:User Profile</ThemedText>
        {username === "me" && (
          <ThemedButton
            onPress={() => {
              router.dismissAll();
              router.push("/user/me/settings");
            }}
          >
            Settings
          </ThemedButton>
        )}
        {username === "me" && (
          <ThemedButton
            onPress={() => {
              router.dismissAll();
              router.replace("/");
            }}
          >
            Logout
          </ThemedButton>
        )}
        {username === "me" && (
          <ThemedButton
            onPress={() => {
              router.dismissAll();
              router.push("./post/new");
            }}
          >
            Add post
          </ThemedButton>
        )}
        {username === "me" && (
          <ThemedButton
            onPress={() => {
              router.dismissAll();
              router.push("./pet/new");
            }}
          >
            Add pet
          </ThemedButton>
        )}
        {username !== "me" && (
          <ThemedButton
            onPress={() => {
              router.dismissAll();
              router.push(`/chat/${username}`);
            }}
          >
            Chat
          </ThemedButton>
        )}
        {username !== "me" && (
          <ThemedButton onPress={() => {}}>Send friend request</ThemedButton>
        )}
        {username !== "me" && (
          <ThemedButton onPress={() => {}}>Block</ThemedButton>
        )}
        <PostFeed username={username} />
      </ThemedView>
    </ThemedView>
  );
}
