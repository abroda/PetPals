import { ReactNode, useEffect, useState } from "react";
import { ThemedView } from "../basic/containers/ThemedView";
import { Dimensions, Modal, ModalProps } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { ToastProps } from "react-native-ui-lib";
import Toast from "react-native-ui-lib/src/incubator/toast";
import { useTheme } from "react-native-paper";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { TextStyleOptions, useTextStyle } from "@/hooks/theme/useTextStyle";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { ImageSourceType } from "react-native-ui-lib/src/components/image";
import { Ionicons } from "@expo/vector-icons";

export type PopupProps = ModalProps & {
  visible?: boolean;
  outerShape: (children: ReactNode) => typeof ThemedView;
  innerShape: (children: ReactNode) => typeof ThemedView;
  onDismiss?: () => void;
};

const percentToDP = useWindowDimension("shorter");

const colorPresets = {
  failure: useThemeColor("alarm"),
  general: useThemeColor("link"),
  success: useThemeColor("primary"),
  offline: useThemeColor("disabled"),
};

export default function ThemedToast(
  props: ToastProps & {
    aboveTabBar?: boolean;
    textStyleOptions?: TextStyleOptions;
  }
) {
  const [visible, setVisible] = useState(props.visible ?? true);
  const backgroundColor = useThemeColor("textField");
  const textColor = useThemeColor("text");
  const iconColor = props.preset
    ? colorPresets[props.preset]
    : useThemeColor("primary");
  const textStyle = props.textStyleOptions
    ? useTextStyle(props.textStyleOptions)
    : {};

  useEffect(() => {
    if (!visible) {
      props.onDismiss?.(); // Ensure cleanup is triggered
    }
  }, [visible]);

  return (
    <Toast
      visible={visible}
      position={props.position ?? "bottom"}
      autoDismiss={props.autoDismiss ?? 5000}
      swipeable
      style={[
        {
          marginBottom: heightPercentageToDP(props.aboveTabBar ? 10 : 5),
          backgroundColor: backgroundColor,
          pointerEvents: visible ? "auto" : "none",
        },
        props.style,
      ]}
      messageStyle={[textStyle, { color: textColor }, props.messageStyle]}
      iconColor={props.iconColor ?? iconColor}
      preset={props.preset ?? "success"}
      onDismiss={() => {
        setVisible(false);
        props.onDismiss?.();
      }}
      {...props}
    />
  );
}
