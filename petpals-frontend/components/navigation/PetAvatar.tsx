import { Pressable } from "react-native";
import { Avatar } from "react-native-ui-lib";
import { router } from "expo-router";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView, ThemedViewProps } from "../basic/containers/ThemedView";

export default function PetAvatar(props: {
  size: number;
  username: string;
  pet: string;
  doLink: boolean;
}) {
  const { userEmail } = useAuth();

  return (
    <Pressable
      onPress={() =>
        props.doLink
          ? router.push(`/user/${props.username}/pet/${props.pet}`)
          : {}
      }
    >
      <Avatar
        size={props.size}
        source={{
          uri: "http://images2.fanpop.com/image/photos/13800000/Cute-Dogs-dogs-13883179-2560-1931.jpg",
        }}
      />
    </Pressable>
  );
}
