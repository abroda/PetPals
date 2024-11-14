import { forwardRef, useEffect } from "react";
import {
  DateTimePicker,
  DateTimePickerProps,
  TextField,
  TextFieldProps,
  TextFieldRef,
} from "react-native-ui-lib";
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
import HorizontalView from "../basic/containers/HorizontalView";
import { useTheme } from "@react-navigation/native";
import { ThemedText } from "../basic/ThemedText";

export type ThemedTextFieldProps = DateTimePickerProps & {
  textColorName?: ColorName;
  backgroundColorName?: ColorName;
  textStyleOptions?: TextStyleOptions;
};

export const ThemedDatetimePicker = ({
  textColorName = "text",
  backgroundColorName = "background",
  textStyleOptions = {},
  ...rest
}: ThemedTextFieldProps) => {
  const now = new Date();
  const textColor = useThemeColor(textColorName);
  const textStyle = useTextStyle(textStyleOptions);
  const percentToDP = useWindowDimension("shorter");

  return (
    <HorizontalView colorName={backgroundColorName}>
      <DateTimePicker
        color={textColor}
        labelColor={textColor}
        placeholderTextColor={textColor}
        labelStyle={textStyle}
        fieldStyle={textStyle}
        label="Date"
        value={rest.value ?? now}
        mode={"date"}
        minimumDate={now}
      />
      <DateTimePicker
        color={textColor}
        labelColor={textColor}
        placeholderTextColor={textColor}
        labelStyle={textStyle}
        fieldStyle={textStyle}
        label="Hour"
        value={rest.value ?? now}
        mode={"time"}
      />
    </HorizontalView>
  );
};
