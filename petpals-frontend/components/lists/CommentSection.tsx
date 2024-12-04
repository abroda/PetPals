import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { FlatList } from "react-native-gesture-handler";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import Comment from "../display/Comment";
import { CommentContent } from "@/context/GroupWalksContext";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { useCallback, useRef, useState } from "react";
import { TextFieldRef } from "react-native-ui-lib";
import { ThemedTextField } from "../inputs/ThemedTextField";
import ThemedLoadingIndicator from "../decorations/animated/ThemedLoadingIndicator";

export default function CommentSection({
  addComment,
  commentsData,
}: {
  addComment?: (
    content: string
  ) => Promise<{ success: boolean; returnValue: any }>;
  commentsData: CommentContent[];
}) {
  const [commentInput, setCommentInput] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const commentInputRef = useRef<TextFieldRef>(null);
  const percentToDP = useWindowDimension("shorter");

  const submit = useCallback(() => {
    setIsSending(true);
    setErrorMessage(" ");
    const content = commentInput.trimStart().trimEnd();
    addComment!(content).then((result) => {
      if (result.success) {
        setCommentInput("");
      } else {
        setErrorMessage(result.returnValue);
      }

      setIsSending(false);
    });
  }, []);

  return (
    <ThemedView
      colorName="transparent"
      style={{
        borderRadius: percentToDP(10),
        paddingVertical: 0,
        paddingHorizontal: 0,
        marginBottom: percentToDP(20),
      }}
    >
      <ThemedText
        textStyleOptions={{ weight: "semibold" }}
        backgroundColorName="transparent"
        style={{
          paddingBottom: percentToDP(addComment ? 2 : 4),
        }}
      >
        Comments
      </ThemedText>
      {addComment && (
        <ThemedTextField
          ref={commentInputRef}
          placeholder="Add comment"
          inputMode="text"
          value={commentInput}
          onChangeText={(newText: string) => {
            setCommentInput(newText);
            setIsInputValid(newText.trimStart().trimEnd().length > 0);
            setErrorMessage(" ");
          }}
          editable={!isSending}
          withValidation
          validate={[(value) => false]}
          validationMessage={[errorMessage]}
          maxLength={300}
          multiline
          trailingAccessory={
            isSending ? (
              <ThemedLoadingIndicator
                size={"small"}
                style={{
                  marginLeft: percentToDP(-9.5),
                  paddingRight: percentToDP(5),
                  marginBottom: percentToDP(-8.5),
                }}
              />
            ) : (
              <ThemedIcon
                name="send"
                size={20}
                colorName={isInputValid ? "primary" : "disabled"}
                onPress={isInputValid && !isSending ? submit : undefined}
                style={{
                  marginLeft: percentToDP(-8.5),
                  paddingRight: percentToDP(4),
                  paddingTop: percentToDP(1.5),
                }}
              />
            )
          }
        />
      )}
      {commentsData.length == 0 && (
        <ThemedText
          textColorName={"disabled"}
          style={{ paddingLeft: percentToDP(1.5) }}
        >
          No comments yet
        </ThemedText>
      )}
      <FlatList
        style={{ marginTop: percentToDP(2) }}
        scrollEnabled={false}
        data={commentsData}
        renderItem={(rowData) => (
          <Comment
            commentId={rowData.item?.id}
            comment={rowData.item}
          />
        )}
      />
    </ThemedView>
  );
}
