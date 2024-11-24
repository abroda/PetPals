import React, { useState } from "react";
import {
  View,
  TextInput,
  Pressable,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedText } from "@/components/basic/ThemedText";
import { ColorName, ThemedColor, useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { widthPercentageToDP, heightPercentageToDP } from "react-native-responsive-screen";
import {ThemeColors} from "@/constants/theme/Colors";



export type SearchBarProps = {
  onSearch: (query: string, context: string) => void;
  onClear: () => void;
  contexts: string[]; // E.g., ["posts", "users"]
  style?: ViewStyle;
  inputStyle?: TextStyle;
  tabStyle?: ViewStyle;
  tabTextStyle?: TextStyle;
  activeTabStyle?: ViewStyle;
  activeTabTextStyle?: TextStyle;
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  inputBackgroundColorName?: ColorName;
  inputBackgroundThemedColor?: ThemedColor;
  inputTextColorName?: ColorName;
  inputTextThemedColor?: ThemedColor;
  iconColorName?: ColorName;
  iconThemedColor?: ThemedColor;
};

const SearchBar: React.FC<SearchBarProps> = ({
                                               onSearch,
                                               onClear,
                                               contexts,
                                               style={
                                                 backgroundColor: useThemeColor("transparent"),
                                               },
                                               inputStyle={
                                                 backgroundColor: useThemeColor("tertiary"),
                                                 marginHorizontal: widthPercentageToDP(1),
                                               },
                                               tabStyle={
                                                 backgroundColor: 'transparent',
                                                 borderBottomWidth: 2,
                                                 borderBottomColor: useThemeColor("tertiary")
                                               },
                                               tabTextStyle={
                                                 backgroundColor: 'transparent',
                                                 fontSize: 14,
                                                 fontWeight: 'light',
                                               },
                                               activeTabStyle={
                                                 backgroundColor: 'transparent',
                                                 borderBottomWidth: 2,
                                                 borderBottomColor: useThemeColor("primary")
                                               },
                                               activeTabTextStyle,
                                               backgroundColorName = 'secondary',
                                               backgroundThemedColor = 'secondary',
                                               inputBackgroundColorName = 'tertiary',
                                               inputBackgroundThemedColor =  'secondary',
                                               inputTextColorName = 'textOnSecondary',
                                               inputTextThemedColor,
                                               iconColorName = 'primary',
                                               iconThemedColor,
                                             }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeContext, setActiveContext] = useState(contexts[0]); // Default to the first context

  // Colors from theme
  // @ts-ignore
  const backgroundColor = useThemeColor(backgroundColorName, backgroundThemedColor);
  // @ts-ignore
  const inputBackgroundColor = useThemeColor(inputBackgroundColorName, inputBackgroundThemedColor);
  const inputTextColor = useThemeColor(inputTextColorName, inputTextThemedColor);
  const iconColor = useThemeColor(iconColorName, iconThemedColor);

  const percentToDP = useWindowDimension("shorter");

  const handleClear = () => {
    setSearchQuery("");
    onSearch("", activeContext);
    onClear();
  };

  return (
    <View style={[styles.container, { backgroundColor: backgroundColor }, style]}>

      {/* Context Tabs */}
      <View style={[styles.tabsContainer,{backgroundColor: backgroundColor}]}>
        {contexts.map((context) => (
          <Pressable
            key={context}
            style={[
              styles.tab,
              {backgroundColor: useThemeColor("primary", {light: "primary", dark: "primary"})},
              tabStyle,
              context === activeContext && [
                styles.activeTab,
                activeTabStyle,
              ],
            ]}
            onPress={() => setActiveContext(context)}
          >
            <ThemedText
              style={[
                styles.tabText,
                tabTextStyle,
                context === activeContext && [
                  styles.activeTabText,
                  activeTabTextStyle,
                ],
              ]}
            >
              {context.toUpperCase()}
            </ThemedText>
          </Pressable>
        ))}
      </View>

      {/* Search Input */}
      <View
        style={[
          styles.searchContainer,
          { backgroundColor: useThemeColor("tertiary")},
        ]}
      >
        <ThemedIcon name="search-outline" size={20} color={iconColor} style={styles.icon} />
        <TextInput
          value={searchQuery}
          onChangeText={(text) => setSearchQuery(text)}
          onSubmitEditing={() => onSearch(searchQuery, activeContext)}
          placeholder={`Search ${activeContext}`}
          style={[
            styles.input,
            { color: inputTextColor },
            inputStyle,
          ]}
          placeholderTextColor={iconColor}
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={handleClear}>
            <ThemedIcon name="close-circle-outline" size={20} color={iconColor} />
          </Pressable>
        )}
      </View>
    </View>
  );
};

export default SearchBar;

// Styles
const styles = StyleSheet.create({
  container: {
    width: widthPercentageToDP(90),
    marginHorizontal: 'auto',
    marginVertical: heightPercentageToDP(1),
    borderRadius: 10,
  },

  tabsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 5,
    marginHorizontal: 5,

    backgroundColor: 'red',
  },
  activeTab: {

    backgroundColor: 'red',
  },
  tabText: {
    fontWeight: "bold",
  },
  activeTabText: {
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    borderRadius: 10,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    height: 40,
  },
});
