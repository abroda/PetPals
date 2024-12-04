import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import AppLogo from "@/components/decorations/static/AppLogo";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useContext, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { FlatList, Pressable, StyleSheet, View } from "react-native";
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
import UserListItem from "@/components/lists/UserListItem";
import UserSearchList from "@/components/lists/UserSearchList";
import AppHeader from "@/components/decorations/static/AppHeader";

import { widthPercentageToDP } from "react-native-responsive-screen";
import { ColorName } from "react-native-ui-lib";
import themeContext from "@react-navigation/native/src/theming/ThemeContext";

export default function HomeScreen() {
  const [notificationsVisible, setNotificationsVisible] = useState(false);

  // For User Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Styling
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  // User Info
  const { userId } = useAuth();
  const {
    userProfile,
    isProcessing,
    getUserById,
    responseMessage,
    searchUsers,
  } = useUser();


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
            <ThemedView colorName={"secondary"}>
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
              <PostFeed />
            </ThemedView>

          </View>
        )}

        {/*/!* User Results *!/*/}
        {/*<FlatList*/}
        {/*  data={searchResults}*/}
        {/*  keyExtractor={(item) => item.id}*/}
        {/*  renderItem={({ item }) => (*/}
        {/*    <UserListItem*/}
        {/*      id={item.id}*/}
        {/*      username={item.username}*/}
        {/*      description={item.description}*/}
        {/*      imageUrl={item.imageUrl}*/}
        {/*    />*/}
        {/*  )}*/}
        {/*  ListEmptyComponent={*/}
        {/*    searchQuery.length > 0 && !isSearching ? (*/}
        {/*      <ThemedText>*/}
        {/*        No users found*/}
        {/*      </ThemedText>*/}
        {/*    ) : null*/}
        {/*  }*/}
        {/*  style={styles.resultsContainer}*/}
        {/*/>*/}

        {/* POST FEED */}
        {/*<PostFeed></PostFeed>*/}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  resultsContainer: {
    marginTop: 10,
  },
  noResults: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
  },
});
