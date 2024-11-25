import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router, useNavigation } from "expo-router";
import {
  ReactElement,
  useCallback,
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
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";

export default function GroupWalksScheduleScreen() {
  const now = new Date();
  const today = now.valueOf() - (now.valueOf() % (24 * 3600 * 1000));
  const weekLimit = today + 7 * 24 * 3600 * 1000;

  const [groupWalksData, setGroupWalksData] = useState(null);

  const timelineColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const { getGroupWalkList, shouldRefresh } = useWalks();

  const asyncAbortController = useRef<AbortController | undefined>(
    new AbortController()
  );

  useEffect(() => {
    if (shouldRefresh || !groupWalksData) {
      setIsLoading(true);
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, [shouldRefresh]);

  const getData = useCallback(async () => {
    asyncAbortController.current = new AbortController();

    let result = await getGroupWalkList(
      "joined",
      [],
      asyncAbortController.current
    );

    if (result.success) {
      setGroupWalksData(result.returnValue);
    } else {
      setErrorMessage(result.returnValue);
    }

    setIsLoading(false);
  }, [groupWalksData]);

  const getThisWeekData = (groupWalks: GroupWalk[]) => {
    return [0, 1, 2, 3, 4, 5, 6].map((i) => {
      let day = new Date(today + i * 24 * 3600 * 1000);
      return {
        time: day.toLocaleDateString(undefined, { dateStyle: "short" }),
        datetime: day,
        description: groupWalks.filter(
          (walk) =>
            format(walk.datetime, "dd.MM.yyyy") === format(day, "dd.MM.yyyy")
        ),
      };
    });
  };

  const getFollowingWeeksData = (groupWalks: GroupWalk[]) => {
    let buckets = groupWalks.reduce(
      (buckets: Record<string, GroupWalk[]>, walk: GroupWalk) => {
        if (walk.datetime.valueOf() > weekLimit) {
          let date = walk.datetime.toLocaleDateString(undefined, {
            dateStyle: "medium",
          });
          //format(walk.datetime, "dd.MM.yyyy");
          if (!buckets[date]) {
            buckets[date] = [];
          }
          buckets[date].push(walk);
        }
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

  let thisWeek = getThisWeekData(
    groupWalksData ?? testData.filter((elem) => elem.joinedWithPets.length > 0)
  );
  let followingWeeks = getFollowingWeeksData(
    groupWalksData ?? testData.filter((elem) => elem.joinedWithPets.length > 0)
  );

  return (
    <SafeAreaView>
      <ThemedView
        colorName="background"
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(5),
          paddingBottom: percentToDP(12),
        }}
      >
        <ThemedText
          textStyleOptions={{ size: "veryBig", weight: "bold" }}
          backgroundColorName="transparent"
          style={{
            paddingHorizontal: percentToDP(4),
          }}
        >
          Group walks schedule
        </ThemedText>
        {isLoading && (
          <ThemedLoadingIndicator
            size="large"
            fullScreen
            message="Loading..."
          />
        )}
        {!isLoading && groupWalksData !== null && (
          <ThemedView
            style={{
              alignSelf: "center",
              alignItems: "center",
              margin: "auto",
            }}
          >
            <ThemedIcon
              name="close-circle-outline"
              colorName="disabled"
              size={percentToDP(12)}
            />
            <ThemedText
              textStyleOptions={{ size: "big" }}
              textColorName="disabled"
              style={{ alignSelf: "center", marginTop: percentToDP(3) }}
            >
              {errorMessage ?? "Network error"}
            </ThemedText>
          </ThemedView>
        )}
        {!isLoading && groupWalksData === null && (
          <ThemedScrollView
            style={{
              paddingHorizontal: percentToDP(4),
              marginTop: percentToDP(5),
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
                textColorName="link"
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
                marginLeft: percentToDP(-14),
              }}
              circleColor={timelineColor}
              lineColor={timelineColor}
              renderDetail={(rowData, sectionID, rowID) => (
                <GroupWalksTimelineItem
                  date={rowData.datetime}
                  groupWalks={rowData.description}
                  today={new Date()}
                  markCreated
                  thisWeek
                />
              )}
              timeContainerStyle={{ maxWidth: 0 }}
              data={thisWeek}
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
                marginBottom: percentToDP(5),
                marginLeft: percentToDP(-14),
              }}
              circleColor={timelineColor}
              lineColor={timelineColor}
              renderDetail={(rowData, sectionID, rowID) => (
                <GroupWalksTimelineItem
                  date={rowData.datetime}
                  groupWalks={rowData.description}
                  today={now}
                />
              )}
              timeContainerStyle={{ maxWidth: 0 }}
              data={
                followingWeeks.length > 0
                  ? followingWeeks
                  : [
                      {
                        time: "",
                        datetime: "",
                        description: [],
                      },
                    ]
              } //?? testData)}
              isUsingFlatlist={false}
            />
          </ThemedScrollView>
        )}
      </ThemedView>
    </SafeAreaView>
  );
}
