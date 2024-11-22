import {ThemedText} from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {useNavigation, usePathname, router, Href} from "expo-router";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {useContext, useEffect, useLayoutEffect, useState} from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Alert,
  Pressable,
  Button, ScrollView,
} from "react-native";
import {UserContext} from "@/context/UserContext";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import * as ImagePicker from "expo-image-picker";
import {tls} from "node-forge";
import {email} from "@sideway/address";
import {useUser} from "@/hooks/useUser";

import {useColorScheme} from "@/hooks/theme/useColorScheme";
import {ThemeColors} from "@/constants/theme/Colors";

export default function EditUserProfileScreen() {
  const path = usePathname();
  const username = path.slice(path.lastIndexOf("/") + 1);
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");
  const navigation = useNavigation();


  // Colours
  const darkGreen = "#0A2421";
  const lightGreen = "#1C302A";
  const accentGreen = "#B4D779";
  const accentTeal = "#52B8A3";
  const cream = "#FAF7EA";

  // Colours
  const colorScheme = useColorScheme();
  // @ts-ignore
  const themeColors = ThemeColors[colorScheme];

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

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Pressable
          onPress={saveProfile}
          style={{
          }}
        >
          <ThemedIcon
            name="checkmark-outline"
            size={percentToDP(10)}
            style={{
              backgroundColor: themeColors.tertiary,
              borderRadius: percentToDP(100),
              padding: percentToDP(1),
            }}
          />
        </Pressable>
      ),
      headerTitle: "Edit your profile",
      headerStyle: {
        backgroundColor: themeColors.secondary,
      },
    });
  }, []);

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
      router.back();

    } else {
      Alert.alert("Update Failed", "There was an error updating your profile.");
      router.back();
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
      Alert.alert("Avatar changed", "Your avatar picture was successfully updated!");
      router.back();
    }
  };

  const handleChangePassword = () => {
  };

  const handleChangeEmail = () => {
  };

  return (
    <SafeAreaView style={{flex: 1}}>

      <ThemedView
        style={{
          flex: 1,
        }}
      >
        <ScrollView style={{
          flex: 1,
        }}>
          <View
            style={{
              height: heightPercentToPD(30),
              width: widthPercentageToDP(100),
              paddingTop: heightPercentToPD(5),
              backgroundColor: themeColors.secondary,
            }}
          >

          </View>

          <View
            style={{
              height: heightPercentToPD(70),
              flexDirection: "column",
              width: widthPercentageToDP(100),
              alignItems: 'center',
              paddingVertical: heightPercentToPD(0),
              backgroundColor: themeColors.tertiary,
            }}
          >
            {/* Avatar picture */}
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                marginTop: heightPercentToPD(-15),
              }}
            >
              <UserAvatar
                size={heightPercentToPD(6)}
                userId={userProfile?.id ?? ""}
                imageUrl={userProfile?.imageUrl}
                doLink={false}
              />
            </View>

            {/* Container for TextInputs and buttons */}
            <View
              style={{
                flex: 1,
                backgroundColor: 'transparent',
                width: widthPercentageToDP(80),
                paddingVertical: heightPercentToPD(2),
                justifyContent: 'center',
                alignContent: 'center',
              }}
            >
              {/* Username */}
              <ThemedText
                textStyleOptions={{
                  weight: "regular",
                  size: "small",
                }}
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  marginLeft: heightPercentToPD(2),
                  zIndex: 3,
                }}
              >
                Username
              </ThemedText>
              <TextInput
                maxLength={16}
                style={{
                  paddingHorizontal: percentToDP(5),
                  paddingVertical: percentToDP(2),

                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,

                  color: themeColors.textOnSecondary,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  marginBottom: heightPercentToPD(2),
                }}
                onChangeText={setUsernameText}
                value={usernameText}
              />

              {/* Description */}
              <ThemedText
                textStyleOptions={{
                  weight: "regular",
                  size: "small",
                }}
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  marginLeft: heightPercentToPD(2),
                  zIndex: 2,
                }}
              >
                Description
              </ThemedText>

              <TextInput
                maxLength={48}
                style={{
                  height: heightPercentToPD(10),
                  justifyContent: "flex-start",
                  alignContent: "flex-start",
                  alignItems: "flex-start",
                  paddingHorizontal: percentToDP(6),
                  paddingVertical: percentToDP(2),
                  textAlignVertical: "top",

                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: cream,
                  fontSize: 14,
                  letterSpacing: 0.5,
                  marginBottom: heightPercentToPD(2),
                }}
                onChangeText={setDescriptionText}
                value={descriptionText}
              />

              {/* E-mail address */}
              <ThemedText
                textStyleOptions={{
                  weight: "regular",
                  size: "small",
                }}
                style={{
                  backgroundColor: "none",
                  color: themeColors.primary,
                  marginBottom: heightPercentToPD(-1),
                  marginLeft: heightPercentToPD(3),
                  zIndex: 2,
                }}
              >
                E-mail address
              </ThemedText>
              <TextInput
                maxLength={32}
                editable={false}
                style={{
                  paddingHorizontal: percentToDP(6),
                  paddingVertical: percentToDP(2),
                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                  borderColor: themeColors.secondary,
                  color: cream,
                  fontSize: 16,
                  letterSpacing: 0.5,
                  marginBottom: heightPercentToPD(2),
                }}
                onChangeText={setEmailText}
                value={emailText}
              />

              <View style={{
                width: widthPercentageToDP(80),
                flexDirection: 'row',
                marginHorizontal: 'auto',
                justifyContent: 'space-between'
              }}>
                <ThemedButton
                  label="Change e-mail"
                  border={true}
                  onPress={() => handleChangeEmail()}
                  textColorName={"primary"}
                  style={{
                    height: heightPercentToPD(7),
                    width: widthPercentageToDP(38),
                    paddingHorizontal: 5,
                    backgroundColor: themeColors.transparent,
                    marginTop: heightPercentToPD(2),
                    borderRadius: percentToDP(4),
                    borderWidth: 1,
                  }}
                />

                <ThemedButton
                  label="Change avatar"
                  border={true}
                  onPress={handleAvatarChange}
                  textColorName={"primary"}
                  style={{
                    height: heightPercentToPD(7),
                    width: widthPercentageToDP(38),
                    paddingHorizontal: 5,
                    backgroundColor: themeColors.transparent,
                    marginTop: heightPercentToPD(2),
                    borderRadius: percentToDP(4),
                    borderWidth: 1,
                  }}
                />
              </View>

              {/* same styling but using the existing options */}
              <ThemedButton
                label="Change password"
                border={true}
                textColorName="accent"
                onPress={handleChangePassword}
                style={{
                  height: heightPercentToPD(7),
                  width: widthPercentageToDP(80),
                  backgroundColor: themeColors.transparent,
                  marginTop: heightPercentToPD(2),
                  paddingHorizontal: percentToDP(2),
                  borderRadius: percentToDP(4),
                  borderWidth: 1,
                }}
              />
              {/* <ThemedButton
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
            /> */}
            </View>
          </View>
        </ScrollView>
      </ThemedView>

    </SafeAreaView>
  );
}
