import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import {useCallback, useContext, useRef, useState} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {Alert, FlatList, Pressable, RefreshControl, StyleSheet, View} from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import UserAvatar from "@/components/navigation/UserAvatar";
import PostFeed from "@/components/lists/PostFeed";
import NotificationsPopup from "@/components/popups/NotificationsPopup";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { ThemedText } from "@/components/basic/ThemedText";
import { Href, router } from "expo-router";
import { useUser } from "@/hooks/useUser";
import SearchBar from "@/components/inputs/SearchBar";
import UserListItem from "@/components/lists/UserListItem";
import UserSearchList from "@/components/lists/UserSearchList";
import AppHeader from "@/components/decorations/static/AppHeader";

import { widthPercentageToDP } from "react-native-responsive-screen";
import { ColorName } from "react-native-ui-lib";
import themeContext from "@react-navigation/native/src/theming/ThemeContext";
import {useWebSocket} from "@/context/WebSocketContext";
import {usePostContext} from "@/context/PostContext";
import {useThemeColor} from "@/hooks/theme/useThemeColor";

export default function HomeScreen() {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // For User Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const asyncAbortController = useRef<AbortController | undefined>();

  // User Info
  const { userId, authToken } = useAuth();
  const {
    userProfile,
    isProcessing,
    searchUsers,
  } = useUser();
  const { fetchPosts, posts } = usePostContext();


  // For User search
  const handleSearch = async (query: string, context: string) => {
    console.log(`Searching for "${query}" in ${context}`);

    if (context === "users") {
      setIsSearching(true); // Switch to search results view
      const results = await searchUsers(query); // Fetch matching users
      // @ts-ignore
      setSearchResults(results); // Update the results
    } else {
      console.log("Search context is not supported:", context);
    }
  };

  const getData = useCallback(async () => {
    if (authToken && authToken != ""){
      console.log("authToken: ", authToken)
      setIsRefreshing(true);
      asyncAbortController.current = new AbortController();

      try {
        await fetchPosts(0, 10); // Fetch the first page of posts
      } catch (error) {
        console.error("[HomeScreen] Failed to fetch posts:", error);
        Alert.alert("Error", "Unable to refresh posts. Please try again.");
      } finally {
        setIsRefreshing(false);
      }
    } else {
      console.log("token not obtained yet.")
    }
  }, [fetchPosts, authToken]);


  return (
    <SafeAreaView>
      <ThemedView
        colorName="secondary"
        style={{ height: heightPercentToDP(100) }}
      >

          {/* Custom header with logo and notfications and user avatar */}
        <AppHeader backgroundColorName={"tertiary"}/>


        {/* SEARCH BAR */}
        <SearchBar
          onSearch={handleSearch}
          contexts={["posts", "users"]} // Define your search contexts
          onClear={() => {
            setIsSearching(false);
            setSearchQuery("");
          }}
        />

        {/* Conditional Rendering: User Search Results or Post Feed */}
        {isSearching && searchResults.length > 0 ? (
          <View
            style={{
              width: widthPercentageToDP(90),
              height: heightPercentToDP(70),
              alignContent: "center",
              justifyContent: "center",
              marginHorizontal: "auto",
              backgroundColor: "transparent",
            }}
          >
            <UserSearchList users={searchResults} />
            <ThemedButton
              label={"Close search"}
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
              style={{
                padding: 0,
                minHeight: heightPercentToDP(6),
                maxHeight: heightPercentToDP(7),
                maxWidth: widthPercentageToDP(90),
                alignSelf: "center",
              }}
            />
          </View>
        ) : isSearching && searchResults.length === 0 ? (
          <ThemedView
            colorName="secondary"
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: heightPercentToDP(2),
            }}
          >
            <ThemedIcon
              name="alert-circle-outline"
              size={40}
            />

            <ThemedText
              textColorName={"primary"}
              backgroundColorName={"transparent"}
              style={{
                marginVertical: heightPercentToDP(2),
              }}
            >
              No users found.
            </ThemedText>
            <ThemedButton
              label={"Clear search"}
              onPress={() => {
                setIsSearching(false);
                setSearchQuery("");
              }}
              style={{
                padding: 0,
                minHeight: heightPercentToDP(6),
                maxHeight: heightPercentToDP(7),
                maxWidth: widthPercentageToDP(50),
              }}
            />
          </ThemedView>
        ) : (
          <View style={{
            alignItems: 'center',
            paddingVertical: heightPercentToDP(2),
          }}>
            <ThemedView colorName={"secondary"} style={{

            }}>
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
                style={{
                  width: percentToDP(90),
                  marginVertical: percentToDP(2),
                }}
              />
              {/* Post Feed */}
              <PostFeed
                refreshControl={
                  <RefreshControl
                    refreshing={isRefreshing}
                    onRefresh={getData}
                    colors={[useThemeColor("accent"), useThemeColor("text")]}
                  />
                }
              />
            </ThemedView>

          </View>
        )}

      </ThemedView>

      {notificationsVisible && (
        <NotificationsPopup onDismiss={() => setNotificationsVisible(false)} />
      )}

    </SafeAreaView>
  );
}
