import { ThemedText } from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { usePathname } from "expo-router";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { useContext, useEffect, useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Alert,
  Pressable,
  Button,
} from "react-native";
import { UserContext } from "@/context/UserContext";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import * as ImagePicker from "expo-image-picker";
import { tls } from "node-forge";
import { email } from "@sideway/address";
import { useUser } from "@/hooks/useUser";

export default function EditUserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  // Colours
  const darkGreen = "#0A2421";
  const lightGreen = "#1C302A";
  const accentGreen = "#B4D779";
  const accentTeal = "#52B8A3";
  const cream = "#FAF7EA";

  // @ts-ignore
  const {
    getUserById,
    userProfile,
    updateUser,
    changeUserAvatar,
    isProcessing,
    responseMessage,
  } = useUser();

  // States
  const [usernameText, setUsernameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [image, setImage] = useState<string | null>(null);

  useEffect(() => {
    getUserById(userProfile?.id ?? "");
  }, []);

  useEffect(() => {
    if (userProfile) {
      setUsernameText(userProfile.username);
      setDescriptionText(userProfile.description);
      setEmailText(userProfile.email);
    }
  }, [userProfile]);

  const saveProfile = async () => {
    // Set displayName (username) to "No Username" if empty
    const displayNameToSave = usernameText.trim() || "No Username";
    const descriptionToSave = descriptionText.trim() || "No Description";

    // Prepare data to update
    const updatedData = {
      displayName: displayNameToSave, // Ensure displayName is sent as expected by the backend
      description: descriptionToSave,
      visibility: userProfile?.visibility, // Include visibility if needed
    };

    console.log("Sending updated user data:", updatedData);

    // Update user data
    const updateSuccessful = await updateUser(
      userProfile?.id ?? "",
      updatedData
    );

    if (updateSuccessful) {
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } else {
      Alert.alert("Update Failed", "There was an error updating your profile.");
    }
  };

  const handleAvatarChange = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.canceled) {
      const file = {
        uri: result.assets[0].uri,
        name: "profile-picture.jpg",
        type: "image/jpeg",
      } as unknown as File;

      await changeUserAvatar(userProfile?.id ?? "", file);
    }
  };

  const handleChangePassword = () => {};

  const handleChangeEmail = () => {};

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView
        style={{
          flex: 1,
        }}
      >
        <HorizontalView
          justifyOption="flex-end"
          style={{
            flex: 3,
            width: widthPercentageToDP(100),
            paddingHorizontal: widthPercentageToDP(5),
            paddingTop: heightPercentToPD(5),
            backgroundColor: lightGreen,
          }}
        >
          <Pressable
            onPress={saveProfile}
            style={{
              position: "absolute",
              top: heightPercentToPD(1),
              right: heightPercentToPD(1),
              marginRight: percentToDP(5),
              marginTop: percentToDP(5),
              zIndex: 2,
            }}
          >
            <ThemedIcon
              name="checkmark-outline"
              size={percentToDP(10)}
              style={{
                backgroundColor: darkGreen,
                borderRadius: percentToDP(100),
                padding: percentToDP(3),
              }}
            />
          </Pressable>
        </HorizontalView>

        <HorizontalView
          justifyOption="flex-start"
          style={{
            flex: 7,
            flexDirection: "column",
            width: widthPercentageToDP(100),
            paddingHorizontal: widthPercentageToDP(5),
            paddingVertical: heightPercentToPD(0),
            backgroundColor: darkGreen,
          }}
        >
          {/* Avatar picture */}
          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: heightPercentToPD(-20),
            }}
          >
            <UserAvatar
              size={heightPercentToPD(7)}
              userId={userProfile?.id ?? ""}
              imageUrl={userProfile?.imageUrl || null}
              doLink={false}
            />
          </View>

          {/* Container for TextInputs and buttons */}
          <View
            style={{
              flex: 1,
              backgroundColor: darkGreen,
              width: widthPercentageToDP(80),
              paddingVertical: heightPercentToPD(1),
              // alignContent: 'space-between'
            }}
          >
            {/* Username */}
            <ThemedText
              style={{
                backgroundColor: "none",
                color: accentGreen,
                fontSize: 16,
                fontWeight: "light",
                marginBottom: heightPercentToPD(-1),
                marginLeft: heightPercentToPD(3),
                zIndex: 2,
              }}
            >
              Username
            </ThemedText>
            <TextInput
              maxLength={16}
              style={{
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(3),
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: lightGreen,
                color: cream,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
              onChangeText={setUsernameText}
              value={usernameText}
            />

            {/* Description */}
            <ThemedText
              style={{
                backgroundColor: "none",
                color: accentGreen,
                fontSize: 16,
                fontWeight: "light",
                marginBottom: heightPercentToPD(-1),
                marginLeft: heightPercentToPD(3),
                zIndex: 2,
              }}
            >
              Description
            </ThemedText>
            <TextInput
              maxLength={48}
              style={{
                height: heightPercentToPD(15),
                justifyContent: "flex-start",
                alignContent: "flex-start",
                alignItems: "flex-start",
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(3),
                textAlignVertical: "top",
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: lightGreen,
                color: cream,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
              onChangeText={setDescriptionText}
              value={descriptionText}
            />

            {/* E-mail address */}
            <ThemedText
              style={{
                backgroundColor: "none",
                color: accentGreen,
                fontSize: 16,
                fontWeight: "light",
                marginBottom: heightPercentToPD(-1),
                marginLeft: heightPercentToPD(3),
                zIndex: 2,
              }}
            >
              E-mail Address
            </ThemedText>
            <TextInput
              maxLength={32}
              editable={false}
              style={{
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(3),
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: lightGreen,
                color: cream,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
              onChangeText={setEmailText}
              value={emailText}
            />
            <ThemedButton
              label="Change e-mail"
              onPress={() => handleChangeEmail()}
              color={accentTeal}
              style={{
                width: widthPercentageToDP(80),
                backgroundColor: "transparent",
                marginTop: heightPercentToPD(2),
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(2),
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: accentTeal,
              }}
            />

            <ThemedButton
              label="Change avatar"
              onPress={handleAvatarChange}
              color={accentTeal}
              style={{
                width: widthPercentageToDP(80),
                backgroundColor: "transparent",
                marginTop: heightPercentToPD(2),
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(2),
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: accentTeal,
              }}
            />
            <ThemedButton
              label="Change password"
              onPress={() => handleChangePassword()}
              color={accentGreen}
              style={{
                width: widthPercentageToDP(80),
                backgroundColor: "transparent",
                marginTop: heightPercentToPD(2),
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(2),
                borderRadius: percentToDP(6),
                borderWidth: 1,
                borderColor: accentGreen,
              }}
            />
          </View>
        </HorizontalView>
      </ThemedView>
    </SafeAreaView>
  );
}
