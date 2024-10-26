import React, {forwardRef} from "react";
import {TextField, TextFieldProps, TextFieldRef} from "react-native-ui-lib";
import {ColorName, ThemedColor, useThemeColor} from "@/hooks/theme/useThemeColor";
import {TextStyleName, useTextStyle} from "@/hooks/theme/useTextStyle";
import {Validator} from "react-native-ui-lib/src/components/textField/types";
import {View} from "react-native";
import {ThemedText} from "@/components/basic/ThemedText";
import {useWindowDimension} from "@/hooks/useWindowDimension";

export type ThemedMultilineTextFieldProps = TextFieldProps & {
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

export const ThemedMultilineTextField = forwardRef<TextFieldRef, ThemedMultilineTextFieldProps>(
    ({
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
         width,
         ...rest
     }: ThemedMultilineTextFieldProps, ref) => {

        const textColor = useThemeColor(textColorName, textThemedColor);
        const backgroundColor = useThemeColor(
            backgroundColorName,
            backgroundThemedColor
        );

        const percentToDP = useWindowDimension("shorter");

        return (
            <View>
                <ThemedText style={{paddingLeft: percentToDP(1), marginBottom: 8}}>{label}</ThemedText>
                <View style={{
                    backgroundColor: backgroundColor,
                    padding: 16,
                    paddingHorizontal: percentToDP(5),
                    borderRadius: 30
                }}>
                    <TextField
                        multiline={true}
                        style={[
                            {
                                color: textColor,
                            },
                            useTextStyle(textStyleName),
                        ]}/>
                </View>
            </View>
        )

    }
);