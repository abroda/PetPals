import { useEffect, useRef, useState } from "react";
import { ThemedText } from "../basic/ThemedText";
import { ThemedButton } from "../inputs/ThemedButton";
import { ThemedTextField } from "../inputs/ThemedTextField";
import ThemedDialog from "./ThemedDialog";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { KeyboardAwareScrollView, TextFieldRef } from "react-native-ui-lib";
import { GroupWalkTag, tagRegex } from "@/context/GroupWalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import TagList from "../lists/TagList";
import TagListInput from "../inputs/TagListInput";

export default function FilterResultsDialog({
  onDismiss = () => {},
  onSubmit = (tags: GroupWalkTag[]) => {},
  filter = [] as GroupWalkTag[],
}) {
  const [tags, setTags] = useState(filter);
  // const [tagInput, setTagInput] = useState("");
  // const [validationMessage, setValidationMessage] = useState("");

  const tagInputRef = useRef<TextFieldRef>(null);
  const asyncAbortController = useRef<AbortController | undefined>(undefined);

  const percentToDP = useWindowDimension("shorter");

  useEffect(() => {
    asyncAbortController.current = new AbortController();
    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const submit = () => {
    //setValidationMessage("");
    onSubmit(tags);
    onDismiss();
  };

  return (
    <ThemedDialog onDismiss={submit}>
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
          Filter results
        </ThemedText>

        <TagListInput
          onAddTag={(tag) => setTags([...tags, tag])}
          onDeleteTag={(tag) => setTags(tags.filter((t) => t !== tag))}
          tags={tags}
          width={75.5}
        />

        <ThemedButton
          label="Close"
          shape="half"
          textColorName="textOnPrimary"
          style={{
            marginTop: percentToDP(3),
            marginBottom: percentToDP(2.5),
            alignSelf: "center",
          }}
          onPress={submit}
        />
      </KeyboardAwareScrollView>
    </ThemedDialog>
  );
}
