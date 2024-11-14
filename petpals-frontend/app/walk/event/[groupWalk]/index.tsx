import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router, useNavigation } from "expo-router";
import Comment from "@/components/display/Comment";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentSection from "@/components/lists/CommentSection";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { testComments, testData, testParticipants } from "../testData";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import PetAvatar from "@/components/navigation/PetAvatar";
import { useWalks } from "@/hooks/useWalks";
import TagList from "@/components/lists/TagList";
import { GroupWalkTag } from "@/context/WalksContext";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { LocationMap } from "@/components/display/LocationMap";

export default function GroupWalkScreen({ walkId }: { walkId: string }) {
  const [groupWalkInfo, setGroupWalkInfo] = useState(testData[0]);
  const [comments, setComments] = useState(testComments);
  const [participants, setParticipants] = useState(testParticipants);
  const { isProcessing, getGroupWalkList, shouldRefresh } = useWalks();
  const { userId } = useAuth();

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | undefined>();

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, [shouldRefresh]);

  const getData = useCallback(async () => {
    console.log("Start loading");
    asyncAbortController.current = new AbortController();
    let result = await getGroupWalkList(
      "all",
      [],
      asyncAbortController.current
    );

    if (result.success) {
      setGroupWalksData(result.returnValue);
    }
    console.log("Stop loading");
  }, []);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Group walk details",
      headerShown: true,
    });
  }, [navigation]);

  return (
    <SafeAreaView>
      <ThemedScrollView
        scrollEnabled={true}
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(20),
          paddingHorizontal: percentToDP(5),
        }}
      >
        <ThemedView
          colorName="transparent"
          style={{
            flex: 1,
            marginBottom: percentToDP(7),
          }}
        >
          <LocationMap
            initialLocation={{ latitude: 51.1316313, longitude: 17.0417013 }}
            mapProps={{
              pitchEnabled: false,
              rotateEnabled: false,
            }}
            viewStyle={{
              height: heightPercentToDP(30),
              alignItems: "center",
              justifyContent: "center",
              marginBottom: percentToDP(3),
              borderRadius: percentToDP(7),
            }}
          />
        </ThemedView>
        <ThemedText
          textStyleOptions={{ size: "veryBig", weight: "semibold" }}
          style={{ marginBottom: percentToDP(4) }}
        >
          {groupWalkInfo.title}
        </ThemedText>
        <HorizontalView style={{ marginBottom: percentToDP(6) }}>
          <HorizontalView justifyOption="flex-start">
            <UserAvatar
              userId={groupWalkInfo.creator.id}
              size={12}
              doLink={true}
            />
            <ThemedView>
              <ThemedText textStyleOptions={{ size: "small", weight: "bold" }}>
                {groupWalkInfo.creator.name}
              </ThemedText>
              <ThemedText textStyleOptions={{ size: "tiny" }}>
                # dogs | # friends
              </ThemedText>
            </ThemedView>
          </HorizontalView>
          <ThemedText
            textStyleOptions={{ size: "medium", weight: "semibold" }}
            textColorName="primary"
          >
            {groupWalkInfo.datetime.toLocaleDateString(undefined, {
              dateStyle: "medium",
            })}
            ,{" "}
            {groupWalkInfo.datetime.toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </ThemedText>
        </HorizontalView>
        <ThemedText
          textStyleOptions={{ weight: "semibold" }}
          style={{ marginBottom: percentToDP(2) }}
        >
          Description
        </ThemedText>
        <ThemedText style={{ marginBottom: percentToDP(7) }}>
          {groupWalkInfo.description}
        </ThemedText>

        <TagList
          tags={groupWalkInfo.tags}
          style={{ marginBottom: percentToDP(12) }}
        />

        <ThemedView style={{ marginBottom: percentToDP(8) }}>
          {groupWalkInfo.creator.id !== userId &&
            (participants.map((elem) => elem.id).includes(userId ?? "") ? (
              <ThemedButton
                label="Joined"
                iconSource={() => (
                  <ThemedIcon
                    name="checkmark-done-circle"
                    colorName="textOnPrimary"
                    style={{ marginLeft: percentToDP(1) }}
                    onPress={() => router.push("./join/" as Href<string>)}
                  />
                )}
                iconOnRight
              />
            ) : (
              <ThemedButton
                label="Join"
                onPress={() => router.push("./join/" as Href<string>)}
              />
            ))}
          {groupWalkInfo.creator.id === userId && (
            <ThemedButton
              shape="long"
              label="Edit"
              backgroundColorName="link"
              iconSource={() => (
                <ThemedIcon
                  name="pencil"
                  colorName="textOnPrimary"
                  style={{ marginLeft: percentToDP(1) }}
                  onPress={() => router.push("./join/" as Href<string>)}
                />
              )}
              iconOnRight
              onPress={() => router.push("./edit/" as Href<string>)}
            />
          )}
        </ThemedView>
        <ThemedView style={{ marginBottom: percentToDP(8) }}>
          <ThemedText
            textStyleOptions={{ weight: "semibold" }}
            style={{ marginBottom: percentToDP(3) }}
          >
            Partcipants
          </ThemedText>
          <HorizontalView>
            <HorizontalView justifyOption="flex-start">
              {participants.slice(0, 5).map((user) => (
                <UserAvatar
                  userId={user.id}
                  size={10}
                  doLink={true}
                />
              ))}
              <ThemedText style={{ marginLeft: percentToDP(2) }}>
                {participants.length > 5
                  ? `+${participants.length - 5} more`
                  : ""}
              </ThemedText>
            </HorizontalView>
            <ThemedIcon
              colorName="text"
              name="chevron-forward-outline"
              onPress={() => {
                router.push("./participants");
              }}
            />
          </HorizontalView>
        </ThemedView>
        <CommentSection commentsData={comments} />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
function setGroupWalksData(returnValue: any) {
  throw new Error("Function not implemented.");
}
