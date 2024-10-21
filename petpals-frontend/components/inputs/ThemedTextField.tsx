import { forwardRef, useEffect } from "react";
import { TextField, TextFieldProps, TextFieldRef } from "react-native-ui-lib";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { TextStyleName, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedView } from "../basic/containers/ThemedView";
import { Validator } from "react-native-ui-lib/src/components/textField/types";
import { Dimensions } from "react-native";

export type ThemedTextFieldProps = TextFieldProps & {
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

export const ForwardedRefTextField = forwardRef<TextFieldRef, TextFieldProps>(
  (props, ref) => {
    return (
      <TextField
        {...props}
        ref={ref}
      />
    );
  }
);

export const ThemedTextField = forwardRef<TextFieldRef, ThemedTextFieldProps>(
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
      <ThemedView style={{ marginBottom: "2%" }}>
        <ForwardedRefTextField
          label={label}
          labelColor={textColor}
          labelStyle={useTextStyle(textStyleName)}
          style={[
            {
              color: textColor,
              backgroundColor: backgroundColor,
              borderRadius: Dimensions.get("window").width * 0.4,
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
          ref={ref}
        />
      </ThemedView>
    );
  }
);
