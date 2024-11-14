import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedTextField } from "../inputs/ThemedTextField";

import { useWindowDimension } from "@/hooks/useWindowDimension";
import { TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/WalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import TagList from "../lists/TagList";
import { ThemedView, ThemedViewProps } from "../basic/containers/ThemedView";
import { useWalks } from "@/hooks/useWalks";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { View } from "react-native";

export default function TagListInput({
  onAddTag = (tag: GroupWalkTag) => {},
  onDeleteTag = (tag: GroupWalkTag) => {},
  tags = [] as GroupWalkTag[],
}) {
  const [tagInput, setTagInput] = useState("");
  const percentToDP = useWindowDimension("shorter");
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [suggsetions, setSuggestions] = useState([
    "suggestion1",
    "suggestion2",
    "suggestion3",
    "suggestion4",
    "suggestion5",
  ]);
  const { isProcessing } = useWalks();

  const tagInputRef = useRef<TextFieldRef>(null);

  const getSuggestions = async (content: string) => {
    setSuggestions([
      content + "_1",
      content + "_2",
      content + "_3",
      content + "_4",
      content + "_5",
    ]);
  };

  return (
    <ThemedView
      style={{
        paddingHorizontal: percentToDP(3),
        paddingTop: percentToDP(1),
        paddingBottom: percentToDP(3),
        alignContent: "center",
      }}
    >
      <ThemedTextField
        ref={tagInputRef}
        label="Tags"
        placeholder="Add tag"
        autoComplete="off"
        value={tagInput}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 700)}
        onFocus={() => {
          if (tagInput.length > 0) {
            setShowSuggestions(true);
          }
        }}
        onChangeText={(newText: string) => {
          newText = newText.toLocaleLowerCase();

          if (newText.length > 0) {
            setShowSuggestions(true);
            getSuggestions(newText);
          } else {
            setShowSuggestions(false);
          }

          setTagInput(newText);
        }}
        withValidation
        validate={[
          (value) => (value?.length ?? 0) > 0,
          (value) => (value?.length ?? 3) > 2,
          (value) => (value?.match(tagRegex)?.length ?? 0) > 0,
          (value) => !tags.includes(value as GroupWalkTag),
        ]}
        validationMessage={[
          "",
          "Tag is too short",
          "Tag should not contain any special characters",
          "Tag already addded",
        ]}
        maxLength={50}
        trailingAccessory={
          <ThemedIcon
            name="add"
            colorName="primary"
            onPress={() => {
              if (tagInputRef.current?.validate()) {
                onAddTag(tagInput);
                setTagInput("");
              }
            }}
            style={{
              marginLeft: percentToDP(-12),
              paddingRight: percentToDP(4),
              paddingTop: percentToDP(1),
            }}
          />
        }
      />
      {showSuggestions && (
        <ThemedView
          style={{
            borderColor: "white",
            borderWidth: 1,
          }}
        >
          {isProcessing && <ThemedLoadingIndicator size={"small"} />}
          {!isProcessing &&
            suggsetions.map((s) => (
              <ThemedText
                onPress={() => {
                  setTagInput(s);
                  setShowSuggestions(false);
                }}
              >
                {s}
              </ThemedText>
            ))}
        </ThemedView>
      )}

      <TagList
        tags={tags}
        onPressTag={onDeleteTag}
      />
    </ThemedView>
  );
}
