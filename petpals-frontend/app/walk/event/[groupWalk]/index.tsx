import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { Href, router } from "expo-router";
import Comment from "@/components/display/Comment";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { SafeAreaView } from "react-native-safe-area-context";
import CommentSection from "@/components/lists/CommentSection";
import { useEffect, useState } from "react";
import { testComments, testData, testParticipants } from "../testData";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import UserAvatar from "@/components/navigation/UserAvatar";
import { useAuth } from "@/hooks/useAuth";
import { ThemedView } from "@/components/basic/containers/ThemedView";

export default function GroupWalkScreen({ walkId }: { walkId: string }) {
  const [groupWalkInfo, setGroupWalkInfo] = useState(testData[0]);
  const [comments, setComments] = useState(testComments);
  const [participants, setParticipants] = useState(testParticipants);
  const { userId } = useAuth();

  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToPD = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  useEffect(() => {
    // TODO: pull data
  }, []);
  return (
    <SafeAreaView>
      <ThemedScrollView
        style={{
          height: heightPercentToPD(100),
          paddingTop: percentToPD(15),
          paddingHorizontal: percentToPD(5),
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "veryBig", weight: "bold" }}
          style={{ marginBottom: percentToPD(1) }}
        >
          {groupWalkInfo.title}
        </ThemedText>
        <ThemedText
          textStyleOptions={{ size: "small" }}
          textColorName="primary"
          style={{ marginBottom: percentToPD(4) }}
        >
          {groupWalkInfo.datetime.toDateString()}
        </ThemedText>
        <ThemedText textStyleOptions={{ weight: "semibold" }}>
          Description
        </ThemedText>
        <ThemedText style={{ marginBottom: percentToPD(4) }}>
          {groupWalkInfo.description}
        </ThemedText>
        <ThemedView
          colorName="transparent"
          style={{
            flex: 1,
          }}
        >
          <ThemedView
            colorName="primary"
            style={{
              height: percentToPD(1),
              borderRadius: percentToPD(10),
              marginTop: percentToPD(2),
              marginBottom: percentToPD(3),
            }}
          />
          {/* UNDER DIVIDER: LOCATION */}
          <HorizontalView
            justifyOption="flex-start"
            colorName="transparent"
            style={{ marginBottom: percentToPD(5) }}
          >
            <ThemedIcon
              size={22}
              style={{ marginLeft: percentToPD(-0.7) }}
              name="location"
            />
            <ThemedText
              textStyleOptions={{ size: "small" }}
              backgroundColorName="transparent"
              numberOfLines={1}
              style={{
                paddingLeft: percentToPD(1),
                paddingRight: percentToPD(2),
              }}
            >
              {groupWalkInfo.location}
            </ThemedText>
          </HorizontalView>
          <ThemedView
            colorName="disabled"
            style={{
              height: percentToPD(40),
              alignItems: "center",
              justifyContent: "center",
              marginBottom: percentToPD(5),
            }}
          >
            <ThemedText backgroundColorName="transparent">TODO: map</ThemedText>
          </ThemedView>
        </ThemedView>
        <ThemedView style={{ marginBottom: percentToPD(5) }}>
          {groupWalkInfo.creator.id !== userId && (
            <ThemedButton
              style={{ width: percentToPD(30), alignSelf: "flex-end" }}
              label="Join"
              backgroundColorName="link"
              onPress={() => router.push("./join/" as Href<string>)}
            ></ThemedButton>
          )}
          {groupWalkInfo.creator.id === userId && (
            <ThemedButton
              style={{ width: percentToPD(30), alignSelf: "flex-end" }}
              label="Edit"
              backgroundColorName="link"
              onPress={() => router.push("./edit/" as Href<string>)}
            ></ThemedButton>
          )}
        </ThemedView>
        <ThemedText
          textStyleOptions={{ weight: "bold" }}
          style={{ marginBottom: percentToPD(3) }}
        >
          Partcipants
        </ThemedText>
        <HorizontalView style={{ marginBottom: percentToPD(10) }}>
          <HorizontalView justifyOption="flex-start">
            {participants.slice(0, 5).map((user) => (
              <UserAvatar
                userId={user.id}
                size={10}
                doLink={true}
              />
            ))}
            <ThemedText style={{ marginLeft: percentToPD(2) }}>
              {participants.length > 5
                ? `+${participants.length - 5} more`
                : ""}
            </ThemedText>
          </HorizontalView>
          <ThemedIcon
            colorName="text"
            name="chevron-forward-outline"
            onPress={() => {}}
          />
        </HorizontalView>
        <CommentSection commentsData={comments} />
      </ThemedScrollView>
    </SafeAreaView>
  );
}
