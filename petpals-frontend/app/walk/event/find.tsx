import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/useWindowDimension";
import { Href, router, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Timeline from "react-native-timeline-flatlist";
import { GroupWalk, GroupWalkTag } from "@/context/WalksContext";
import { testData } from "./testData";
import { useWalks } from "@/hooks/useWalks";
import GroupWalkListItem from "@/components/display/GroupWalkListItem";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import GroupWalksTimelineItem from "@/components/lists/GroupWalksTimelineItem";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { format } from "date-fns";
import FilterTagsDialog from "@/components/dialogs/FilterTagsDialog";

export default function FindGroupWalkScreen(props: {
  initialFilter?: GroupWalkTag[];
}) {
  const now = new Date();
  const today = now.valueOf() - (now.valueOf() % (24 * 3600 * 1000));
  const weekLimit = today + 7 * 24 * 3600 * 1000;

  const [groupWalksData, setGroupWalksData] = useState<
    GroupWalk[] | undefined
  >();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [filter, setFilter] = useState(
    props.initialFilter ? props.initialFilter : ([] as GroupWalkTag[])
  );
  const { isProcessing, getGroupWalkList, shouldRefresh } = useWalks();

  const timelineColor = useThemeColor("text");
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
    asyncAbortController.current = new AbortController();

    let result = await getGroupWalkList(
      "all",
      [],
      asyncAbortController.current
    );

    if (result.success) {
      setGroupWalksData(result.returnValue);
    }
  }, []);

  const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "Find group walks",
      headerShown: true,
      animation: "none",
    });
  }, [navigation]);

  const splitByDay = (groupWalks: GroupWalk[]) => {
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

  let walks = splitByDay(groupWalksData ?? testData);

  return (
    <SafeAreaView>
      {dialogVisible && (
        <FilterTagsDialog
          onDismiss={() => setDialogVisible(false)}
          onSubmit={(tags) => setFilter(tags)}
          filter={filter}
        />
      )}
      <ThemedScrollView
        colorName="background"
        style={{
          height: heightPercentToDP(100),
          paddingHorizontal: percentToDP(4),
          paddingTop: percentToDP(15),
        }}
      >
        <HorizontalView
          colorName="transparent"
          style={{ marginLeft: percentToDP(1.5) }}
        >
          <ThemedText
            backgroundColorName="transparent"
            textStyleOptions={{ size: "medium" }}
            style={{ marginBottom: percentToDP(4) }}
          >
            {`${walks.length} result(s)`}
          </ThemedText>
          <HorizontalView justifyOption="flex-end">
            <ThemedButton
              textStyleOptions={{ size: "small" }}
              textColorName="link"
              backgroundColorName="transparent"
              border
              shape="short"
              label="Create"
              iconName="pencil"
              iconOnRight={true}
              onPress={() => router.push("/walk/event/new" as Href<string>)}
              style={{ marginRight: percentToDP(2) }}
            />
            <ThemedButton
              textStyleOptions={{ size: "small" }}
              textColorName="primary"
              backgroundColorName="transparent"
              border
              shape="short"
              label="Filter"
              iconName="options"
              iconOnRight={true}
              onPress={() => setDialogVisible(true)}
            />
          </HorizontalView>
        </HorizontalView>
        {isProcessing && (
          <ThemedLoadingIndicator
            size="large"
            fullScreen
            message="Loading..."
          />
        )}
        {!isProcessing && walks.length == 0 && (
          <ThemedText
            style={{
              alignSelf: "center",
              textAlign: "center",
              marginTop: heightPercentToDP(35),
            }}
            textColorName="disabled"
          >
            No results based on {"\n"}current search parameters.
          </ThemedText>
        )}
        {!isProcessing && walks.length > 0 && (
          <Timeline
            style={{
              flex: 1,
              marginTop: percentToDP(2),
              marginBottom: percentToDP(20),
              marginLeft: percentToDP(-14),
            }}
            circleColor={timelineColor}
            lineColor={timelineColor}
            renderDetail={(rowData, sectionID, rowID) => (
              <GroupWalksTimelineItem
                date={rowData.datetime}
                groupWalks={rowData.description}
                today={now}
                thisWeek={rowData.datetime.valueOf() <= weekLimit}
                markJoined
                markCreated
              />
            )}
            timeContainerStyle={{ maxWidth: 0 }}
            data={walks}
            isUsingFlatlist={false}
          />
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
