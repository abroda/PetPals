import { Pressable, StyleSheet } from "react-native";
import {
  ColorName,
  ThemedColor,
  useThemeColor,
} from "@/hooks/theme/useThemeColor";
import { Button, ButtonProps, ButtonSize, Card } from "react-native-ui-lib";
import { TextStyleOptions, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Ionicons } from "@expo/vector-icons";
import { ComponentProps } from "react";
import { router } from "expo-router";
import { ThemedText } from "../basic/ThemedText";
import { GroupWalkTag } from "@/context/WalksContext";

export type TagProps = ButtonProps & {
  backgroundColorName?: ColorName;
  backgroundThemedColor?: ThemedColor;
  textColorName?: ColorName;
  textThemedColor?: ThemedColor;
  textStyleOptions?: TextStyleOptions;
  doLink?: boolean;
  doDismissOnLink?: boolean;
};

export const Tag = ({
  style,
  label,
  onPress = (tag: GroupWalkTag) => {
    router.push("/walk/event/find");
  },
  backgroundColorName = "secondary",
  backgroundThemedColor,
  textColorName = "text",
  textThemedColor,
  textStyleOptions = { size: "tiny", weight: "semibold" },
  ...rest
}: TagProps) => {
  const backgroundColor = useThemeColor(
    backgroundColorName,
    backgroundThemedColor
  );
  const textColor = useThemeColor(textColorName, textThemedColor);
  const textStyle = useTextStyle(textStyleOptions);
  const percentToDP = useWindowDimension("shorter");

  return (
    <Card
      onPress={onPress}
      color={backgroundColor}
      style={[
        {
          backgroundColor: backgroundColor,
          borderRadius: percentToDP(10),
          paddingVertical: percentToDP(1),
          paddingLeft: percentToDP(2.25),
          paddingRight: percentToDP(3),
          maxWidth: percentToDP(78),
          marginBottom: percentToDP(1.7),
          marginRight: percentToDP(1),
        },
      ]}
      enableShadow={false}
      {...rest}
    >
      <ThemedText
        textStyleOptions={{ size: "small" }}
        backgroundColorName="transparent"
        textColorName={textColorName}
        numberOfLines={1}
      >
        #{label?.toLocaleLowerCase()}
      </ThemedText>
    </Card>
  );
};
