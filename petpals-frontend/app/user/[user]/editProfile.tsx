import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useNavigation, usePathname } from "expo-router";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import React, {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
} from "react";
import { SafeAreaView, View, TextInput, Alert, Pressable } from "react-native";
import { UserContext } from "@/context/UserContext";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import * as ImagePicker from "expo-image-picker";
import { useColorScheme } from "@/hooks/theme/useColorScheme";
import { ThemeColors } from "@/constants/theme/Colors";
import {useUser} from "@/hooks/useUser";
import {useAuth} from "@/hooks/useAuth";

export default function EditUserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const {userId} = useAuth();

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const navigation = useNavigation();

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  // Context and States
  const { getUserById, userProfile, updateUser, changeUserAvatar } = useUser();

  const [usernameText, setUsernameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");

  useEffect(() => {
    if(userId){
      console.log("[EditProfile] Getting user data: ", userId);
      getUserById(userId); // Fetch user data
    }
  }, []);

  useEffect(() => {
    if (userProfile) {
      setUsernameText(userProfile.username);
      setDescriptionText(userProfile.description);
      setEmailText(userProfile.email);
    }
  }, [userProfile]);

  if (!userProfile) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText>Loading user profile...</ThemedText>
      </SafeAreaView>
    );
  }

  // Memoized Save Function
  const saveProfile = useCallback(async () => {
    const displayNameToSave = usernameText.trim() || "No Username";
    const descriptionToSave = descriptionText.trim() || "No Description";

    const updatedData = {
      displayName: displayNameToSave,
      description: descriptionToSave,
      visibility: userProfile.visibility,
    };

    console.log("Sending updated user data:", updatedData);

    const updateSuccessful = await updateUser(userProfile.id, updatedData);

    if (updateSuccessful) {
      Alert.alert(
        "Profile Updated",
        "Your profile has been successfully updated."
      );
    } else {
      Alert.alert("Update Failed", "There was an error updating your profile.");
    }
  }, [
    usernameText,
    descriptionText,
    userProfile.id,
    userProfile.visibility,
    updateUser,
  ]);

  // Update Header Options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={saveProfile}
          style={{
            marginRight: percentToDP(4),
          }}
        >
          <ThemedIcon
            name="checkmark-outline"
            size={percentToDP(10)}
            style={{
              backgroundColor: themeColors.tertiary,
              borderRadius: percentToDP(100),
              padding: percentToDP(1.5),
            }}
          />
        </Pressable>
      ),
      headerTitle: username,
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [navigation, saveProfile, themeColors, username]);

  // Handle Avatar Change
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

      await changeUserAvatar(userProfile.id, file);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedView style={{ flex: 1 }}>
        {/* Avatar Section */}
        <View
          style={{
            flex: 3,
            width: widthPercentageToDP(100),
            backgroundColor: themeColors.secondary,
          }}
        />
        <View
          style={{
            flex: 7,
            flexDirection: "column",
            width: widthPercentageToDP(100),
            paddingHorizontal: widthPercentageToDP(10),
            backgroundColor: themeColors.tertiary,
          }}
        >
          <View
            style={{ alignItems: "center", marginTop: heightPercentToPD(-15) }}
          >
            <UserAvatar
              size={heightPercentToPD(7)}
              userId={userProfile?.id}
              imageUrl={userProfile?.imageUrl || null}
              doLink={false}
            />
          </View>

          {/* Inputs */}
          <View
            style={{
              width: widthPercentageToDP(80),
              paddingVertical: heightPercentToPD(1),
            }}
          >
            {/* Username */}
            <ThemedText>Username</ThemedText>
            <TextInput
              maxLength={16}
              style={{
                paddingHorizontal: percentToDP(6),
                borderWidth: 1,
                borderRadius: percentToDP(4),
                borderColor: themeColors.secondary,
                color: themeColors.textOnSecondary,
              }}
              onChangeText={setUsernameText}
              value={usernameText}
            />

            {/* Description */}
            <ThemedText>Description</ThemedText>
            <TextInput
              maxLength={64}
              style={{
                paddingHorizontal: percentToDP(6),
                borderWidth: 1,
                borderRadius: percentToDP(4),
                borderColor: themeColors.secondary,
                color: themeColors.textOnSecondary,
              }}
              onChangeText={setDescriptionText}
              value={descriptionText}
            />

            {/* Email */}
            <ThemedText>E-mail Address</ThemedText>
            <TextInput
              editable={false}
              style={{
                paddingHorizontal: percentToDP(6),
                borderWidth: 1,
                borderRadius: percentToDP(4),
                borderColor: themeColors.secondary,
                color: themeColors.textOnSecondary,
              }}
              value={emailText}
            />

            {/* Buttons */}
            <ThemedButton
              label="Change avatar"
              onPress={handleAvatarChange}
            />
          </View>
        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
