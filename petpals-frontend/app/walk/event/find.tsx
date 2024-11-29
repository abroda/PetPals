import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { Href, router, useFocusEffect, useNavigation } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import Timeline from "react-native-timeline-flatlist";
import {
  GroupWalk,
  GroupWalkTag,
  PagedGroupWalks,
} from "@/context/WalksContext";
import { useWalks } from "@/hooks/useWalks";
import HorizontalView from "@/components/basic/containers/HorizontalView";
import GroupWalksTimelineItem from "@/components/lists/GroupWalksTimelineItem";
import ThemedLoadingIndicator from "@/components/decorations/animated/ThemedLoadingIndicator";
import { format } from "date-fns";
import FilterTagsDialog from "@/components/dialogs/FilterTagsDialog";
import { RefreshControl } from "react-native-gesture-handler";
import { Toast } from "react-native-ui-lib/src/incubator";
import ThemedToast from "@/components/popups/ThemedToast";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { View } from "react-native-ui-lib";
import { widthPercentageToDP } from "react-native-responsive-screen";

const elementsOnPage = 15;

export default function FindGroupWalkScreen(props: {
  initialFilter?: GroupWalkTag[];
}) {
  const now = new Date();
  const today = now.valueOf() - (now.valueOf() % (24 * 3600 * 1000));
  const weekLimit = today + 7 * 24 * 3600 * 1000;

  const { findGroupWalks, shouldRefreshFound } = useWalks();

  const [foundGroupWalks, setFoundGroupWalks] =
    useState<PagedGroupWalks | null>(null);
  const [tagFilter, setTagFilter] = useState(
    props.initialFilter ? props.initialFilter : ([] as GroupWalkTag[])
  );
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);

  const asyncAbortController = useRef<AbortController | undefined>();

  const timelineColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");

  useEffect(() => {
    if (shouldRefreshFound || !foundGroupWalks) {
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = async (page?: number, newFilter?: GroupWalkTag[]) => {
    setIsLoading(true);
    setErrorMessage("");

    let pageNumber = page ?? foundGroupWalks?.page.number ?? 0;
    let filter = newFilter ?? tagFilter;
    asyncAbortController.current = new AbortController();

    let result = await findGroupWalks(
      filter,
      page ?? foundGroupWalks?.page.number ?? 0,
      elementsOnPage,
      asyncAbortController.current
    );

    if (result.success) {
      if (pageNumber === 0) {
        setFoundGroupWalks(result.returnValue as PagedGroupWalks);
      } else {
        let updated = result.returnValue as PagedGroupWalks;
        updated.content = [
          ...(foundGroupWalks?.content ?? []),
          ...updated.content,
        ];

        setFoundGroupWalks(updated);
      }
    } else {
      setErrorMessage(result.returnValue);
    }
    setIsLoading(false);
  };

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
      {} as Record<string, GroupWalk[]>
    );

    let result = Object.entries(buckets).map(([date, groupWalks]) => ({
      time: date,
      datetime: new Date(groupWalks[0].datetime),
      description: groupWalks,
    }));

    return result;
  };

  return (
    <SafeAreaView>
      {dialogVisible && (
        <FilterTagsDialog
          onDismiss={() => setDialogVisible(false)}
          onSubmit={(tags) => {
            setTagFilter(tags);
            getData(0, tags);
          }}
          filter={tagFilter}
        />
      )}
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0}
        message={errorMessage} // {"Check your internet connection."}
        preset="offline"
      />
      <ThemedScrollView
        colorName="background"
        style={{
          height: heightPercentToDP(100),
          width: widthPercentageToDP(100),
          paddingHorizontal: percentToDP(4),
          paddingTop: heightPercentToDP(8),
        }}
        scrollEnabled={false}
      >
        <HorizontalView
          colorName="transparent"
          style={{ marginLeft: percentToDP(1.5), marginBottom: percentToDP(6) }}
        >
          <ThemedText
            backgroundColorName="transparent"
            textStyleOptions={{ size: "medium" }}
            style={{ marginBottom: percentToDP(4) }}
          >
            {foundGroupWalks
              ? `${foundGroupWalks.page.totalElements} result(s)`
              : "-"}
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
        <ThemedScrollView
          scrollEnabled={true}
          style={{ height: heightPercentToDP(84) }}
          refreshControl={
            <RefreshControl
              refreshing={isLoading}
              onRefresh={() => getData(0)}
              colors={[useThemeColor("accent"), useThemeColor("text")]}
            />
          }
        >
          {foundGroupWalks === null && (
            <ThemedView
              style={{
                alignSelf: "center",
                alignItems: "center",
                alignContent: "center",
                marginTop: heightPercentToDP(35),
                margin: "auto",
              }}
            >
              {!isLoading && (
                <>
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
                    Unable to load search results
                  </ThemedText>
                </>
              )}
            </ThemedView>
          )}

          {foundGroupWalks !== null && (
            <>
              {foundGroupWalks.content.length == 0 && (
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
              {foundGroupWalks.content.length > 0 && (
                <View style={{ marginBottom: percentToDP(10) }}>
                  <Timeline
                    style={{
                      marginLeft: percentToDP(-14),
                      paddingTop: percentToDP(1),
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
                    data={splitByDay(foundGroupWalks?.content ?? [])}
                    isUsingFlatlist={false}
                  />
                  {foundGroupWalks.page.totalPages >
                    foundGroupWalks.page.number + 1 && (
                    <ThemedButton
                      shape="short"
                      label="Load more"
                      textStyleOptions={{ size: "small" }}
                      iconOnRight
                      iconName="chevron-down-outline"
                      textColorName="link"
                      backgroundColorName="background"
                      border
                      onPress={() => getData(foundGroupWalks.page.number + 1)}
                      style={{ width: percentToDP(30), alignSelf: "center" }}
                    />
                  )}
                </View>
              )}
            </>
          )}
        </ThemedScrollView>
      </ThemedScrollView>
    </SafeAreaView>
  );
}
