// import { CheckboxProps, TextField, TextFieldProps } from "react-native-ui-lib";
// import {
//   ColorName,
//   ThemedColor,
//   useThemeColor,
// } from "@/hooks/theme/useThemeColor";
// import { TextStyleName, useTextStyle } from "@/hooks/theme/useTextStyle";
// import { ThemedView } from "../basic/containers/ThemedView";

// export type ThemedCheckboxProps = CheckboxProps & {
//   textColorName?: ColorName;
//   textThemedColor?: ThemedColor;
//   colorName?: ColorName;
//   themedColor?: ThemedColor;
//   textStyleName?: TextStyleName;
// };

// export const ThemedTextField =
//   (
//     {
//       textColorName = "text",
//       textThemedColor = undefined,
//       colorName = "accent",
//       themedColor = undefined,
//       textStyleName = "small",
//       ...rest
//     }: ThemedCheckboxProps) => {
//     const textColor = useThemeColor(textColorName, textThemedColor);
//     const color = useThemeColor(
//       colorName,
//       themedColor
//     );
//     const alarmColor = useThemeColor("alarm");

//     return (
//       <ThemedView style={{ marginBottom: "3%" }}>
//         <TextField
//           labelColor={textColor}
//           labelStyle={useTextStyle(textStyleName)}
//           style={[
//             {
//               color: textColor,
//               backgroundColor: backgroundColor,
//               borderRadius: 28,
//               borderColor: textColor,
//               paddingHorizontal: 10,
//               paddingVertical: 8,
//             },
//             style,
//           ]}
//           secureTextEntry={isSecret}
//           validationMessagePosition="bottom"
//           enableErrors={withValidation}
//           validateOnBlur={withValidation}
//           validateOnChange={withValidation}
//           validationMessageStyle={{ color: alarmColor }}
//           {...rest}
//         />
//       </ThemedView>
//     );
// }
