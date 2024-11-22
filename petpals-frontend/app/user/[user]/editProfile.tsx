import {ThemedText} from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useNavigation, usePathname} from "expo-router";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import React, {useContext, useEffect, useLayoutEffect, useState} from "react";
import { SafeAreaView, View, TextInput, Alert, Pressable, Button } from "react-native";
import { UserContext } from "@/context/UserContext";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import * as ImagePicker from 'expo-image-picker';
import {tls} from "node-forge";
import {email} from "@sideway/address";
import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";



export default function EditUserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const navigation = useNavigation();

  // Colours
  const darkGreen = '#0A2421'
  const lightGreen = '#1C302A'
  const accentGreen = '#B4D779'
  const accentTeal = '#52B8A3'
  const cream = '#FAF7EA'

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

  // @ts-ignore
  const {getUserById, userProfile, updateUser, changeUserAvatar, isProcessing, responseMessage} = useContext(UserContext);

  // States
  const [usernameText, setUsernameText] = useState("");
  const [descriptionText, setDescriptionText] = useState("");
  const [emailText, setEmailText] = useState("");
  const [image, setImage] = useState<string | null>(null);


  useEffect(() => {
    getUserById(userProfile.id);
  }, []);

  useEffect(() => {
    if (userProfile) {
      setUsernameText(userProfile.username);
      setDescriptionText(userProfile.description);
      setEmailText(userProfile.email);
    }
  }, [userProfile]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={saveProfile}
          style={{

          }}
        >
          <ThemedIcon name="checkmark-outline" size={percentToDP(10)} style={{
            backgroundColor: themeColors.tertiary,
            borderRadius: percentToDP(100),
            padding: percentToDP(1.5),
          }}/>
        </Pressable>
      ),
      headerTitle: username,
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, [navigation]);


  const saveProfile = async () => {
    // Set displayName (username) to "No Username" if empty
    const displayNameToSave = usernameText.trim() || "No Username";
    const descriptionToSave = descriptionText.trim() || "No Description";

    // Prepare data to update
    const updatedData = {
      displayName: displayNameToSave,  // Ensure displayName is sent as expected by the backend
      description: descriptionToSave,
      visibility: userProfile.visibility,  // Include visibility if needed
    };

    console.log("Sending updated user data:", updatedData);

    // Update user data
    const updateSuccessful = await updateUser(userProfile.id, updatedData);

    if (updateSuccessful) {
      Alert.alert("Profile Updated", "Your profile has been successfully updated.");
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

      await changeUserAvatar(userProfile.id, file);
    }
  };

  const handleChangePassword = () => {

  }

  const handleChangeEmail = () => {

  }


  return (
    <SafeAreaView style={{flex: 1}}>
      <ThemedView
        style={{
          flex: 1,
        }}
      >
        <View
          style={{
            flex: 3,
            width: widthPercentageToDP(100),
            backgroundColor: themeColors.secondary,
          }}>
        </View>

        <View
          style={{
            flex: 7,
            flexDirection: 'column',
            width: widthPercentageToDP(100),
            paddingHorizontal: widthPercentageToDP(10),
            backgroundColor: themeColors.tertiary,
            marginHorizontal: 'auto',
          }}
        >

          {/* Avatar picture */}
          <View style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: heightPercentToPD(-15),
          }}>
            <UserAvatar
              size={heightPercentToPD(7)}
              userId={userProfile?.userId}
              imageUrl={userProfile?.imageUrl || null}
              doLink={false}
            />
          </View>

          {/* Container for TextInputs and buttons */}
          <View style={{
            backgroundColor: 'transparent',
            flex: 1,
            width: widthPercentageToDP(80),
            paddingTop: heightPercentToPD(1),
            paddingBottom: heightPercentToPD(3),
            alignContent: 'space-around',
            justifyContent: 'space-around',
          }}>
            {/* Username */}
            <ThemedText style={{
              backgroundColor: 'none',
              color: themeColors.primary,
              fontSize: 16,
              fontWeight: 'light',
              marginLeft: heightPercentToPD(2),
              marginBottom: heightPercentToPD(-1),
              zIndex: 2,
            }}>
              Username
            </ThemedText>

            <TextInput
              maxLength={16}
              style={{
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(1),
                borderRadius: percentToDP(4),
                borderWidth: 1,
                borderColor: themeColors.secondary,
                color: cream,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
              onChangeText={setUsernameText}
              value={usernameText}
            />

            {/* Description */}
            <ThemedText style={{
              backgroundColor: 'none',
              color: themeColors.primary,
              fontSize: 16,
              fontWeight: 'light',
              marginBottom: heightPercentToPD(-1),
              marginLeft: heightPercentToPD(3),
              zIndex: 2,
            }}>
              Description
            </ThemedText>
            <TextInput
              maxLength={64}
              style={{
                height: heightPercentToPD(10),
                justifyContent: 'flex-start',
                alignContent: 'flex-start',
                alignItems: 'flex-start',
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(1),
                textAlignVertical: 'top',
                borderRadius: percentToDP(4),
                borderWidth: 1,
                borderColor: themeColors.secondary,
                color: cream,
                fontSize: 14,
                letterSpacing: 0.5,
              }}
              onChangeText={setDescriptionText}
              value={descriptionText}
            />

            {/* E-mail address */}
            <ThemedText style={{
              backgroundColor: 'none',
              color: themeColors.primary,
              fontSize: 16,
              fontWeight: 'light',
              marginBottom: heightPercentToPD(-1),
              marginLeft: heightPercentToPD(3),
              zIndex: 2,
            }}>
              E-mail Address
            </ThemedText>
            <TextInput
              maxLength={32}
              editable={false}
              style={{
                paddingHorizontal: percentToDP(6),
                paddingVertical: percentToDP(1),
                borderRadius: percentToDP(4),
                borderWidth: 1,
                borderColor: themeColors.secondary,
                color: cream,
                fontSize: 16,
                letterSpacing: 0.5,
              }}
              onChangeText={setEmailText}
              value={emailText}
            />

            <View style={{
              flexDirection: 'row',
              width: widthPercentageToDP(80),
              marginHorizontal: 'auto',
              justifyContent: 'space-between'
            }}>
              <ThemedButton label="Change e-mail" onPress={() => handleChangeEmail()} color={accentTeal} style={{
                width: widthPercentageToDP(37),
                backgroundColor: 'transparent',

                borderRadius: percentToDP(4),
                borderWidth: 1,
                borderColor: accentTeal,
              }}/>

              <ThemedButton label="Change avatar" onPress={handleAvatarChange} color={accentTeal} style={{
                width: widthPercentageToDP(37),
                backgroundColor: 'transparent',
                borderRadius: percentToDP(4),
                borderWidth: 1,
                borderColor: accentTeal,
              }}/>
            </View>

            <ThemedButton label="Change password" onPress={() => handleChangePassword()} color={themeColors.primary} style={{
              width: widthPercentageToDP(80),
              backgroundColor: 'transparent',
              paddingVertical: percentToDP(2),
              borderRadius: percentToDP(4),
              borderWidth: 1,
              borderColor: themeColors.primary,
            }}/>
          </View>

        </View>
      </ThemedView>
    </SafeAreaView>
  );
}
