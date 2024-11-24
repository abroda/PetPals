import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Pressable } from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import UserAvatar from "@/components/navigation/UserAvatar";
import PostFeed from "@/components/lists/PostFeed";
import Post from "@/components/display/Post";
import NotificationsPopup from "@/components/popups/NotificationsPopup";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedText } from "@/components/basic/ThemedText";
import { Href, router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import SearchBar from "@/components/inputs/SearchBar";

export default function HomeScreen() {
  const { userId } = useAuth();
  const [notificationsVisible, setNotificationsVisible] = useState(false);
  const [searchResults, setSearchResults] = useState([]);

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const { userProfile, isProcessing, getUserById, responseMessage } = useUser();

  const handleSearch = (query: string, context: string) => {
    console.log(`Searching for "${query}" in ${context}`);
    // Call the relevant API or filter logic here
    // For example:
    if (context === "posts") {
      // Search posts
      // setSearchResults(searchPosts(query));
    } else if (context === "users") {
      // Search users
      // setSearchResults(searchUsers(query));
    }
  };


  return (
    <SafeAreaView>
      <ThemedView
        colorName="secondary"
        style={{ height: heightPercentToDP(100) }}
      >
        <ThemedView
          colorName="secondary"
          style={{ height: heightPercentToDP(10) }}
        >
          <HorizontalView style={{ paddingHorizontal: percentToDP(5) }}>
            {/* APP LOGO */}
            <AppLogo
              size={10}
              version="horizontal"
            />

            <ThemedView>
              <ThemedButton
                shape="short"
                center
                label="Add post"
                onPress={() =>
                  router.push("/user/Username/post/new" as Href<string>)
                }
                iconSource={() => (
                  <ThemedIcon
                    name="add"
                    size={20}
                    style={{
                      paddingRight: percentToDP(0.7),
                      paddingBottom: percentToDP(0.7),
                    }}
                    colorName="textOnPrimary"
                  />
                )}
                style={{ marginRight: percentToDP(5), width: percentToDP(30) }}
              />
            </ThemedView>

            {/* NOTIFICATIONS ICON */}
            <Pressable
              onPress={() => {
                console.log(notificationsVisible);
                setNotificationsVisible(!notificationsVisible);
              }}
            >
              <ThemedIcon
                size={percentToDP(6)}
                name="notifications"
              />
            </Pressable>

            {/* USER AVATAR */}
            <ThemedView style={{ marginLeft: percentToDP(3) }}>
              <UserAvatar
                size={10}
                doLink={true}
                userId={(userId?.length ?? 0) > 0 ? userId ?? "me" : "me"}
                imageUrl={userProfile?.imageUrl}
              />
            </ThemedView>
          </HorizontalView>
        </ThemedView>

        {/* SEARCH BAR */}
        <SearchBar
          onSearch={handleSearch}
          contexts={["posts", "users"]} // Define your search contexts
        />

        {/* POST FEED */}
        <PostFeed></PostFeed>
      </ThemedView>

      {notificationsVisible && (
        <NotificationsPopup onDismiss={() => setNotificationsVisible(false)} />
      )}
      {/*/!* BACKGROUND BEHIND ALL POSTS AND TOP BAR - COLOR VISIBLE BELOW NAVBAR*!/*/}
      {/*<ThemedView colorName="transparent" style={{height: heightPercentToDP(100)}}>*/}

      {/*    /!*APP LOGO AND USER AVATAR - TOP OF APP *!/*/}
      {/*    <HorizontalView colorName="background" style={{padding: percentToDP(3)}}>*/}
      {/*        <AppLogo*/}
      {/*            size={13}*/}
      {/*            version="horizontal"*/}
      {/*        />*/}
      {/*        <Pressable*/}
      {/*            onPress={() => {*/}
      {/*                console.log(notificationsVisible);*/}
      {/*                setNotificationsVisible(!notificationsVisible);*/}
      {/*            }}*/}
      {/*        >*/}
      {/*            <ThemedIcon*/}
      {/*                size={percentToDP(8)}*/}
      {/*                name="notifications"*/}
      {/*            />*/}
      {/*        </Pressable>*/}

      {/*        <ThemedView style={{marginLeft: percentToDP(3)}}>*/}
      {/*            <UserAvatar*/}
      {/*                size={13}*/}
      {/*                doLink={true}*/}
      {/*                userId={(userId?.length ?? 0) > 0 ? userId ?? "me" : "me"}*/}
      {/*            />*/}
      {/*        </ThemedView>*/}
      {/*    </HorizontalView>*/}

      {/*    {notificationsVisible && (*/}
      {/*        <NotificationsPopup*/}
      {/*            onDismiss={() => setNotificationsVisible(false)}*/}
      {/*        />*/}
      {/*    )}*/}

      {/*    /!* POST FEED *!/*/}
      {/*    <PostFeed username="Dominika_Xyz"></PostFeed>*/}

      {/*</ThemedView>*/}
    </SafeAreaView>
  );
}
