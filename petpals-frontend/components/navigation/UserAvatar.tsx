import {Pressable} from "react-native";
import {Avatar} from "react-native-ui-lib";
import {router} from "expo-router";
import {useAuth} from "@/hooks/useAuth";
import {useWindowDimension} from "@/hooks/useWindowDimension";

export default function UserAvatar(props: {
    size: number;
    userId: string;
    doLink: boolean;
}) {
    const {userId} = useAuth();
    const percentToDP = useWindowDimension("shorter");

    return (
        <Pressable
            onPress={() =>
                props.doLink
                    ? router.push(
                        userId === props.userId
                            ? "/user/me"
                            : `/user/${props.userId}`
                    )
                    : {}
            }
        >
            <Avatar
                size={percentToDP(props.size)}
                source={{
                    uri: "https://external-preview.redd.it/PzM9Myb5uugh3qrxvb1F0nVTsdXJKRl0NB88MuAPwZA.jpg?auto=webp&s=6627165dbd61ab8a8d7fc026b5ce9199c593fe93",
                }}
            />
        </Pressable>
    );
}
