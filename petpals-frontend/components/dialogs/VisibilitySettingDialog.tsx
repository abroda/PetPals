import ThemedDialog from "@/components/dialogs/ThemedDialog";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {useWindowDimension} from "@/hooks/theme/useWindowDimension";
import {ThemedText} from "@/components/basic/ThemedText";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import React, {useEffect, useState} from "react";
import {Alert, Pressable} from "react-native";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {useAuth} from "@/hooks/useAuth";
import {useUser} from "@/hooks/useUser";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";

export default function VisibilitySettingDialog({
                                            onDismiss,
                                        }: {
    onDismiss: () => void;
}) {
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");
    const {userProfile, updateUser} = useUser()
    const {userId} = useAuth()
    const colorScheme = useColorScheme();
    // @ts-ignore
    const themeColors = ThemeColors[colorScheme];
    const [currentVisibility, setCurrentVisibility] = useState(userProfile?.visibility);

    const setVisibility = () => {
        if (userId){
            const updatedData = {
                displayName: userProfile?.username,
                description: userProfile?.description,
                visibility: currentVisibility === "FRIENDS ONLY" ? "FRIENDS_ONLY" : currentVisibility,
            };
            updateUser(userId, updatedData).then(res => onDismiss())
        } else {
            Alert.alert("Update Failed", "There was an error updating your visibility.");
        }
    }

    return (
        <ThemedDialog onDismiss={onDismiss}>
            <ThemedView
                style={{
                    padding: percentToDP(3),
                    paddingTop: percentToDP(1),
                    borderRadius: percentToDP(10),
                    width: percentToDP(83),
                    alignSelf: "center",
                }}
            >
                <ThemedText
                    textStyleOptions={{ size: "big", weight: "bold" }}
                    style={{ marginBottom: percentToDP(3.5) }}
                >
                    Set Visibility
                </ThemedText>
                {['PRIVATE', 'PUBLIC', 'FRIENDS ONLY'].map((option) => (
                    <Pressable
                        key={option}
                        onPress={() => setCurrentVisibility(option)}
                    >
                        <HorizontalView style={{alignItems:"center", justifyContent: "flex-start", gap: 5, marginBottom: 10}}>
                            <ThemedIcon name={(currentVisibility === "FRIENDS_ONLY" ? "FRIENDS ONLY" : currentVisibility) == option ? "checkbox" : "square-outline"}/>
                            <ThemedText>{option}</ThemedText>
                        </HorizontalView>
                    </Pressable>
                ))}

                <HorizontalView>
                    <ThemedButton
                        label="Confirm"
                        textColorName="textOnPrimary"
                        style={{
                            width: percentToDP(30),
                            alignSelf: "center",
                            marginTop: percentToDP(3)
                        }}
                        onPress={setVisibility}
                    />
                    <ThemedButton
                        label="Cancel"
                        textColorName="accent"
                        style={{
                            width: percentToDP(30),
                            alignSelf: "center",
                            marginTop: percentToDP(3),
                            backgroundColor: themeColors.transparent,
                            borderColor: themeColors.accent,
                            borderWidth: 3
                        }}
                        onPress={onDismiss}
                    />

                </HorizontalView>

            </ThemedView>
        </ThemedDialog>
    )
}