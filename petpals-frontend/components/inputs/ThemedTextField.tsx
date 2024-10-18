import { createRef, ElementRef, forwardRef, useRef } from "react";
import { TextField, TextFieldProps, TextFieldRef } from "react-native-ui-lib";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { TextStyleName, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedView } from "../basic/containers/ThemedView";
import { Validator } from "react-native-ui-lib/src/components/textField/types";

export type ThemedTextFieldProps = //TextInputProps & {
  TextFieldProps & {
    textColorName?: ColorName;
    textThemedColor?: ThemedColor;
    backgroundColorName?: ColorName;
    backgroundThemedColor?: ThemedColor;
    textStyleName?: TextStyleName;
    withValidation?: boolean;
    validate?: Validator[];
    validationMessage?: string[];
    isSecret?: boolean;
    label?: string;
  };

export const ThemedTextField = forwardRef<
  ElementRef<typeof TextField>,
  ThemedTextFieldProps
>(
  (
    {
      textColorName = "text",
      textThemedColor = undefined,
      backgroundColorName = "textField",
      backgroundThemedColor = undefined,
      textStyleName = "default",
      withValidation,
      validate,
      validationMessage,
      isSecret,
      label,
      ...rest
    }: ThemedTextFieldProps,
    ref
  ) => {
    const textColor = useThemeColor(textColorName, textThemedColor);
    const backgroundColor = useThemeColor(
      backgroundColorName,
      backgroundThemedColor
    );
    const alarmColor = useThemeColor("alarm");

    return (
      <ThemedView style={{ marginBottom: "3%" }}>
        <TextField
          ref={ref}
          label={label}
          labelColor={textColor}
          labelStyle={useTextStyle(textStyleName)}
          style={[
            {
              color: textColor,
              backgroundColor: backgroundColor,
              borderRadius: 30,
              borderColor: textColor,
              paddingHorizontal: 10,
              paddingVertical: "4%",
              height: "100%",
            },
            useTextStyle(textStyleName),
            rest.style,
          ]}
          secureTextEntry={isSecret}
          validationMessagePosition="bottom"
          enableErrors={withValidation}
          validateOnBlur={withValidation}
          validateOnChange={withValidation}
          validationMessageStyle={[
            { color: alarmColor, marginTop: "2%" },
            useTextStyle("small"),
          ]}
          validate={validate}
          validationMessage={validationMessage}
          {...rest}
        />
        {/* <ThemedText
        textColorName={textColorName}
        textStyleName={textStyleName}
      >
        {label}
      </ThemedText>
      <TextInput
        autoCorrect={rest.autoCorrect ?? false}
        style={[
          {
            color: textColor,
            backgroundColor: backgroundColor,
            borderRadius: 28,
            paddingHorizontal: 10,
            paddingVertical: 8,
            height: "100%",
            marginVertical: "1%",
          },
          useTextStyle(textStyleName),
        ]}
        secureTextEntry={isSecret}
        {...rest}
      /> */}
      </ThemedView>
    );
  }
);
