import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedTextField } from "../inputs/ThemedTextField";

import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/WalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import TagList from "../lists/TagList";
import { ThemedView, ThemedViewProps } from "../basic/containers/ThemedView";
import { useWalks } from "@/hooks/useWalks";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { TouchableWithoutFeedback, View } from "react-native";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
export default function TagListInput({
  onAddTag = (tag: GroupWalkTag) => {},
  onDeleteTag = (tag: GroupWalkTag) => {},
  tags = [] as GroupWalkTag[],
}) {
  const [tagInput, setTagInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [errorMessage, setErrorMessage] = useState(" ");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggsetions, setSuggestions] = useState([] as string[]);
  const { isProcessing } = useWalks();
  const tagInputRef = useRef<TextFieldRef>(null);

  const percentToDP = useWindowDimension("shorter");

  const borderColor = useThemeColor("primary");

  const onChangeText = async (newText: string) => {
    let content = newText.toLocaleLowerCase();
    setTagInput(content);

    if (content.length < 3) {
      setIsInputValid(false);
      setErrorMessage(" ");
      setShowSuggestions(false);
    } else if (content.match(tagRegex)) {
      setIsInputValid(true);
      setErrorMessage(" ");
      let newSuggestions =
        content.length < 13
          ? [content + "a", content + "b", content + "c"]
          : [];
      setSuggestions(newSuggestions);
      setShowSuggestions(newSuggestions.length > 0);
    } else {
      setIsInputValid(false);
      setErrorMessage("Tag should not use any special characters");
      setShowSuggestions(false);
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
        placeholder="Add tag"
        autoComplete="off"
        inputMode="text"
        value={tagInput}
        onBlur={() => setShowSuggestions(false)}
        onChangeText={onChangeText}
        withValidation={!showSuggestions}
        validate={[(value) => false]}
        validationMessage={[errorMessage.valueOf()]}
        maxLength={60}
        trailingAccessory={
          <ThemedIcon
            name="add"
            colorName={isInputValid ? "primary" : "disabled"}
            onPress={() => {
              if (isInputValid) {
                onAddTag(tagInput.trimStart().trimEnd());
                setTagInput("");
                setShowSuggestions(false);
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
          showSuggestions && suggsetions.length > 0 ? (
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
              {isProcessing && <ThemedLoadingIndicator size={"small"} />}
              {!isProcessing &&
                suggsetions.map((elem) => (
                  <ThemedText
                    backgroundColorName="transparent"
                    onPress={() => {
                      setTagInput(elem);
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
      />

      <TagList
        tags={tags}
        onPressTag={onDeleteTag}
        style={{ marginHorizontal: percentToDP(-2.5) }}
      />
    </ThemedView>
  );
}
