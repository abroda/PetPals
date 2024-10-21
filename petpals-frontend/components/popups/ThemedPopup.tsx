import { ReactNode } from "react";
import { ThemedView } from "../basic/containers/ThemedView";
import { Dimensions, Modal, ModalProps } from "react-native";

export type PopupProps = ModalProps & {
  visible?: boolean;
  outerShape: (children: ReactNode) => typeof ThemedView;
  innerShape: (children: ReactNode) => typeof ThemedView;
  onDismiss?: () => void;
};

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
        margin: "5%",
        padding: "4%",
        paddingBottom: "1%",
        borderRadius: 30,
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
