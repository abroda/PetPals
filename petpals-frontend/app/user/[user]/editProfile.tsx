import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {router, useNavigation, usePathname} from "expo-router";
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
import {ThemedTextField} from "@/components/inputs/ThemedTextField";
import {ThemedScrollView} from "@/components/basic/containers/ThemedScrollView";

export default function EditUserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const {userId, userEmail} = useAuth();

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
      Alert.alert("Profile Updated", "Your profile has been successfully updated.");
      router.back(); // Navigate back with refresh trigger
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

      const avatarUpdated = await changeUserAvatar(userProfile.id, file);
      if (avatarUpdated) {
        router.replace(`/user/${userProfile.id}`); // Navigate back with refresh trigger
      } else {
        Alert.alert("Avatar Update Failed", "There was an error updating your avatar.");
      }
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ThemedScrollView style={{}}>
        {/* Avatar Section */}
        <View
          style={{
            height: heightPercentToPD(30),
            width: widthPercentageToDP(100),
            backgroundColor: themeColors.secondary,
          }}
        />
        <View
          style={{

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
              size={heightPercentToPD(8)}
              userId={userProfile?.id}
              imageUrl={userProfile?.imageUrl || null}
              doLink={false}
            />
          </View>

          {/* Inputs */}
          <View
            style={{
              width: widthPercentageToDP(80),
              paddingVertical: heightPercentToPD(4),
            }}
          >
            {/* Username */}
            <ThemedText style={{marginTop: percentToDP(5)}}>Username</ThemedText>
            <ThemedTextField maxLength={16} onChangeText={setUsernameText} value={usernameText.trim()}/>
            {/* Description */}
            <ThemedText style={{marginTop: percentToDP(5)}}>Description</ThemedText>
            <ThemedTextField maxLength={64} onChangeText={setDescriptionText} value={descriptionText}/>

            <ThemedText style={{marginTop: percentToDP(5)}}>E-mail address</ThemedText>
            <ThemedTextField maxLength={64} editable={false} value={userEmail}/>
            {/*<TextInput*/}
            {/*  maxLength={16}*/}
            {/*  style={{*/}
            {/*    padding: percentToDP(4),*/}
            {/*    borderWidth: 1,*/}
            {/*    borderRadius: percentToDP(4),*/}
            {/*    borderColor: themeColors.secondary,*/}
            {/*    color: themeColors.textOnSecondary,*/}
            {/*    marginBottom: percentToDP(5),*/}
            {/*  }}*/}
            {/*  onChangeText={setUsernameText}*/}
            {/*  value={usernameText}*/}
            {/*/>*/}


            {/*<TextInput*/}
            {/*  maxLength={64}*/}
            {/*  style={{*/}
            {/*    padding: percentToDP(4),*/}
            {/*    borderWidth: 1,*/}
            {/*    borderRadius: percentToDP(4),*/}
            {/*    borderColor: themeColors.secondary,*/}
            {/*    color: themeColors.textOnSecondary,*/}
            {/*    marginBottom: percentToDP(5),*/}
            {/*  }}*/}
            {/*  onChangeText={setDescriptionText}*/}
            {/*  value={descriptionText}*/}
            {/*/>*/}

            {/* Email */}
            {/*<ThemedText>E-mail Address</ThemedText>*/}
            {/*<TextInput*/}
            {/*  editable={false}*/}
            {/*  style={{*/}
            {/*    padding: percentToDP(4),*/}
            {/*    borderWidth: 1,*/}
            {/*    borderRadius: percentToDP(4),*/}
            {/*    borderColor: themeColors.secondary,*/}
            {/*    color: themeColors.textOnSecondary,*/}
            {/*    marginBottom: percentToDP(5),*/}
            {/*  }}*/}
            {/*  value={emailText}*/}
            {/*/>*/}

            {/* Buttons */}
            <ThemedButton
              label="Change avatar"
              onPress={handleAvatarChange}
              style={{
                width: "60%",
                marginTop: percentToDP(8),
                marginHorizontal: 'auto',
              }}
            />
          </View>
        </View>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
