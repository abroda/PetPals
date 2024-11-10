import { Pressable } from "react-native";
import { Avatar } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { useWindowDimension } from "@/hooks/useWindowDimension";
// @ts-ignore
import DogPlaceholderImage from "@/assets/images/dog_placeholder_theme-color-fair.png";

export default function PetAvatar(props: {
  size: number;
  source: string | null; // Make source nullable to handle missing images
  username: string;
  pet: string;
  doLink: boolean;
}) {
  const { userEmail } = useAuth();
  const percentToDP = useWindowDimension("shorter");

  return (
      <Pressable
          onPress={() =>
              props.doLink
                  ? router.push(`/user/${props.username}/pet/${props.pet}`)
                  : {}
          }
      >
        <Avatar
            size={percentToDP(props.size)}
            source={props.source ? { uri: props.source } : DogPlaceholderImage}
            // Use DogPlaceholderImage directly if props.source is null
        />
      </Pressable>
  );
}
