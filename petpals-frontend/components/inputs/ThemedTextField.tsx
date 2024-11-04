import { forwardRef, useEffect } from "react";
import { TextField, TextFieldProps, TextFieldRef } from "react-native-ui-lib";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { TextStyleOptions, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedView } from "../basic/containers/ThemedView";
import { Validator } from "react-native-ui-lib/src/components/textField/types";
import { Dimensions } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export type ThemedTextFieldProps = TextFieldProps & {
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textStyleOptions?: TextStyleOptions;
  withValidation?: boolean;
  validate?: Validator[];
  validationMessage?: string[];
  isSecret?: boolean;
  label?: string;
  width?: number;
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
      textStyleOptions = {},
      withValidation,
      validate,
      validationMessage,
      isSecret,
      label,
      width,
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
    const percentToDP = useWindowDimension("shorter");

    return (
      <ThemedView style={{ marginBottom: percentToDP(2), alignSelf: "center" }}>
        <ForwardedRefTextField
          label={label}
          labelColor={textColor}
          labelStyle={[
            useTextStyle(textStyleOptions),
            { paddingLeft: percentToDP(1) },
          ]}
          style={[
            {
              color: textColor,
              backgroundColor: backgroundColor,
              height: percentToDP(16),
              width: percentToDP(width ?? 89),
              borderRadius: percentToDP(10),
              borderColor: textColor,
              paddingHorizontal: percentToDP(4),
              marginTop: percentToDP(2),
            },
            useTextStyle(textStyleOptions),
            rest.style,
          ]}
          secureTextEntry={isSecret}
          validationMessagePosition="bottom"
          enableErrors={withValidation}
          validateOnBlur={withValidation}
          validateOnChange={withValidation}
          validationMessageStyle={[
            {
              color: alarmColor,
              marginTop: percentToDP(1),
              marginLeft: percentToDP(1),
            },
            useTextStyle({ size: "small" }),
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
