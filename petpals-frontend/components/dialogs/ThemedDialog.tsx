import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
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
  const percentToDP = useWindowDimension("shorter");

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
          backgroundColor: "#000000aa",
          backfaceVisibility: "hidden",
        }}
      >
        <ThemedView
          style={{
            margin: percentToDP(5),
            padding: percentToDP(4),
            paddingBottom: percentToDP(1),
            borderRadius: percentToDP(10),
          }}
        >
          {props.children}
        </ThemedView>
      </ThemedView>
    </Modal>
  );
}
