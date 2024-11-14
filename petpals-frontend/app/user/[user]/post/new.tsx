import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedScrollView} from "@/components/basic/containers/ThemedScrollView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {useAuth} from "@/hooks/useAuth";
import {router, useNavigation, usePathname} from "expo-router";
import React, {useCallback, useLayoutEffect, useRef, useState} from "react";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {Image, TextFieldRef, TouchableOpacity} from "react-native-ui-lib";
import {ThemedTextField} from "@/components/inputs/ThemedTextField";
import {ThemedMultilineTextField} from "@/components/inputs/ThemedMultilineTextField";
import * as ImagePicker from 'expo-image-picker';
import {ThemedText} from "@/components/basic/ThemedText";
import {useThemeColor} from "@/hooks/theme/useThemeColor";
import {View} from "react-native";
import {usePosts} from "@/hooks/usePosts";

export default function NewPostScreen() {
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");
    const secondaryColor = useThemeColor("secondary");
    const backgroundColor = useThemeColor("background");
    const {userId} = useAuth();
    const {addPost, isProcessing} = usePosts();
    const asyncAbortController = useRef<AbortController | undefined>();

    // ERROR HANDLING
    const [validationMessage, setValidationMessage] = useState("")

    // INPUT STATES
    const [photo, setPhoto] = useState<string | null>(null);
    const [postTitle, setPostTitle] = useState("");
    const [postDescription, setPostDescription] = useState("");

    // INPUT REFS
    const postTitleRef = useRef<TextFieldRef>(null);
    const postDescriptionRef = useRef<TextFieldRef>(null);

    // HIDING DEFAULT NAVIGATION
    const navigation = useNavigation();
    useLayoutEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
    }, [navigation]);



    const addPostCallback = useCallback(async () => {
        console.log("Start loading");
        asyncAbortController.current = new AbortController();
        return await addPost(
            postTitle,
            postDescription,
            asyncAbortController.current
        );
        // if (result.success) {
        //     console.log(result.returnValue)
        // }
        console.log("Stop loading");
    }, [postTitle, postDescription]);


    const selectPhoto = async () => {
        const {canAskAgain, status} = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            setPhoto(result.assets[0].uri);
        }
    }

    const clearPhoto = () => {
        setPhoto(null)
    }

    function validate() {
        return postTitleRef.current?.validate();
    }

    // might need to be async
    function submit() {
        if (!validate()) {
            // TODO: handle invalid input here
            console.log("FAILED TO ADD A NEW POST")
            // setValidationMessage("Input is invalid");
        } else {
            // TODO: connect to add post context function here, handle server side errors too
            addPostCallback().then((result) => {
                if (result.success){
                    console.log("SUCCESSFULLY ADDED NEW POST")
                    console.log("POST ID:", result.returnValue.id)
                    router.replace(`/user/${userId}/post/${result.returnValue.id}`);
                } else {
                    console.log("SOMETHING WENT WRONG")
                }
            })


            // let result = await login(email, password);
            // setValidationMessage(result.message);
            // if (result.success) {
            //     setDialogVisible(false);
            //     router.dismissAll();
            //     router.replace("/home");
            // }
        }
    }


    return (
        <SafeAreaView style={{flex: 1}}>
            {/* TOP NAVBAR */}
            <ThemedView style={{height: heightPercentToDP(10)}}>
                <HorizontalView colorName="secondary"
                                style={{height: heightPercentToDP(10), paddingHorizontal: percentToDP(5)}}
                >
                    {/* BACK BUTTON */}
                    <ThemedButton backgroundColorName="background"
                                  style={{
                                      height: heightPercentToDP(7),
                                      width: heightPercentToDP(7),
                                      minWidth: heightPercentToDP(7) // MIN WIDTH HAS TO BE OVERWRITTEN FOR WIDTH TO TAKE EFFECT!
                                  }}
                                  onPress={() => {
                                      router.back()
                                  }}>
                        <ThemedIcon size={heightPercentToDP(4)}
                                    style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}
                                    colorName="primary" name={"arrow-back"}/>
                    </ThemedButton>

                    {/* SAVE BUTTON */}
                    <ThemedButton backgroundColorName="background"
                                  style={{
                                      height: heightPercentToDP(7),
                                      width: heightPercentToDP(7),
                                      minWidth: heightPercentToDP(7) // MIN WIDTH HAS TO BE OVERWRITTEN FOR WIDTH TO TAKE EFFECT!
                                  }}
                                  onPress={submit}>
                        <ThemedIcon size={heightPercentToDP(4)}
                                    style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}
                                    colorName="primary" name={"checkmark"}/>
                    </ThemedButton>
                </HorizontalView>
            </ThemedView>


            <ThemedScrollView colorName="secondary" style={{flex: 1, paddingTop: heightPercentToDP(3)}}
                              contentContainerStyle={{flexGrow: 1}}>
                {/* POST CONTAINER */}
                <ThemedView colorName="background" style={{
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                    padding: percentToDP(5),
                    paddingTop: percentToDP(10),
                    flex: 1,
                }}>

                    {/* POST IMAGE */}
                    {/* TODO: make it an input. */}
                    <ThemedView
                        style={{
                            width: percentToDP(90),
                            height: percentToDP(90),
                            marginBottom: percentToDP(10),
                            borderRadius: 30
                        }}
                    >
                        {photo ? <View style={{
                                borderRadius: 30,
                                borderWidth: 1,
                                borderColor: secondaryColor,
                            }}>
                                {/* SELECTED PHOTO */}
                                <Image
                                    source={{uri: photo}}
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        borderRadius: 30,
                                    }}
                                />

                                {/* EDIT BUTTON */}
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        position: "absolute",
                                        backgroundColor: backgroundColor,
                                        top: 10,
                                        right: 10,
                                        borderRadius: 30,
                                        height: heightPercentToDP(7),
                                        width: heightPercentToDP(7),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: secondaryColor,
                                        borderWidth: 1,
                                    }}
                                    onPress={selectPhoto}>
                                    <ThemedIcon name="pencil" size={heightPercentToDP(4)}
                                                style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}/>
                                </TouchableOpacity>

                                {/* CLEAR PHOTO BUTTON */}
                                <TouchableOpacity
                                    activeOpacity={0.6}
                                    style={{
                                        position: "absolute",
                                        backgroundColor: backgroundColor,
                                        top:  heightPercentToDP(7) + 20,
                                        right: 10,
                                        borderRadius: 30,
                                        height: heightPercentToDP(7),
                                        width: heightPercentToDP(7),
                                        alignItems: "center",
                                        justifyContent: "center",
                                        borderColor: secondaryColor,
                                        borderWidth: 1,
                                    }}
                                    onPress={clearPhoto}>
                                    <ThemedIcon name="close" size={heightPercentToDP(4)}
                                                style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}/>
                                </TouchableOpacity>
                            </View> :
                            <TouchableOpacity
                                activeOpacity={0.6}
                                style={{
                                    backgroundColor: "rgba(0,0,0,0.1)",
                                    borderRadius: 30,
                                    borderWidth: 1,
                                    borderColor: secondaryColor,
                                    width: "100%",
                                    height: "100%",
                                    alignItems: "center",
                                    justifyContent: "center"
                                }}
                                onPress={selectPhoto}>
                                <ThemedIcon name="camera"/>
                                <ThemedText backgroundColorName={"transparent"}>Tap to select photo</ThemedText>
                            </TouchableOpacity>}

                    </ThemedView>

                    {/* POST TITLE INPUT */}
                    <ThemedTextField
                        ref={postTitleRef}
                        label="Post title"
                        onChangeText={(newText: string) => setPostTitle(newText)}
                        withValidation
                        validate={["required"]}
                        validationMessage={["Post title is required"]}
                        maxLength={100}
                    />

                    {/* POST DESCRIPTION INPUT */}
                    <ThemedMultilineTextField label="Post description" maxLength={255} style={{marginBottom: percentToDP(10)}}/>

                </ThemedView>
            </ThemedScrollView>
        </SafeAreaView>
    );
}


{/*<ThemedView*/
}
{/*  colorName="tertiary"*/
}
{/*  style={{*/
}
{/*    margin: percentToDP(3),*/
}
{/*    paddingVertical: percentToDP(3),*/
}
{/*    borderRadius: percentToDP(10),*/
}
{/*  }}*/
}
{/*>*/
}
{/*  <HorizontalView*/
}
{/*    colorName="transparent"*/
}
{/*    justifyOption="flex-start"*/
}
{/*  >*/
}
{/*    <ThemedView*/
}
{/*      colorName="transparent"*/
}
{/*      style={{ margin: percentToDP(3), borderRadius: percentToDP(10) }}*/
}
{/*    >*/
}
{/*      <ThemedText textStyleName="big">TODO: Add post</ThemedText>*/
}
{/*    </ThemedView>*/
}
{/*  </HorizontalView>*/
}
{/*  <ThemedView*/
}
{/*    style={{*/
}
{/*      alignSelf: "center",*/
}
{/*      height: 400,*/
}
{/*      marginBottom: percentToDP(5),*/
}
{/*    }}*/
}
{/*  >*/
}
{/*    <Image*/
}
{/*      source={{*/
}
{/*        uri: "https://www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg",*/
}
{/*      }}*/
}
{/*      style={{*/
}
{/*        width: percentToDP(100),*/
}
{/*        height: percentToDP(100),*/
}
{/*      }}*/
}
{/*    />*/
}
{/*  </ThemedView>*/
}
{/*  <ThemedText>Enter Title</ThemedText>*/
}
{/*  <HorizontalView justifyOption="flex-end">*/
}
{/*    <ThemedButton*/
}
{/*      style={{ width: percentToDP(30) }}*/
}
{/*      onPress={() => router.replace("./newPostID")}*/
}
{/*      label="Save"*/
}
{/*    ></ThemedButton>*/
}
{/*  </HorizontalView>*/
}
{/*  <HorizontalView justifyOption="flex-start">*/
}
{/*    <ThemedText*/
}
{/*      style={{ marginRight: percentToDP(5) }}*/
}
{/*      textStyleName="smallBold"*/
}
{/*    >*/
}
{/*      Pets tagged:*/
}
{/*    </ThemedText>*/
}
{/*    <PetAvatar*/
}
{/*      size={11}*/
}
{/*      username="Username"*/
}
{/*      pet="Cutie"*/
}
{/*      doLink={true}*/
}
{/*    />*/
}
{/*  </HorizontalView>*/
}
{/*  {dialogVisible && (*/
}
{/*    <PostReactionPopup onDismiss={() => setDialogVisible(false)} />*/
}
{/*  )}*/
}
{/*</ThemedView>*/
}

{/*<ThemedView*/
}
{/*  colorName="tertiary"*/
}
{/*  style={{ borderRadius: percentToDP(10), margin: percentToDP(4) }}*/
}
{/*/>*/
}