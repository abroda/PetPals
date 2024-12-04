import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedTextField } from "../inputs/ThemedTextField";

import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/GroupWalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import TagList from "../lists/TagList";
import { ThemedView } from "../basic/containers/ThemedView";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useGroupWalks } from "@/hooks/useGroupWalks";

export default function TagListInput({
  onAddTag = (tag: GroupWalkTag) => {},
  onDeleteTag = (tag: GroupWalkTag) => {},
  tags = [] as GroupWalkTag[],
  width,
}: {
  onAddTag: (tag: GroupWalkTag) => void;
  onDeleteTag: (tag: GroupWalkTag) => void;
  tags?: GroupWalkTag[];
  width?: number;
}) {
  const [tagInput, setTagInput] = useState("");
  const [addTagEnabled, setAddTagEnabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggsetions, setSuggestions] = useState([] as string[]);
  const [isLoading, setIsLoading] = useState(false);
  const tagInputRef = useRef<TextFieldRef>(null);

  const { getTagSuggestions } = useGroupWalks();

  const percentToDP = useWindowDimension("shorter");
  const borderColor = useThemeColor("primary");

  const validate = (newText: string) => {
    let tagText = newText.trimStart().trimEnd();
    let message = "";

    if (tagText.length < 3) {
      message = " ";
    } else if (tagText.match(tagRegex)) {
      if (tags.includes(tagText)) {
        message = "Tag already added";
      }
    } else {
      message = "Tag should not include any special characters";
    }

    return message;
  };

  const onChangeText = async (newText: string) => {
    let input = newText.toLocaleLowerCase();
    setTagInput(input);

    let message = validate(input);
    setErrorMessage(message);

    if (message.length > 0) {
      setAddTagEnabled(false);
      setShowSuggestions(false);
      setSuggestions([]);
    } else {
      setAddTagEnabled(true);

      setIsLoading(true);
      setShowSuggestions(true);

      let result = await getTagSuggestions(input);

      if (result.success) {
        // show new suggestions (if there are any)
        setSuggestions(result.returnValue.tags);
      } else {
        // couldn't get suggestion -> hide the suggestion box
        setSuggestions([]);
        setErrorMessage(result.returnValue);
      }
      setTimeout(() => setIsLoading(false), 500);
    }
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
        placeholder="Enter tag"
        autoComplete="off"
        value={tagInput}
        onChangeText={onChangeText}
        withValidation={!showSuggestions}
        validate={[(value) => false]} // alway show error message (otherwise space left for validation does jumps)
        validationMessage={[errorMessage.valueOf()]}
        maxLength={60}
        trailingAccessory={
          // add tag icon
          <ThemedIcon
            name="add"
            colorName={addTagEnabled ? "primary" : "disabled"}
            onPress={() => {
              if (addTagEnabled) {
                onAddTag(tagInput.trimStart().trimEnd());
                onChangeText("");
              }
            }}
            style={{
              marginLeft: percentToDP(-12),
              paddingRight: percentToDP(4),
              paddingTop: percentToDP(1),
            }}
          />
        }
        bottomAccessory={
          // suggestion box
          showSuggestions ? (
            <ThemedView
              colorName="textField"
              style={{
                borderBottomEndRadius: percentToDP(4),
                borderBottomStartRadius: percentToDP(4),
                marginTop: percentToDP(-2.9),
                paddingTop: percentToDP(2),
                paddingHorizontal: percentToDP(2),
                paddingBottom: percentToDP(2),
                marginRight: percentToDP(2.0),
                marginLeft: percentToDP(2.0),
                borderWidth: 0,
                borderTopWidth: 1,
                borderColor: borderColor,
              }}
            >
              {isLoading && (
                <ThemedLoadingIndicator
                  size={"small"}
                  style={{ marginTop: percentToDP(6) }}
                />
              )}
              {!isLoading && (suggsetions.length === 0 || !suggsetions) && (
                <ThemedText
                  textColorName="disabled"
                  backgroundColorName="transparent"
                  style={{
                    marginBottom: percentToDP(2),
                  }}
                >
                  No matching tags
                </ThemedText>
              )}
              {!isLoading &&
                suggsetions.length > 0 &&
                suggsetions.map((elem) => (
                  <ThemedText
                    key={elem}
                    backgroundColorName="transparent"
                    onPress={() => {
                      onChangeText(elem);
                      setShowSuggestions(false);
                    }}
                    style={{
                      marginBottom: percentToDP(2),
                    }}
                  >
                    {elem}
                  </ThemedText>
                ))}
            </ThemedView>
          ) : undefined
        }
        retainValidationSpace
        width={width}
      />
      <TagList
        tags={tags}
        onPressTag={onDeleteTag}
        style={{
          marginLeft: percentToDP(-3),
          width: width ? percentToDP(width) : undefined,
        }}
        showDeleteIcons
      />
    </ThemedView>
  );
}
