import React, { useEffect, useState } from "react";
import { View, Text, Pressable, FlatList } from "react-native";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ThemedText } from "@/components/basic/ThemedText";

// Used only locally here
interface Tag {
  id: string;
  tag: string;
}

// Used only locally here
interface AvailableTags {
  [category: string]: Tag[];
}


interface TagSelectorProps {
  availableTags: AvailableTags; // all available tags
  selectedTags?: Record<string, string[]>; // optional initial selected tags (if any)
  onTagSelectionChange?: (updatedTags: Record<string, string[]>) => void;
}

const TagSelector: React.FC<TagSelectorProps> = ({
                                                   availableTags,
                                                   selectedTags: initialSelectedTags = {},
                                                   onTagSelectionChange,
                                                 }) => {


  const [selectedTags, setSelectedTags] = useState<Record<string, string[]>>(
    initialSelectedTags
  );


  // Styling
  const colorScheme = useColorScheme();
  const themeColors = ThemeColors[colorScheme];
  const percentToDP = useWindowDimension("shorter");







  // Update state when initialSelectedTags changes
  useEffect(() => {
    setSelectedTags(initialSelectedTags);
    console.log("[DogTagSelector] Got initial tags: ", initialSelectedTags)
  }, [initialSelectedTags]);


  // HELPER:
  // Check if the category allows multiple choices
  const isMultiChoiceCategory = (category: string) => {
    const multiChoiceCategories = [
      "Activity Preference",
      "Friendliness",
      "Special Needs",
      "Temperament",
    ];
    return multiChoiceCategories.includes(category);
  };

  // HELPER:
  // Handle tag selection
  const handleTagToggle = (category: string, tagId: string) => {
    setSelectedTags((prev) => {
      const categoryTags = prev[category] || [];
      const isMultiChoice = isMultiChoiceCategory(category);

      const updatedTags = isMultiChoice
        ? categoryTags.includes(tagId)
          ? categoryTags.filter((id) => id !== tagId)
          : [...categoryTags, tagId]
        : categoryTags.includes(tagId)
          ? [] // Clear selection for single-choice
          : [tagId]; // Select new tag for single-choice

      const updatedState = { ...prev, [category]: updatedTags };

      // Notify parent about changes
      onTagSelectionChange?.(updatedState);

      return updatedState;
    });
  };


  // Render each tag item
  const renderTag = (category: string) => ({ item }: { item: Tag }) => {
    const isSelected = selectedTags[category]?.includes(item.id);

    return (
      <Pressable
        onPress={() => handleTagToggle(category, item.id)}
        style={{
          backgroundColor: isSelected ? themeColors.primary : themeColors.secondary,
          paddingHorizontal: percentToDP(2.5),
          paddingVertical: percentToDP(1.5),
          borderRadius: percentToDP(5),
          marginRight: percentToDP(1.5),
          marginBottom: percentToDP(2),
        }}
      >
        <ThemedText
          backgroundColorName={"transparent"}
          style={{
            color: isSelected ? themeColors.tertiary : themeColors.textOnSecondary,
            fontSize: percentToDP(4),
            fontWeight: "regular",
            letterSpacing: -0.2,
          }}
        >
          #{item.tag}
        </ThemedText>
      </Pressable>
    );
  };


  // Render each tag category
  const renderCategory = ({ item }: { item: string }) => {
    const category = item;

    return (
      <View key={category} style={{ marginBottom: 20 }}>
        {/* Category Header */}
        <ThemedText
          backgroundColorName={"transparent"}
          style={{
            fontSize: percentToDP(4),
            color: themeColors.accent,
            marginBottom: percentToDP(2),
            marginTop: percentToDP(2),
          }}
        >
          {category}
        </ThemedText>

        {/* Tags within this category */}
        <FlatList
          scrollEnabled={true}
          data={availableTags[category]}
          keyExtractor={(tag) => tag.id}
          renderItem={renderTag(category)}
          horizontal={true}
          contentContainerStyle={{
            flexDirection: "row",
          }}
        />
      </View>
    );
  };


  // Get a summary list of selected tags
  const renderSelectedTags = () => {
    const selected = Object.entries(selectedTags).flatMap(([category, tags]) =>
      tags.map((tagId) => {
        const tag = availableTags[category].find((t) => t.id === tagId);
        return tag?.tag;
      })
    );

    if (selected.length === 0) {
      return (
        <ThemedText
          backgroundColorName={"transparent"}
          style={{
            color: themeColors.textOnSecondary,
            fontStyle: "italic",
          }}
        >
          No tags selected
        </ThemedText>
      );
    }

    return selected.map((tag) => (
      <View
        key={tag}
        style={{
          backgroundColor: themeColors.primary,
          paddingHorizontal: percentToDP(2.5),
          paddingVertical: percentToDP(1.5),
          borderRadius: percentToDP(5),
          marginRight: percentToDP(1.5),
          marginBottom: percentToDP(2),
        }}
      >
        <ThemedText
          backgroundColorName={"transparent"}
          style={{
            fontSize: percentToDP(4),
            fontWeight: "regular",
            letterSpacing: -0.2,
            color: themeColors.tertiary,
          }}
        >
          #{tag}
        </ThemedText>
      </View>
    ));
  };


  // If not yet loaded or missing
  // FALLBACK
  if (!availableTags || Object.keys(availableTags).length === 0) {
    return (
      <ThemedText backgroundColorName={"transparent"} style={{
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
      }}>
        Loading tags...
      </ThemedText>
    );}



  return (
    <View style={{ padding: 10 }}>

      {/* Render available tags grouped by category */}
      <FlatList
        data={Object.keys(availableTags)}
        keyExtractor={(item) => item}
        renderItem={renderCategory}
        contentContainerStyle={{ marginBottom: 20 }}
      />

      {/* Summary of selected tags */}
      <View style={{ marginTop: 20 }}>
        <ThemedText
          textStyleOptions={{ weight: "bold" }}
          style={{
            fontSize: percentToDP(4),
            color: themeColors.primary,
            marginBottom: percentToDP(2),
            marginTop: percentToDP(2),
          }}
        >
          Selected Tags:
        </ThemedText>

        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
          }}
        >
          {renderSelectedTags()}
        </View>
      </View>
    </View>
  );
};

export default TagSelector;
