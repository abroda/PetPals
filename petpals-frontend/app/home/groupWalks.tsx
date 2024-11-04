import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router, useNavigation } from "expo-router";
import {
  ReactElement,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Timeline from "react-native-timeline-flatlist";
import { GroupWalk } from "@/context/WalksContext";
import { testData } from "../walk/event/testData";
import { useWalks } from "@/hooks/useWalks";
import GroupWalksTimelineItem from "@/components/lists/GroupWalksTimelineItem";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { format } from "date-fns";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";

export default function GroupWalksScheduleScreen() {
  const [groupWalksData, setGroupWalksData] = useState();
  const { isProcessing, getGroupWalkList } = useWalks();
  const timelineColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToPD = useWindowDimension("height");

  const asyncAbortController = useRef<AbortController | undefined>(
    new AbortController()
  );

  useEffect(() => {
    asyncAbortController.current = new AbortController();
    getData().then((data) => setGroupWalksData(data));

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = async () => {
    let result = await getGroupWalkList(
      "joined",
      [],
      asyncAbortController.current
    );

    if (result.success) {
      return result.returnValue;
    } else {
      return;
    }
  };

  const getThisWeekData = (groupWalks: GroupWalk[]) => {
    const now = new Date();
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      let day = new Date(now.getTime() + i * 24 * 60 * 60 * 1000);
      return {
        time: day.toString(),
        datetime: day,
        description: groupWalks.filter(
          (walk) =>
            walk.datetime.toString().slice(0, 10) ===
            day.toString().slice(0, 10)
        ),
      };
    });
  };

  const getFollowingWeeksData = (groupWalks: GroupWalk[]) => {
    let buckets = groupWalks.reduce(
      (buckets: Record<string, GroupWalk[]>, walk: GroupWalk) => {
        let date = format(walk.datetime, "dd.MM.yyyy");
        if (!buckets[date]) {
          buckets[date] = [];
        }
        buckets[date].push(walk);
        return buckets;
      },
      {}
    );

    return Object.entries(buckets).map(([date, groupWalks]) => ({
      time: date,
      datetime: groupWalks[0].datetime,
      description: groupWalks,
    }));
  };

  return (
    <SafeAreaView>
      <ThemedView
        colorName="background"
        style={{
          height: heightPercentToPD(100),
          paddingTop: percentToDP(5),
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "veryBig", weight: "bold" }}
          backgroundColorName="transparent"
          style={{
            paddingHorizontal: percentToDP(4),
            marginBottom: percentToDP(5),
          }}
        >
          Group walks schedule
        </ThemedText>
        {isProcessing && (
          <ThemedLoadingIndicator
            size="large"
            fullScreen={true}
            message="Loading..."
          />
        )}
        {!isProcessing && (
          <ThemedScrollView
            style={{
              paddingHorizontal: percentToDP(4),
            }}
          >
            <HorizontalView>
              <ThemedText
                textStyleOptions={{ size: "big" }}
                backgroundColorName="transparent"
                style={{ marginBottom: percentToDP(5) }}
              >
                This week
              </ThemedText>
              <ThemedButton
                textStyleOptions={{ size: "small" }}
                backgroundColorName="transparent"
                border
                shape="short"
                label="Join a walk"
                iconName={"arrow-forward"}
                iconOnRight={true}
                onPress={() => router.push("/walk/event/find" as Href<string>)}
                style={{
                  marginBottom: percentToDP(2),
                  width: percentToDP(30),
                }}
              ></ThemedButton>
            </HorizontalView>
            <Timeline
              style={{
                flex: 1,
                marginTop: percentToDP(2),
                marginBottom: percentToDP(5),
                marginLeft: percentToDP(-15),
              }}
              circleColor={timelineColor}
              lineColor={timelineColor}
              renderDetail={(rowData, sectionID, rowID) => (
                <GroupWalksTimelineItem
                  date={rowData.datetime}
                  groupWalks={rowData.description}
                  today={new Date()}
                />
              )}
              timeContainerStyle={{ maxWidth: 0 }}
              data={getThisWeekData(groupWalksData ?? testData)}
              isUsingFlatlist={false}
            />
            <ThemedText
              textStyleOptions={{ size: "big" }}
              backgroundColorName="transparent"
              style={{ marginBottom: percentToDP(5) }}
            >
              Following weeks
            </ThemedText>
            <Timeline
              style={{
                flex: 1,
                marginTop: percentToDP(2),
                marginBottom: percentToDP(20),
                marginLeft: percentToDP(-15),
              }}
              circleColor={timelineColor}
              lineColor={timelineColor}
              renderDetail={(rowData, sectionID, rowID) => (
                <GroupWalksTimelineItem
                  date={rowData.datetime}
                  groupWalks={rowData.description}
                />
              )}
              timeContainerStyle={{ maxWidth: 0 }}
              data={getFollowingWeeksData(groupWalksData ?? testData)}
              isUsingFlatlist={false}
            />
          </ThemedScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
