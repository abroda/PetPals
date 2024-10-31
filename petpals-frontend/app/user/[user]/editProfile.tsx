import {ThemedText} from "@/components/basic/ThemedText";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import UserAvatar from "@/components/navigation/UserAvatar";
import {usePathname} from "expo-router";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {SafeAreaView} from "react-native-safe-area-context";
import { useContext, useEffect, useState } from "react";

import {TextInput} from 'react-native';

import { UserContext } from "@/context/UserContext";
import {heightPercentageToDP, widthPercentageToDP} from "react-native-responsive-screen";
import {Pressable, View} from "react-native";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";
import {ThemedButton} from "@/components/inputs/ThemedButton";


export default function EditUserProfileScreen() {
    const path = usePathname();
    const username = path.slice(path.lastIndexOf("/") + 1);
    const percentToDP = useWindowDimension("shorter");
    const heightPercentToPD = useWindowDimension("height");

    const darkGreen = '#0A2421'
    const lightGreen = '#1C302A'
    const accentGreen = '#B4D779'
    const accentTeal = '#52B8A3'
    const cream = '#FAF7EA'

    const [usernameText, onChangeUsernameText] = useState('Username');
    const [descriptionText, onChangeDescritpionText] = useState('Description');
    const [emailText, onChangeEmailText] = useState('E-mail Address');


    // @ts-ignore
    const {getUserById, userProfile, isProcessing, responseMessage} = useContext(UserContext);

    useEffect(() => {
        getUserById(userProfile.id);
    }, []);

    const saveProfile = () => {

    }

    const handleChangePassword = () => {

    }


    return (
        <SafeAreaView>
            <ThemedView
                style={{
                    width: widthPercentageToDP(100),
                    height: heightPercentToPD(100),
                }}
            >
                <HorizontalView
                    justifyOption="flex-end"
                    style={{
                        flex:0,
                        width: widthPercentageToDP(100),
                        height: heightPercentToPD(30),
                        paddingHorizontal: widthPercentageToDP(5),
                        paddingVertical: heightPercentToPD(5),
                        backgroundColor: lightGreen,

                }}>
                    <Pressable
                        onPress={saveProfile}
                        style={{
                            position: 'absolute',
                            top: 0,
                            right: 0,
                            marginRight: percentToDP(5),
                            marginTop: percentToDP(5),
                        }}
                    >
                        <ThemedIcon name="checkmark-outline" size={percentToDP(10)} style={{
                            backgroundColor: darkGreen,
                            borderRadius: percentToDP(100),
                            padding: percentToDP(3),
                        }}/>
                    </Pressable>
                </HorizontalView>



                <HorizontalView
                    justifyOption="flex-start"
                    style={{
                        flex:1,
                        flexDirection: 'column',
                        width: widthPercentageToDP(100),
                        paddingHorizontal: widthPercentageToDP(5),
                        paddingVertical: heightPercentToPD(0),
                        backgroundColor: darkGreen,

                    }}
                >

                    {/* Avatar picture */}
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: heightPercentToPD(-20),

                    }}>
                        <UserAvatar
                            size={heightPercentToPD(7)}
                            userId={userProfile?.userId}
                            imageUrl={userProfile?.imageUrl || null}
                            doLink={false}
                        />

                    </View>

                    <View style={{
                        flex: 1,
                        backgroundColor: darkGreen,
                        width: widthPercentageToDP(80),
                        paddingVertical: heightPercentToPD(5),

                    }}>
                        {/* Username */}
                        <ThemedText style={{
                            backgroundColor: 'none',
                            color: accentGreen,
                            fontSize: 16,
                            fontWeight: 'light',
                            marginBottom: heightPercentToPD(-1),
                            marginLeft: heightPercentToPD(3),
                            zIndex: 2,
                        }}>
                            Username
                        </ThemedText>
                        <TextInput
                            maxLength={16}
                            style={{
                                paddingHorizontal: percentToDP(6),
                                paddingVertical: percentToDP(4),
                                borderRadius: percentToDP(6),
                                borderWidth: 1,
                                borderColor: lightGreen,
                                color: cream,
                                fontSize: 16,
                                letterSpacing: 0.5,
                            }}
                            onChangeText={onChangeUsernameText}
                            value={usernameText}
                        />

                        {/* Description */}
                        <ThemedText style={{
                            backgroundColor: 'none',
                            color: accentGreen,
                            fontSize: 16,
                            fontWeight: 'light',
                            marginBottom: heightPercentToPD(-1),
                            marginLeft: heightPercentToPD(3),
                            zIndex: 2,
                        }}>
                            Description
                        </ThemedText>
                        <TextInput
                            maxLength={48}
                            style={{
                                height: heightPercentToPD(18),
                                justifyContent: 'flex-start',
                                alignContent: 'flex-start',
                                alignItems: 'flex-start',
                                paddingHorizontal: percentToDP(6),
                                paddingVertical: percentToDP(4),
                                textAlignVertical: 'top',
                                borderRadius: percentToDP(6),
                                borderWidth: 1,
                                borderColor: lightGreen,
                                color: cream,
                                fontSize: 16,
                                letterSpacing: 0.5,
                            }}
                            onChangeText={onChangeDescritpionText}
                            value={descriptionText}
                        />

                        {/* E-mail address */}
                        <ThemedText style={{
                            backgroundColor: 'none',
                            color: accentGreen,
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
                            style={{
                                paddingHorizontal: percentToDP(6),
                                paddingVertical: percentToDP(4),
                                borderRadius: percentToDP(6),
                                borderWidth: 1,
                                borderColor: lightGreen,
                                color: cream,
                                fontSize: 16,
                                letterSpacing: 0.5,
                            }}
                            onChangeText={onChangeEmailText}
                            value={emailText}
                        />

                        <ThemedButton label="Change password" onPress={() => handleChangePassword()} color={accentGreen} style={{
                            width: widthPercentageToDP(80),
                            backgroundColor: 'transparent',
                            paddingHorizontal: percentToDP(6),
                            paddingVertical: percentToDP(4),
                            borderRadius: percentToDP(6),
                            borderWidth: 1,
                            borderColor: accentGreen,
                        }}/>
                    </View>

                </HorizontalView>
            </ThemedView>
        </SafeAreaView>
    );
}
