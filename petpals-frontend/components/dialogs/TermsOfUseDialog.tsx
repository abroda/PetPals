import { useState } from "react";
import { Dialog, PanningProvider, TouchableOpacity } from "react-native-ui-lib";
import { ThemedView } from "../basic/containers/ThemedView";
import { ThemedText } from "../basic/ThemedText";
import { ThemedScrollView } from "../basic/containers/ThemedScrollView";

export default function TermsOfUseDialog({
  visible = false,
  onDismiss = () => {},
}) {
  return (
    <Dialog
      visible={visible}
      onDismiss={() => {}}
      panDirection={PanningProvider.Directions.DOWN}
    >
      <ThemedView style={{ padding: "6%", borderRadius: 30 }}>
        <ThemedText
          textStyleName="header"
          style={{ marginBottom: "5%" }}
        >
          Terms of Use
        </ThemedText>
        <ThemedScrollView>
          <ThemedText>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean mi
            ex, efficitur iaculis porta a, tincidunt eget velit. Lorem ipsum
            dolor sit amet, consectetur adipiscing elit. Etiam congue, eros et
            rhoncus pellentesque, lacus dolor vestibulum ligula, et varius eros
            nisl in sapien. Praesent a sem dui. Nulla congue, dolor et congue
            consectetur, magna nunc lacinia dui, quis tincidunt nisl diam at
            dui. Aliquam pharetra, diam id aliquam eleifend, enim velit
            venenatis est, ac lobortis libero quam ut libero. Praesent rutrum
            nisl nec imperdiet condimentum. Suspendisse a accumsan libero. Nulla
            quis tincidunt mauris, at semper magna. Morbi sit amet nibh elit.
            Sed suscipit ligula diam, eu ...
          </ThemedText>
        </ThemedScrollView>
      </ThemedView>
    </Dialog>
  );
}
