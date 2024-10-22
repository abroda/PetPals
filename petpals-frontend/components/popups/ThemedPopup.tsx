import { ReactNode } from "react";
import { ThemedView } from "../basic/containers/ThemedView";
import { Dimensions, Modal, ModalProps } from "react-native";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { useWindowDimension } from "@/hooks/useWindowDimension";

export type PopupProps = ModalProps & {
  visible?: boolean;
  outerShape: (children: ReactNode) => typeof ThemedView;
  innerShape: (children: ReactNode) => typeof ThemedView;
  onDismiss?: () => void;
};

const percentToDP = useWindowDimension("shorter");

export default function ThemedPopup({
  visible = true,
  outerShape = (children: ReactNode) => (
    <ThemedView
      style={{
        flex: 1,
        justifyContent: "center",
        alignContent: "center",
        padding: "auto",
        backgroundColor: "#00000088",
        backfaceVisibility: "hidden",
      }}
      children={children}
    />
  ),
  innerShape = (children: ReactNode) => (
    <ThemedView
      style={{
        margin: percentToDP(5),
        padding: percentToDP(4),
        paddingBottom: percentToDP(1),
        borderRadius: percentToDP(10),
      }}
      children={children}
    />
  ),
  onDismiss = () => {},
  ...props
}) {
  return (
    <Modal
      visible={visible}
      animationType={props.animationType ?? "fade"}
      transparent={props.transparent ?? true}
      onRequestClose={props.onRequestClose ?? onDismiss}
      {...props}
    >
      {outerShape(innerShape(props.children))}
    </Modal>
  );
}
