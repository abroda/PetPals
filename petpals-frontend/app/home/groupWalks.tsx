import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { Href, router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import Timeline from "react-native-timeline-flatlist";
import { GroupWalk } from "@/context/GroupWalksContext";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import GroupWalksTimelineItem from "@/components/lists/GroupWalksTimelineItem";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { format } from "date-fns";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { RefreshControl } from "react-native-gesture-handler";
import Toast from "react-native-ui-lib/src/incubator/toast";
import ThemedToast from "@/components/popups/ThemedToast";

export default function GroupWalksScheduleScreen() {
  const now = new Date();
  const today = now.valueOf() - (now.valueOf() % (24 * 3600 * 1000));
  const weekLimit = today + 7 * 24 * 3600 * 1000;

  const { getGroupWalks } = useGroupWalks();

  const [groupWalks, setGroupWalks] = useState<GroupWalk[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>(
    new AbortController()
  );

  const [refreshOnFocus, setRefreshOnFocus] = useState(false);

  const timelineColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  useEffect(() => {
    if (!groupWalks) {
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  useFocusEffect(() => {
    if (refreshOnFocus && !isLoading) {
      getData();
      setRefreshOnFocus(false);
    }

    return () => {
      setRefreshOnFocus(!isLoading);
    };
  });

  const getData = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage("");
    asyncAbortController.current = new AbortController();

    // let result = await getGroupWalks(
    //   // get walks created by user
    //   "created",
    //   asyncAbortController.current
    // );

    // if (result.success) {
    //   let walks = result.returnValue as GroupWalk[];

    let result = await getGroupWalks(
      // get walks joined by user
      "joined",
      asyncAbortController.current
    );

    if (result.success) {
      let newWalks = result.returnValue as GroupWalk[]; //walks.concat(result.returnValue as GroupWalk[]);

      // newWalks.sort(
      //   (a, b) =>
      //     new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
      // );

      setGroupWalks(newWalks);
    } else {
      setErrorMessage(result.returnValue);
    }
    // } else {
    //   setErrorMessage(result.returnValue);
    // }

    setIsLoading(false);
  }, [groupWalks]);

  // separate walk for current week into buckets, one for each day (even if empty)
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

  // separate walks into buckets by day (only for exisiting)
  const getFollowingWeeksData = (groupWalks: GroupWalk[]) => {
    let buckets = groupWalks.reduce(
      (buckets: Record<string, GroupWalk[]>, walk: GroupWalk) => {
        if (walk.datetime.valueOf() > weekLimit) {
          let date = walk.datetime.toLocaleDateString(undefined, {
            dateStyle: "short",
          });
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
    groupWalks ?? [] // testData.filter((elem) => elem.joinedWithPets.length > 0)
  );
  let followingWeeks = getFollowingWeeksData(
    groupWalks ?? [] //testData.filter((elem) => elem.joinedWithPets.length > 0)
  );

  return (
    <SafeAreaView>
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0}
        message={errorMessage} // {"Check your internet connection."}
        preset="offline"
        aboveTabBar
      />
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

        <ThemedScrollView
          style={{
            paddingHorizontal: percentToDP(4),
            marginTop: percentToDP(5),
          }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={getData}
              colors={[useThemeColor("accent"), useThemeColor("text")]}
            />
          }
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
          {groupWalks === null && !isLoading && (
            <ThemedView
              style={{
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: heightPercentToDP(35),
                margin: "auto",
              }}
            >
              <ThemedIcon
                name="alert-circle-outline"
                colorName="disabled"
                size={percentToDP(12)}
              />

              <ThemedText
                textStyleOptions={{ size: "big" }}
                textColorName="disabled"
                style={{ alignSelf: "center", marginTop: percentToDP(3) }}
              >
                Unable to load schedule
              </ThemedText>
            </ThemedView>
          )}
          {groupWalks !== null && (
            <>
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
                }
                isUsingFlatlist={false}
              />
            </>
          )}
        </ThemedScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}
