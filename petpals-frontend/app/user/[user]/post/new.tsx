import HorizontalView from "@/components/basic/containers/HorizontalView";
import {ThemedScrollView} from "@/components/basic/containers/ThemedScrollView";
import {ThemedView} from "@/components/basic/containers/ThemedView";
import {ThemedButton} from "@/components/inputs/ThemedButton";
import {useAuth} from "@/hooks/useAuth";
import {router, usePathname} from "expo-router";
import {useState} from "react";
import {useWindowDimension} from "@/hooks/useWindowDimension";
import {SafeAreaView} from "react-native-safe-area-context";
import {ThemedIcon} from "@/components/decorations/static/ThemedIcon";

export default function NewPostScreen() {
    const path = usePathname();
    const username = path.split("/")[2];
    const {userEmail} = useAuth();
    const [dialogVisible, setDialogVisible] = useState(false);

    const percentToDP = useWindowDimension("shorter");
    const heightPercentToDP = useWindowDimension("height");

    return (
        <SafeAreaView style={{height: "100%"}}>
            <ThemedScrollView colorName="background">
                {/* TOP NAVBAR */}
                <HorizontalView colorName="primary"
                                style={{height: heightPercentToDP(10), paddingHorizontal: percentToDP(5)}}>
                    {/* BACK BUTTON */}
                    <ThemedButton backgroundColorName="background"
                                  style={{
                                      height: heightPercentToDP(7),
                                      width: heightPercentToDP(7),
                                      minWidth: heightPercentToDP(7) // MIN WIDTH HAS TO BE OVERWRITTEN FOR WIDTH TO TAKE EFFECT!
                                  }}
                                  onPress={() => {
                                      console.log("TEST")
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
                                  }}>
                        <ThemedIcon size={heightPercentToDP(4)}
                                    style={{width: heightPercentToDP(4), height: heightPercentToDP(4)}}
                                    colorName="primary" name={"checkmark"}/>
                    </ThemedButton>
                </HorizontalView>
                <ThemedView colorName="secondary" style={{height: heightPercentToDP(20)}}>

                </ThemedView>

                {/*<ThemedView*/}
                {/*  colorName="tertiary"*/}
                {/*  style={{*/}
                {/*    margin: percentToDP(3),*/}
                {/*    paddingVertical: percentToDP(3),*/}
                {/*    borderRadius: percentToDP(10),*/}
                {/*  }}*/}
                {/*>*/}
                {/*  <HorizontalView*/}
                {/*    colorName="transparent"*/}
                {/*    justifyOption="flex-start"*/}
                {/*  >*/}
                {/*    <ThemedView*/}
                {/*      colorName="transparent"*/}
                {/*      style={{ margin: percentToDP(3), borderRadius: percentToDP(10) }}*/}
                {/*    >*/}
                {/*      <ThemedText textStyleName="big">TODO: Add post</ThemedText>*/}
                {/*    </ThemedView>*/}
                {/*  </HorizontalView>*/}
                {/*  <ThemedView*/}
                {/*    style={{*/}
                {/*      alignSelf: "center",*/}
                {/*      height: 400,*/}
                {/*      marginBottom: percentToDP(5),*/}
                {/*    }}*/}
                {/*  >*/}
                {/*    <Image*/}
                {/*      source={{*/}
                {/*        uri: "https://www.coalitionrc.com/wp-content/uploads/2017/01/placeholder.jpg",*/}
                {/*      }}*/}
                {/*      style={{*/}
                {/*        width: percentToDP(100),*/}
                {/*        height: percentToDP(100),*/}
                {/*      }}*/}
                {/*    />*/}
                {/*  </ThemedView>*/}
                {/*  <ThemedText>Enter Title</ThemedText>*/}
                {/*  <HorizontalView justifyOption="flex-end">*/}
                {/*    <ThemedButton*/}
                {/*      style={{ width: percentToDP(30) }}*/}
                {/*      onPress={() => router.replace("./newPostID")}*/}
                {/*      label="Save"*/}
                {/*    ></ThemedButton>*/}
                {/*  </HorizontalView>*/}
                {/*  <HorizontalView justifyOption="flex-start">*/}
                {/*    <ThemedText*/}
                {/*      style={{ marginRight: percentToDP(5) }}*/}
                {/*      textStyleName="smallBold"*/}
                {/*    >*/}
                {/*      Pets tagged:*/}
                {/*    </ThemedText>*/}
                {/*    <PetAvatar*/}
                {/*      size={11}*/}
                {/*      username="Username"*/}
                {/*      pet="Cutie"*/}
                {/*      doLink={true}*/}
                {/*    />*/}
                {/*  </HorizontalView>*/}
                {/*  {dialogVisible && (*/}
                {/*    <PostReactionPopup onDismiss={() => setDialogVisible(false)} />*/}
                {/*  )}*/}
                {/*</ThemedView>*/}

                {/*<ThemedView*/}
                {/*  colorName="tertiary"*/}
                {/*  style={{ borderRadius: percentToDP(10), margin: percentToDP(4) }}*/}
                {/*/>*/}
            </ThemedScrollView>
        </SafeAreaView>
    );
}
