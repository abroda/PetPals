import { Pressable, ViewProps } from "react-native";
import { Avatar, Overlay, View } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { ThemedIcon } from "../decorations/static/ThemedIcon";
import { ThemedText } from "../basic/ThemedText";
import { widthPercentageToDP } from "react-native-responsive-screen";

export default function PetAvatar(props: {
  size: number;
  source?: string; // Make source nullable to handle missing images
  userId: string;
  petId: string;
  petName?: string;
  doLink?: boolean;
  toggleEnabled?: boolean;
  marked?: boolean;
  onPress?: () => void;
  viewProps?: ViewProps;
}) {
  const percentToDP = useWindowDimension("shorter");
  const borderColor = useThemeColor("primary");

  return (
    <View {...props.viewProps}>
      <Pressable
        onPress={() =>
          props.onPress
            ? props.onPress()
            : props.doLink
              ? router.push(`/user/${props.userId}/pet/${props.petId}`)
              : {}
        }
        style={
          props.toggleEnabled
            ? {
                marginRight: percentToDP(0.8),
                padding: props.marked ? percentToDP(0.8) : percentToDP(1.6),
                borderWidth: props.marked ? percentToDP(0.8) : 0,
                borderColor: borderColor,
                borderRadius: percentToDP(props.size),
              }
            : {}
        }
      >
        <Avatar
          size={percentToDP(props.size)}
          source={props.source ? { uri: props.source } : DogPlaceholderImage}
          // Use DogPlaceholderImage directly if props.source is null
          imageStyle={
            props.toggleEnabled
              ? { opacity: props.marked ? 1.0 : 0.65, backgroundColor: "black" }
              : {}
          }
        />
      </Pressable>
      {props.petName && (
        <ThemedText
          textStyleOptions={{ size: "small" }}
          style={{
            textAlign: "center",
            alignSelf: "center",
            marginTop: percentToDP(0.8),
            marginLeft: percentToDP(-0.8),
            maxWidth: widthPercentageToDP(18),
          }}
          numberOfLines={1}
        >
          {props.petName}
        </ThemedText>
      )}
    </View>
  );
}
