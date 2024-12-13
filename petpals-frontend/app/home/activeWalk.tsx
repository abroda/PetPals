import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { MainMap } from "@/components/display/MainMap";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ThemedToast from "@/components/popups/ThemedToast";
import { Dog } from "@/context/DogContext";
import { GroupWalk } from "@/context/GroupWalksContext";
import { MarkerData } from "@/context/RecordWalkContext";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useAuth } from "@/hooks/useAuth";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { useRecordWalk } from "@/hooks/useRecordWalk";
import { Href, router, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import PetAvatar from "@/components/navigation/PetAvatar";
import StartWalkDialog from "@/components/dialogs/StartWalkDialog";
import EndWalkDialog from "@/components/dialogs/EndWalkDialog";
import {
  averageSpeedToString,
  caloriesBurnedToString,
  totalDistanceToString,
  totalTimeToString,
} from "@/helpers/recordWalkCounters";
import { useThemeColor } from "@/hooks/theme/useThemeColor";

export default function ActiveWalkScreen() {
  const walkId = useLocalSearchParams().walkId as string | undefined;

  const {
    permissionsGranted,
    isRecording,
    summaryVisible,
    firstTimeout,
    secondTimeout,
    dogsParticipating,
    visibilityMode,
    groupWalk,
    userLocation,
    walkStartTime,
    walkTotalTime,
    walkDistance,
    walkPath,
    nearbyUsers,
    otherParticipants,
    checkLocationPermissions,
    getOngoingGroupWalks,
    startWalk,
    endWalk,
    reset,
    delayTimeout,
    updateGroupWalkData,
  } = useRecordWalk();
  const { getGroupWalk, getUsersDogs } = useGroupWalks();
  const { userId } = useAuth();

  const [ongoingGroupWalks, setOngoingGroupWalks] = useState<GroupWalk[]>([]);
  const [dogs, setDogs] = useState([] as Dog[]);

  const [startDialogVisible, setStartDialogVisible] = useState(false);
  const [endDialogVisible, setEndDialogVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>();

  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const widthPercentToDP = useWindowDimension("width");

  const groupWalkPinColor = "#54c40f"; // useThemeColor("secondary");

  // on mount
  useEffect(() => {
    checkLocationPermissions();

    if (isRecording || summaryVisible) {
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  // on focus
  // useFocusEffect(() => {
  //   if (refreshOnFocus && !isLoading) {
  //     // checkLocationPermissions(); // check permissions -> if not -> show error message
  //     // getData(); // refresh dog/walk data
  //     // setRefreshOnFocus(false);
  //   }

  //   return () => {
  //     setRefreshOnFocus(!isLoading);
  //   };
  // });

  const getData = async () => {
    console.log("get data (dogs)");
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let result = await getUsersDogs();

    if (result.success) {
      let dogs = result.returnValue as Dog[];
      setDogs(dogs);

      // if recording a group walk, refresh only relevant walk
      if (isRecording && groupWalk) {
        console.log("get data (single walk)");
        asyncAbortController.current = new AbortController();

        result = await getGroupWalk(groupWalk.id, asyncAbortController.current);

        if (result.success) {
          let walk = result.returnValue as GroupWalk;
          updateGroupWalkData(walk);
        } else {
          setErrorMessage(result.returnValue);
        }
      } else if (!isRecording) {
        // if not recording, get the list of available walks
        console.log("get data (available walks)");
        asyncAbortController.current = new AbortController();

        result = await getOngoingGroupWalks(asyncAbortController.current);

        if (result.success) {
          let walks = result.returnValue as GroupWalk[];

          setOngoingGroupWalks(walks);
        } else {
          setErrorMessage(result.returnValue);
        }
      }
    } else {
      setErrorMessage(result.returnValue);
    }

    setIsLoading(false);
  };

  return (
    <SafeAreaView>
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0 && !summaryVisible}
        message={errorMessage} // {"Check your internet connection."}
        preset="offline"
        aboveTabBar
      />
      <ThemedToast
        visible={!permissionsGranted && !summaryVisible}
        message={"Location permissions were denied."}
        preset="failure"
        aboveTabBar
      />
      <ThemedScrollView
        style={{
          height: heightPercentToDP(100),
          paddingTop: percentToDP(5),
          paddingBottom: percentToDP(5),
        }}
      >
        {/* HEADER */}
        <ThemedText
          textStyleOptions={{ size: "big", weight: "bold" }}
          textColorName="primary"
          backgroundColorName="transparent"
          style={{
            paddingHorizontal: percentToDP(4),
            marginBottom: percentToDP(4),
          }}
        >
          {isRecording
            ? "Recording walk"
            : summaryVisible
              ? "Walk summary"
              : "Start walking"}
        </ThemedText>
        {/* WALK TYPE */}
        <HorizontalView style={{ alignContent: "center" }}>
          <ThemedText
            textStyleOptions={{ size: "biggerMedium" }}
            style={{
              marginBottom: percentToDP(3),
              marginHorizontal: percentToDP(4),
            }}
          >
            {!(isRecording || summaryVisible)
              ? 'Press "Start" to begin recording.'
              : groupWalk?.title
                ? `Group walk: ${groupWalk.title}`
                : "Solitary walk"}
          </ThemedText>
          {(isRecording || summaryVisible) && groupWalk?.id && (
            <ThemedIcon
              name="chevron-forward-outline"
              colorName="text"
              onPress={() =>
                router.push(`walk/event/${groupWalk.id}` as Href<String>)
              }
              style={{ marginRight: percentToDP(1) }}
            />
          )}
        </HorizontalView>
        {/* START DATE-TIME */}
        {summaryVisible && walkStartTime && (
          <ThemedText
            textStyleOptions={{ size: "medium", weight: "semibold" }}
            style={{
              marginBottom: percentToDP(3),
              marginHorizontal: percentToDP(4),
            }}
          >
            {new Date(walkStartTime).toLocaleDateString(undefined, {
              dateStyle: "short",
            })}
            {" @ "}
            {new Date(walkStartTime).toLocaleTimeString(undefined, {
              timeStyle: "short",
            })}
          </ThemedText>
        )}
        {/* PETS + VISIBILITY */}
        {(isRecording || summaryVisible) && (
          <HorizontalView
            colorName="transparent"
            style={{
              marginHorizontal: percentToDP(3),
              marginBottom: percentToDP(3),
              zIndex: 1,
            }}
          >
            <HorizontalView
              justifyOption="flex-start"
              colorName="transparent"
            >
              {dogs
                .filter((dog) => dogsParticipating.includes(dog.id))
                .map((dog) => (
                  <ThemedView
                    key={dog.id + "t"}
                    colorName="transparent"
                    style={{
                      marginRight: percentToDP(2),
                    }}
                  >
                    <PetAvatar
                      key={dog.id + "a"}
                      size={10}
                      userId={userId ?? ""}
                      petId={dog.id}
                      toggleEnabled
                      marked={true}
                    />
                    <ThemedText
                      center
                      textStyleOptions={{ size: "tiny" }}
                      style={{
                        marginTop: percentToDP(1),
                        marginLeft: percentToDP(-1),
                      }}
                    >
                      {dog.name}
                    </ThemedText>
                  </ThemedView>
                ))}
            </HorizontalView>
            <ThemedView colorName="secondary">
              <ThemedText style={{ textAlign: "center" }}>
                Visibility
              </ThemedText>
              <ThemedText
                textColorName="primary"
                style={{ textAlign: "center" }}
              >
                {visibilityMode.replace("_", " ")}
              </ThemedText>
            </ThemedView>
          </HorizontalView>
        )}
        {/* MAP */}
        <MainMap
          latitude={userLocation.latitude}
          longitude={userLocation.longitude}
          mapProps={{
            pitchEnabled: false,
            rotateEnabled: true,
          }}
          viewStyle={
            summaryVisible
              ? {
                  height: heightPercentToDP(35),
                  width: widthPercentToDP(94),
                  borderRadius: widthPercentToDP(6),
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: percentToDP(3),
                }
              : {
                  height: heightPercentToDP(isRecording ? 51.5 : 62.1),
                  width: widthPercentToDP(100),
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: percentToDP(-10),
                }
          }
          groupWalkMarker={
            isRecording && groupWalk
              ? ({
                  coordinates: {
                    latitude: groupWalk.latitude,
                    longitude: groupWalk.longitude,
                  },
                  title: "Starting location",
                  description: groupWalk.title,
                  color: groupWalkPinColor,
                } as MarkerData)
              : undefined
          }
          nearbyUsers={nearbyUsers}
          otherParticipants={otherParticipants}
          path={walkPath}
          showingSummary={summaryVisible}
        />
        {/* START/END BUTTON */}
        {!summaryVisible && (
          <ThemedView
            colorName="background"
            style={{
              zIndex: 1,
              width: percentToDP(23),
              height: percentToDP(23),
              borderRadius: percentToDP(23),
              marginTop: percentToDP(-2),
              alignSelf: "center",
            }}
          >
            <ThemedButton
              onPress={() => {
                if (isRecording) {
                  setEndDialogVisible(true);
                } else {
                  setStartDialogVisible(true);
                }
                getData();
              }}
              backgroundColorName={isRecording ? "alarm" : "accent"}
              style={{
                zIndex: 1,
                width: percentToDP(23),
                height: percentToDP(23),
                borderRadius: percentToDP(23),
                marginTop: percentToDP(0),
                alignSelf: "center",
              }}
              iconSource={() => (
                <ThemedIcon
                  size={percentToDP(12)}
                  name={isRecording ? "pause-outline" : "caret-forward-outline"}
                  colorName="text"
                  style={{
                    marginRight: percentToDP(isRecording ? 0 : -1.5),
                    marginTop: percentToDP(isRecording ? 0 : -0.3),
                  }}
                />
              )}
            />
          </ThemedView>
        )}
        {/* COUNTERS */}
        <ThemedView>
          <HorizontalView style={{ marginBottom: percentToDP(1) }}>
            {/* DISTANCE  */}
            <ThemedView
              colorName="secondary"
              style={{
                marginTop: percentToDP(summaryVisible ? 3 : -14),
                marginLeft: percentToDP(4),
                borderRadius: percentToDP(6),
                padding: percentToDP(4),
                paddingLeft: percentToDP(6),
                paddingBottom: percentToDP(3),
                width: percentToDP(38),
                alignSelf: "flex-start",
              }}
            >
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "big", weight: "bold" }}
                style={{ alignSelf: "flex-start" }}
              >
                {totalDistanceToString(walkDistance)}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-start" }}
              >
                Total distance
              </ThemedText>
            </ThemedView>
            {/* TIME */}
            <ThemedView
              colorName="secondary"
              style={{
                marginTop: percentToDP(summaryVisible ? 3 : -14),
                marginRight: percentToDP(4),
                borderRadius: percentToDP(6),
                padding: percentToDP(4),
                paddingRight: percentToDP(6),
                paddingBottom: percentToDP(3),
                width: percentToDP(38),
                alignSelf: "flex-end",
              }}
            >
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "big", weight: "bold" }}
                style={{ alignSelf: "flex-end" }}
              >
                {totalTimeToString(walkTotalTime)}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-end" }}
              >
                Total time
              </ThemedText>
            </ThemedView>
          </HorizontalView>
          <HorizontalView>
            {/* CALORIES */}
            <ThemedView
              colorName="secondary"
              style={{
                marginLeft: percentToDP(4),
                borderRadius: percentToDP(6),
                padding: percentToDP(4),
                paddingLeft: percentToDP(6),
                paddingTop: percentToDP(3),
                width: percentToDP(38),
                alignSelf: "flex-start",
              }}
            >
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "big", weight: "bold" }}
                style={{ alignSelf: "flex-start" }}
              >
                {caloriesBurnedToString(walkDistance, walkTotalTime)}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-start" }}
              >
                Calories burned
              </ThemedText>
            </ThemedView>
            {/* AVG SPEED */}
            <ThemedView
              colorName="secondary"
              style={{
                marginRight: percentToDP(4),
                borderRadius: percentToDP(6),
                padding: percentToDP(4),
                paddingRight: percentToDP(6),
                paddingTop: percentToDP(3),
                width: percentToDP(38),
                alignSelf: "flex-end",
              }}
            >
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "big", weight: "bold" }}
                style={{ alignSelf: "flex-end" }}
              >
                {averageSpeedToString(walkDistance, walkTotalTime)}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-end" }}
              >
                Average speed
              </ThemedText>
            </ThemedView>
          </HorizontalView>
          {summaryVisible && (
            <ThemedButton
              center
              label="Close"
              onPress={reset}
              style={{ marginTop: percentToDP(3), marginHorizontal: "auto" }}
            />
          )}
        </ThemedView>
      </ThemedScrollView>
      {/* START DIALOG */}
      {startDialogVisible && !isRecording && (
        <StartWalkDialog
          groupWalks={ongoingGroupWalks}
          dogs={dogs}
          onStart={(dogsParticipating, visibility, groupWalk) => {
            return startWalk(dogsParticipating, visibility, groupWalk);
          }}
          onDismiss={() => setStartDialogVisible(false)}
          walkId={walkId}
        />
      )}
      {/* END DIALOG */}
      {(endDialogVisible ||
        (firstTimeout &&
          secondTimeout &&
          firstTimeout.valueOf() < Date.now() &&
          secondTimeout.valueOf() > Date.now())) &&
        isRecording && (
          <EndWalkDialog
            delay={
              (firstTimeout && firstTimeout.valueOf() < Date.now()) as boolean
            }
            message={
              firstTimeout && firstTimeout.valueOf() < Date.now()
                ? `If you wish to continue recording the walk, press the "Delay timeout" button. Otherwise, walk will end automatically at: ${secondTimeout?.toLocaleTimeString(undefined, { timeStyle: "short" })}`
                : "Are you sure you want to end recording the walk?"
            }
            onDismiss={() => {
              setEndDialogVisible(false);
            }}
            onEnd={async () =>
              firstTimeout && firstTimeout.valueOf() < Date.now()
                ? delayTimeout()
                : endWalk()
            }
          />
        )}
    </SafeAreaView>
  );
}
