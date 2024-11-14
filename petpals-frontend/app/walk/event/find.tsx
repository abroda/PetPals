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

export default function FindGroupWalkScreen() {
  const [groupWalksData, setGroupWalksData] = useState<
    GroupWalk[] | undefined
  >();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [filter, setFilter] = useState([] as GroupWalkTag[]);
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
      headerTitle: "Find group walks",
      headerShown: true,
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
            {groupWalksData?.length ?? testData.length} result(s)
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
            fullScreen={true}
            message="Loading..."
          />
        )}
        {!isProcessing && (
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
            data={splitByDay(groupWalksData ?? testData)}
            isUsingFlatlist={false}
          />
        )}
      </ThemedScrollView>
    </SafeAreaView>
  );
}
