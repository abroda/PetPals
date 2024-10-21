import { ThemedView } from "../basic/containers/ThemedView";
import { Dimensions, Modal, ModalProps } from "react-native";

export type DialogProps = ModalProps & {
  visible?: boolean;
  onDismiss?: () => void;
};

export default function ThemedDialog({
  visible = true,
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
      <ThemedView
        style={{
          flex: 1,
          justifyContent: "center",
          alignContent: "center",
          padding: "auto",
          backgroundColor: "#00000088",
          backfaceVisibility: "hidden",
        }}
      >
        <ThemedView
          style={{
            margin: "5%",
            padding: "4%",
            paddingBottom: "1%",
            borderRadius: 30,
          }}
        >
          {props.children}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
