import HorizontalView from "@/components/basic/containers/HorizontalView";
import { ThemedScrollView } from "@/components/basic/containers/ThemedScrollView";
import { ThemedView } from "@/components/basic/containers/ThemedView";
import { ThemedText } from "@/components/basic/ThemedText";
import { ThemedIcon } from "@/components/decorations/static/ThemedIcon";
import JoinDialog from "@/components/dialogs/JoinDialog";
import ParticipantsDialog from "@/components/dialogs/ParticipantsDialog";
import { MainMap } from "@/components/display/MainMap";
import { ThemedButton } from "@/components/inputs/ThemedButton";
import UserAvatar from "@/components/navigation/UserAvatar";
import ThemedToast from "@/components/popups/ThemedToast";
import { Dog } from "@/context/DogContext";
import { GroupWalk, Participant } from "@/context/GroupWalksContext";
import { PathVertex } from "@/context/WalksContext";
import { countToString } from "@/helpers/countToString";
import { useTextStyle } from "@/hooks/theme/useTextStyle";
import { useThemeColor } from "@/hooks/theme/useThemeColor";
import { useWindowDimension } from "@/hooks/theme/useWindowDimension";
import { useAuth } from "@/hooks/useAuth";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { useWalks } from "@/hooks/useWalks";
import {
  Href,
  router,
  useFocusEffect,
  useLocalSearchParams,
  useNavigation,
} from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { Pressable } from "react-native";
import { RefreshControl, TouchableOpacity } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";

import * as Location from "expo-location";
import { DogPicker } from "@/components/inputs/DogPicker";
import PetAvatar from "@/components/navigation/PetAvatar";
import { LatLng } from "react-native-maps";
import StartWalkDialog from "@/components/dialogs/StartWalkDialog";
import EndWalkDialog from "@/components/dialogs/EndWalkDialog";

export default function ActiveWalkScreen() {
  const walkId = useLocalSearchParams().walkId as string | undefined;
  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>(null);
  const [dogs, setDogs] = useState([] as Dog[]);
  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);

  const [isRecording, setIsRecording] = useState(false);
  const [joined, setJoined] = useState(false);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const [latitude, setLatitude] = useState(51.108592525);
  const [longitude, setLongitude] = useState(17.038330603);

  const [walkStartTime, setWalkStartTime] = useState<Date | null>(null);
  const [distanceWalked, setDistanceWalked] = useState(2.31);
  const [currentPath, setCurrentPath] = useState([] as PathVertex[]);
  const [participants, setParticipants] = useState([] as Participant[]);
  const [activeUsers, setActiveUsers] = useState([] as Participant[]);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const asyncAbortController = useRef<AbortController | undefined>();

  const [refreshOnFocus, setRefreshOnFocus] = useState(false);

  const { startWalk, pauseWalk, endWalk, sendLocation, getActiveUsers } =
    useWalks();
  const { getGroupWalk, getUsersDogs } = useGroupWalks();
  const { userId } = useAuth();

  const headerColor = useThemeColor("primary");
  const headerStyle = useTextStyle({ size: "big", weight: "semibold" });
  const buttonColor = useThemeColor("link");
  const iconColor = useThemeColor("text");
  const percentToDP = useWindowDimension("shorter");
  const heightPercentToDP = useWindowDimension("height");
  const widthPercentToDP = useWindowDimension("width");

  useEffect(() => {
    getData();

    return () => {
      asyncAbortController.current?.abort();
    };
  }, []);

  useEffect(() => {
    async function getCurrentLocation() {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMessage("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLatitude(location.coords.latitude);
      setLongitude(location.coords.longitude);
    }

    getCurrentLocation();
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

  const getData = async () => {
    setIsLoading(true);
    setErrorMessage("");

    asyncAbortController.current = new AbortController();

    let location = await Location.getCurrentPositionAsync();
    setLatitude(location.coords.latitude);
    setLongitude(location.coords.longitude);

    let result = await getUsersDogs();

    if (result.success) {
      let dogs = result.returnValue as Dog[];
      setDogs(dogs);

      if (walkId) {
        asyncAbortController.current = new AbortController();

        result = await getGroupWalk(walkId, asyncAbortController.current);

        if (result.success) {
          let walk = result.returnValue as GroupWalk;

          setDogsParticipating(
            walk.participants
              .filter((elem) => elem.userId === userId)
              .flatMap((elem) => elem.dogs!.map((dog) => dog.dogId))
          );
          setGroupWalk(walk);
        } else {
          setErrorMessage(result.returnValue);
        }
      }
    } else {
      setErrorMessage(result.returnValue);
    }

    setIsLoading(false);
  };

  const startWalkRecording = async () => {
    setIsLoading(true);
    setErrorMessage("");

    let now = new Date();

    asyncAbortController.current = new AbortController();

    let result = await startWalk(
      latitude,
      longitude,
      dogsParticipating,
      walkId,
      asyncAbortController.current
    );

    if (result.success) {
      setIsRecording(true);
      setCurrentPath([
        {
          latitude: latitude,
          longitude: longitude,
          timestamp: now,
        } as PathVertex,
      ]);
      setWalkStartTime(now);
      setDistanceWalked(0);
    } else {
      setErrorMessage(result.returnValue);
    }

    setIsLoading(false);
  };

  const pauseWalkRecording = async () => {};

  const endWalkRecording = async () => {};

  const sendCurrentLocation = async () => {
    // TODO get location
  };

  const getUserLocations = async () => {};

  const getTotalDistance = () => {
    if (!walkStartTime || !isRecording) {
      return "0.0km";
    }

    return (
      Math.floor(distanceWalked).toString() +
      "." +
      Math.floor((distanceWalked % 1) * 10).toString() +
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
    let avgSpeed = distanceWalked / diffInHrs;

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

    let speed = distanceWalked / diffInHrs;
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
          textStyleOptions={{ size: "veryBig", weight: "bold" }}
          textColorName="primary"
          backgroundColorName="transparent"
          style={{
            paddingHorizontal: percentToDP(4),
            marginBottom: percentToDP(5),
          }}
        >
          {isRecording ? "Recording walk" : "Start walking"}
        </ThemedText>
        {/* DETAILS */}
        <ThemedText
          textStyleOptions={{ size: "big" }}
          style={{
            marginBottom: percentToDP(4),
            marginHorizontal: percentToDP(4),
          }}
        >
          {!isRecording
            ? 'Press "Start" to begin recording.'
            : walkId
            ? `Group walk: ${groupWalk?.title}`
            : "Solitary walk"}
        </ThemedText>
        {/* PETS + VISIBILITY INDICATORS */}
        {isRecording && (
          <HorizontalView
            colorName="transparent"
            style={{
              marginHorizontal: percentToDP(2),
              marginBottom: percentToDP(1),
              zIndex: 1,
            }}
          >
            <HorizontalView
              justifyOption="flex-start"
              colorName="transparent"
            >
              {dogs.map((dog) => (
                <ThemedView colorName="transparent">
                  <PetAvatar
                    key={dog.id}
                    size={12}
                    userId={userId ?? ""}
                    petId={dog.id}
                  />
                  <ThemedText
                    center
                    textStyleOptions={{ weight: "semibold" }}
                  >
                    {dog.name}
                  </ThemedText>
                </ThemedView>
              ))}
            </HorizontalView>
            <ThemedView
              colorName="secondary"
              style={{
                width: percentToDP(12),
                height: percentToDP(12),
                borderRadius: percentToDP(10),
              }}
            >
              <ThemedIcon
                name="eye-outline"
                colorName="primary"
                style={{ zIndex: 1, padding: percentToDP(2) }}
              />
            </ThemedView>
          </HorizontalView>
        )}
        {/* MAP */}
        <MainMap
          latitude={latitude}
          longitude={longitude}
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
            isRecording
              ? [
                  // TODO
                ]
              : []
          }
          users={
            isRecording
              ? [
                  // TODO
                ]
              : []
          }
          path={isRecording ? currentPath : []}
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
              setDialogVisible(true);
              //setIsRecording(!isRecording);
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
      {dialogVisible && !isRecording && (
        <StartWalkDialog
          groupWalk={groupWalk}
          dogs={dogs}
          onStart={async (
            dogsParticipating: string[],
            visibility: string,
            startingGroupWalk: boolean,
            abortController: AbortController
          ) => await { success: false, returnValue: "Not implemented" }}
          onDismiss={() => setDialogVisible(false)}
        />
      )}
      {dialogVisible && isRecording && (
        <EndWalkDialog
          message={""}
          onDismiss={() => setDialogVisible(false)}
          onSubmit={async (abortController) =>
            await { success: false, returnValue: "TODO" }
          }
        />
      )}
      {}
    </SafeAreaView>
  );
}

const SummaryScreen = () => {
  return <></>;
};
