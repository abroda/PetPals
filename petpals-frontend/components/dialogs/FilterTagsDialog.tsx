import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import HorizontalView from "../basic/containers/HorizontalView";
import { router } from "expo-router";
import ThemedDialog from "./ThemedDialog";
import validators from "react-native-ui-lib/src/components/textField/validators";
import { useAuth } from "@/hooks/useAuth";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { KeyboardAwareScrollView, TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/WalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { Tag } from "../display/Tag";
import TagList from "../lists/TagList";

export default function FilterTagsDialog({
  onDismiss = () => {},
  onSubmit = (tags: GroupWalkTag[]) => {},
  emailFilled = "",
  filter = [] as GroupWalkTag[],
}) {
  const [tags, setTags] = useState(filter);
  const [tagInput, setTagInput] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const percentToDP = useWindowDimension("shorter");

  const tagInputRef = useRef<TextFieldRef>(null);

  const asyncAbortController = useRef<AbortController | undefined>(undefined);
  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  function validate() {
    return tagInputRef.current?.validate();
  }

  async function addTag() {
    if (validate()) {
      setTags([...tags, tagInput]);
      setTagInput("");
    }
  }

  async function submit() {
    setValidationMessage("");
    onSubmit(tags);
    onDismiss();
  }

  return (
    <ThemedDialog onDismiss={onDismiss}>
      <KeyboardAwareScrollView
        style={{
          paddingHorizontal: percentToDP(3),
          paddingTop: percentToDP(1),
          paddingBottom: percentToDP(3),
          alignContent: "center",
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          style={{ marginBottom: percentToDP(4) }}
        >
          Filter tags
        </ThemedText>

        {validationMessage && (
          <ThemedText
            textStyleOptions={{ size: "small" }}
            textColorName="alarm"
            style={{ marginBottom: percentToDP(3), marginLeft: percentToDP(1) }}
          >
            {validationMessage}
          </ThemedText>
        )}
        <ThemedTextField
          ref={tagInputRef}
          label="Enter tag"
          autoComplete="off"
          value={tagInput}
          onChangeText={(newText: string) =>
            setTagInput(newText.toLocaleLowerCase())
          }
          autoFocus
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
          width={76}
          trailingAccessory={
            <ThemedIcon
              name="add"
              colorName="primary"
              onPress={addTag}
              style={{
                marginLeft: percentToDP(-12),
                paddingRight: percentToDP(4),
                paddingTop: percentToDP(1),
              }}
            />
          }
        />

        <TagList
          tags={tags}
          onPressTag={(tag) => {
            setTags(tags.filter((e) => e !== tag));
          }}
        />
        <ThemedButton
          label="Save"
          shape="half"
          textColorName="textOnPrimary"
          style={{
            marginTop: percentToDP(3),
            marginBottom: percentToDP(2),
            alignSelf: "center",
          }}
          onPress={submit}
        />
      </KeyboardAwareScrollView>
    </ThemedDialog>
  );
}
