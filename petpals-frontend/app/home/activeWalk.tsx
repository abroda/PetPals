import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import { MainMap } from "@/components/display/MainMap";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import ThemedToast from "@/components/popups/ThemedToast";
import { Dog } from "@/context/DogContext";
import { GroupWalk, Participant } from "@/context/GroupWalksContext";
import { MarkerData, PathVertex } from "@/context/WalksContext";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useAuth } from "@/hooks/useAuth";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { useWalks } from "@/hooks/useWalks";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Location from "expo-location";
import PetAvatar from "@/components/navigation/PetAvatar";
import StartWalkDialog from "@/components/dialogs/StartWalkDialog";
import EndWalkDialog from "@/components/dialogs/EndWalkDialog";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { DogPicker } from "@/components/inputs/DogPicker";

export default function ActiveWalkScreen() {
  const walkId = useLocalSearchParams().walkId as string | undefined;

  const [ongoingGroupWalks, setOngoingGroupWalks] = useState<GroupWalk[]>([]);
  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>();
  const [dogs, setDogs] = useState([] as Dog[]);

  const [startDialogVisible, setStartDialogVisible] = useState(false);
  const [endDialogVisible, setEndDialogVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>();

  const [refreshOnFocus, setRefreshOnFocus] = useState(false);

  const {
    permissionsGranted,
    isRecording,
    summaryVisible,
    firstTimeout,
    secondTimeout,
    dogsParticipating,
    visibilityMode,
    groupWalkId,
    userLocation,
    walkStartTime,
    walkDistance,
    walkPath,
    nearbyUsers,
    otherParticipants,
    checkLocationPermissions,
    getOngoingGroupWalks,
    startWalk,
    updateState,
    endWalk,
    reset,
  } = useWalks();
  const { getGroupWalk, getUsersDogs, getGroupWalks } = useGroupWalks();
  const { userId } = useAuth();

  const headerColor = useThemeColor("primary");
  const headerStyle = useTextStyle({ size: "big", weight: "semibold" });
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const widthPercentToDP = useWindowDimension("width");

  // on mount
  useEffect(() => {
    checkLocationPermissions();

    if (isRecording) {
      getData();
    }

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  const getData = async () => {
    console.log("get data (dogs)");
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let result = await getUsersDogs();

    if (result.success) {
      let dogs = result.returnValue as Dog[];
      setDogs(dogs);

      // if recording a group walk, get only relevant walk
      if (isRecording && groupWalkId) {
        console.log("get data (single walk)");
        asyncAbortController.current = new AbortController();

        result = await getGroupWalk(groupWalkId, asyncAbortController.current);

        if (result.success) {
          let walk = result.returnValue as GroupWalk;
          setGroupWalk(walk);
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

  // on focus
  useFocusEffect(() => {
    if (refreshOnFocus && !isLoading) {
      checkLocationPermissions(); // check permissions -> if not -> show error message
      getData(); // refresh dog/walk data
      setRefreshOnFocus(false);
    }

    return () => {
      setRefreshOnFocus(!isLoading);
    };
  });

  // update locations every 2.5 seconds when recording
  useEffect(() => {
    let intervalId = null;
    if (isRecording) {
      intervalId = setInterval(updateState, 6000); // 2500);
    }

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isRecording]);

  const getTotalDistance = () => {
    if (!walkStartTime || !isRecording) {
      return "0.0km";
    }

    return (
      Math.floor(walkDistance).toString() +
      "." +
      Math.floor((walkDistance % 1) * 10).toString() +
      " km"
    );
  };

  const getTotalTime = () => {
    if (!walkStartTime || !isRecording) {
      return "00:00";
    }

    let diffInSeconds = (new Date().valueOf() - walkStartTime.valueOf()) / 1000;
    let hrs = Math.floor(diffInSeconds / 3600);
    diffInSeconds -= hrs * 3600;
    let mins = Math.floor(diffInSeconds / 60);
    diffInSeconds -= mins * 60;
    let secs = Math.floor(diffInSeconds);

    return (
      (hrs > 0 ? hrs.toString() + "h " : "") +
      (mins > 9 ? "" : "0") +
      mins.toString() +
      "m " +
      (secs > 9 ? "" : "0") +
      secs.toString() +
      "s"
    );
  };

  const getCaloriesBurned = () => {
    if (!walkStartTime || !isRecording) {
      return "0kcal";
    }

    let diffInSecs = (new Date().valueOf() - walkStartTime.valueOf()) / 1000;
    let diffInHrs = diffInSecs / 3600;
    let avgSpeed = walkDistance / diffInHrs;

    let met =
      avgSpeed < 4
        ? 2.0 + 0.375 * avgSpeed
        : avgSpeed < 6
          ? 3.5 + (avgSpeed - 4.0)
          : avgSpeed < 12
            ? 7.0 + 0.5 * (avgSpeed - 6.0)
            : avgSpeed < 20
              ? 10 + 0.3 * (avgSpeed - 12.0)
              : 12.4 + 0.2 * (avgSpeed - 20.0);

    let weight = 70;

    let calories = met * weight * diffInHrs;

    return (
      Math.floor(calories).toString() +
      "." +
      Math.floor((calories % 1) * 10).toString() +
      " kcal"
    );
  };

  const getAverageSpeed = () => {
    if (!walkStartTime || !isRecording) {
      return "0km/h";
    }

    let diffInSecs = (new Date().valueOf() - walkStartTime.valueOf()) / 1000;
    let diffInHrs = diffInSecs / 3600;

    let speed = walkDistance / diffInHrs;
    return (
      Math.floor(speed).toString() +
      "." +
      Math.floor((speed % 1) * 10).toString() +
      " km/h"
    );
  };

  return (
    <SafeAreaView>
      <ThemedToast
        visible={!isLoading && errorMessage.length > 0}
        message={errorMessage} // {"Check your internet connection."}
        preset="offline"
        aboveTabBar
      />
      <ThemedToast
        visible={!permissionsGranted}
        message={"Location permissions were denied."}
        preset="failure"
        aboveTabBar
      />
      <ThemedScrollView
        scrollEnabled={false}
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
          {isRecording ? "Recording walk" : "Start walking"}
        </ThemedText>
        {/* DETAILS */}
        <ThemedText
          textStyleOptions={{ size: "biggerMedium" }}
          style={{
            marginBottom: percentToDP(3),
            marginHorizontal: percentToDP(4),
          }}
        >
          {!isRecording
            ? 'Press "Start" to begin recording.'
            : groupWalkId
              ? `Group walk: ${groupWalk?.title}`
              : "Solitary walk"}
        </ThemedText>
        {/* PETS + VISIBILITY INDICATORS */}
        {isRecording && (
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
            <ThemedView
              colorName="secondary"
              style={{
                borderRadius: percentToDP(10),
              }}
            >
              <ThemedText style={{ textAlign: "center" }}>
                Visibility
              </ThemedText>
              <ThemedText
                textColorName="primary"
                style={{ textAlign: "center" }}
              >
                {visibilityMode}
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
          viewStyle={{
            height: heightPercentToDP(isRecording ? 53 : 62.1),
            width: widthPercentToDP(100),
            alignItems: "center",
            justifyContent: "center",
            marginBottom: percentToDP(-10),
          }}
          markers={
            isRecording && groupWalk
              ? [
                  {
                    coordinates: {
                      latitude: groupWalk.latitude,
                      longitude: groupWalk.longitude,
                    },
                    title: "Group walk location",
                    description: groupWalk.locationName,
                    color: "green",
                  } as MarkerData,
                ]
              : []
          }
          nearbyUsers={nearbyUsers}
          otherParticipants={otherParticipants}
          path={isRecording ? walkPath : []}
        />
        {/* START/END BUTTON */}
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
        <ThemedView>
          <HorizontalView style={{ marginBottom: percentToDP(1) }}>
            <ThemedView
              colorName="secondary"
              style={{
                marginTop: percentToDP(-14),
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
                {getTotalDistance()}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-start" }}
              >
                Total distance
              </ThemedText>
            </ThemedView>
            <ThemedView
              colorName="secondary"
              style={{
                marginTop: percentToDP(-14),
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
                {getTotalTime()}
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
                {getCaloriesBurned()}
              </ThemedText>
              <ThemedText
                backgroundColorName="transparent"
                textStyleOptions={{ size: "tiny" }}
                style={{ alignSelf: "flex-start" }}
              >
                Calories burned
              </ThemedText>
            </ThemedView>
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
                {getAverageSpeed()}
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
        </ThemedView>
      </ThemedScrollView>
      {startDialogVisible && !isRecording && (
        <StartWalkDialog
          groupWalks={ongoingGroupWalks}
          dogs={dogs}
          onStart={(dogsParticipating, visibility, groupWalk) => {
            return startWalk(dogsParticipating, visibilityMode, groupWalk);
          }}
          onDismiss={() => setStartDialogVisible(false)}
        />
      )}
      {endDialogVisible && isRecording && (
        <EndWalkDialog
          message={
            firstTimeout === 0
              ? `If you wish to continue recording the walk, close this dialog. Time until automatic end of the walk: ${secondTimeout}`
              : "Are you sure you want to end recording the walk?"
          }
          onDismiss={() => setEndDialogVisible(false)}
          onEnd={endWalk}
        />
      )}
      {}
    </SafeAreaView>
  );
}

const SummaryScreen = () => {
  return <></>;
};
