import React, {
  createContext,
  Dispatch,
  FC,
  ReactNode,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import { serverQuery } from "@/helpers/serverQuery";
import { useAuth } from "@/hooks/useAuth";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { GroupWalk, Participant } from "./GroupWalksContext";
import { useMqtt } from "@/hooks/useMqtt";
import { useRecordWalkMemory } from "@/hooks/useRecordWalkMemory";
import { distanceInKmFromCoordinates } from "@/helpers/recordWalkCounters";

const locationSourcingOptions = {
  accuracy: Location.Accuracy.Highest,
  timeInterval: 4000,
  distanceInterval: 2,
} as Location.LocationOptions;

// TaskManager.defineTask(
//   "background-location-task",
//   async ({ data, error }: { data: any; error: any }) => {
//     await AsyncStorage.setItem("backgroundTaskActive", JSON.stringify(true));
//     console.error("Background task active");
//     if (error) {
//       console.error("Background task error:", error);
//       return;
//     }

//     if (data && data.locations && data.locations[0]) {
//       const location = data.locations[0];

//       console.log("Background publishing location to MQTT:", location);

//       const userId = await AsyncStorage.getItem("userId");

//       if (userId) {
//         const vertex = {
//           latitude: location.coords.latitude,
//           longitude: location.coords.longitude,
//           timestamp: location.timestamp,
//         } as PathVertex;
//         const message = JSON.stringify(vertex);

//         await AsyncStorage.setItem("userLocation", message);
//         let pathString = await AsyncStorage.getItem("walkPath");
//         if (pathString) {
//           let path = JSON.parse(pathString) as PathVertex[];

//           await AsyncStorage.setItem(
//             "walkPath",
//             JSON.stringify([...path, vertex])
//           );
//         }

//         let backgroundMqttClient = mqtt.connect(
//           mqttURL,
//           {
//             username: mqttUsername,
//             password: mqttPassword,
//             clientId: `user-${userId ?? "null"}`,
//           }
//         );

//         backgroundMqttClient.on("connect", () => {
//           console.log("Background MQTT client connected");
//           backgroundMqttClient.publish(`location/user/${userId}`, message, {
//             qos: 0,
//             retain: false,
//           });
//           backgroundMqttClient.end();
//         });

//         backgroundMqttClient.on("error", (error) => {
//           console.error("Background MQTT client error:", error);
//         });
//       } else {
//         console.log("Background location: Client not connected.");
//       }
//     } else {
//       console.log("Background location: data.locations doesn't exist.");
//     }
//   }
// );

export type MarkerData = {
  coordinates: {
    latitude: number;
    longitude: number;
  };
  title: string;
  description: string;
  color: string;
  pictureURL: string;
  linksTo: string;
};

export type MapPosition = {
  userId: string;
  latitude: number;
  longitude: number;
  timestamp: Date;
  imageUrl: string | null;
};

export type PathVertex = {
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type VisibilityMode = "Public" | "Friends_only" | "Private";

export type RecordWalkContextType = {
  permissionsGranted: boolean;
  isRecording: boolean;
  summaryVisible: boolean;
  firstTimeout: Date | null;
  secondTimeout: Date | null;
  visibilityMode: VisibilityMode;
  dogsParticipating: string[];
  groupWalk: GroupWalk | null;
  userLocation: PathVertex;
  walkStartTime: Date | null;
  walkEndTime: Date | null;
  walkTotalTime: number;
  walkDistance: number;
  walkPath: PathVertex[];
  nearbyUsers: MapPosition[];
  otherParticipants: MapPosition[];
  checkLocationPermissions: () => void;
  getOngoingGroupWalks: (
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  startWalk: (
    dogsParticipating: string[],
    visibilityMode: VisibilityMode,
    groupWalk?: GroupWalk
  ) => Promise<void>;
  endWalk: () => Promise<void>;
  reset: () => Promise<void>;
  delayTimeout: () => void;
  updateGroupWalkData: (groupWalkData: GroupWalk) => void;
};

export const RecordWalkContext = createContext<RecordWalkContextType | null>(
  null
);

export const RecordWalkProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { userId, authToken } = useAuth();
  const {
    mqttConnect,
    mqttSubscribe,
    mqttUnsubscribe,
    sendStartWalkMessage,
    sendLocationUpdate,
    sendEndWalkMessage,
  } = useMqtt();
  const {
    saveInStorage,
    saveWalkPath,
    saveGroupWalkData,
    saveTimeouts,
    saveWalkEndTime,
    restoreFromStorage,
    deleteStorage,
  } = useRecordWalkMemory();

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const initialTimeToTimeout = 3 * 3600 * 1000; // = 3hrs
  const delayTime = 3600 * 1000; // = 1hr
  const cancelTime = 1800 * 1000; // = 30 min
  const [firstTimeout, setFirstTimeout] = useState<Date | null>(null);
  const [secondTimeout, setSecondTimeout] = useState<Date | null>(null);

  const [groupWalk, setGroupWalk] = useState<GroupWalk | null>(null);

  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  const [visibilityMode, setVisibilityMode] =
    useState<VisibilityMode>("Public");

  const [userLocation, setUserLocation] = useState({
    latitude: 51.108592525,
    longitude: 17.038330603,
    timestamp: new Date(),
  });

  const [walkStartTime, setWalkStartTime] = useState<Date | null>(null);
  const [walkTotalTime, setWalkTotalTime] = useState(0);
  const [walkEndTime, setWalkEndTime] = useState<Date | null>(null);
  const [walkDistance, setWalkDistance] = useState(0);
  const [walkPath, setWalkPath] = useState([] as PathVertex[]);
  const [nearbyUsers, setNearbyUsers] = useState([] as MapPosition[]);
  const [otherParticipants, setOtherParticipants] = useState(
    [] as MapPosition[]
  );

  // when userId changes
  useEffect(() => {
    if (userId) {
      tryRestoreFromStorage();
      mqttConnect(updateNearbyUsers, updateWalkParticipants);
    }
  }, [userId]);

  // update timer every 1s and location every 4s when recording
  useEffect(() => {
    let intervalTimers = null;
    let intervalLocation = null;
    if (isRecording) {
      intervalTimers = setInterval(updateTimer, 1000);
      intervalLocation = setInterval(updateLocation, 4000);
    }

    return () => {
      if (intervalTimers) {
        clearInterval(intervalTimers);
      }

      if (intervalLocation) {
        clearInterval(intervalLocation);
      }
    };
  }, [isRecording]);

  const checkLocationPermissions = async () => {
    console.log("checking permissions");
    let response = await Location.getForegroundPermissionsAsync(); //getBackgroundPermissionsAsync();
    if (response.status !== "granted") {
      let requestResponse = await Location.requestForegroundPermissionsAsync(); //requestBackgroundPermissionsAsync();

      if (requestResponse.status !== "granted") {
        setPermissionsGranted(false);
      } else {
        setPermissionsGranted(true);
        if (!summaryVisible) {
          Location.getCurrentPositionAsync(locationSourcingOptions).then(
            (result) => {
              let location = {
                longitude: result.coords.longitude,
                latitude: result.coords.latitude,
                timestamp: new Date(),
              };
              setUserLocation(location);
            }
          );
        }
      }
    } else {
      setPermissionsGranted(true);
    }
  };

  const getOngoingGroupWalks = async (
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.walks.listOngoing(userId ?? ""),
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken ?? ""}`,
      },
      asyncAbortController: asyncAbortController,
    });
  };

  const startWalk = async (
    dogsParticipating: string[],
    visibilityMode: VisibilityMode,
    groupWalk?: GroupWalk
  ) => {
    console.log("start walk with");
    console.log("dogs: " + JSON.stringify(dogsParticipating));
    console.log("vis: " + JSON.stringify(visibilityMode));
    console.log("walk: " + JSON.stringify(groupWalk));

    // initialize default variables
    let now = new Date();
    setIsRecording(true);
    setSummaryVisible(false);

    setWalkStartTime(now);
    setWalkEndTime(null);

    setDogsParticipating(dogsParticipating);
    setVisibilityMode(visibilityMode);
    setGroupWalk(groupWalk ?? null);

    // set defaults

    let timeout1 = new Date(now.valueOf() + initialTimeToTimeout);
    let timeout2 = new Date(now.valueOf() + initialTimeToTimeout + cancelTime);
    setFirstTimeout(timeout1);
    setSecondTimeout(timeout2);

    setWalkTotalTime(0);
    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    // subscribe to channels
    mqttSubscribe(groupWalk?.id);

    sendStartWalkMessage({
      timestamp: new Date().toISOString(),
      visibility: visibilityMode,
      dogIds: dogsParticipating,
      groupWalkId: groupWalk?.id ?? "",
    });

    saveInStorage({
      walkStartTime: now,
      walkEndTime: null,
      firstTimeout: timeout1,
      secondTimeout: timeout2,
      groupWalkData: groupWalk ?? null,
      dogsParticipating: dogsParticipating,
      visibilityMode: visibilityMode,
      walkPath: [],
    });

    // start background task
    // Location.startLocationUpdatesAsync("background-location-task", {
    //   accuracy: Location.Accuracy.High,
    //   timeInterval: 1000, // Update every 10 seconds
    //   distanceInterval: 1, // Minimum distance 10 meters for update
    // });

    await updateLocation();
  };

  const updateGroupWalkData = (groupWalkData: GroupWalk) => {
    setGroupWalk(groupWalkData);
    saveGroupWalkData(groupWalkData);
  };

  const updateTimer = () => {
    if (walkStartTime) {
      let time = new Date().valueOf() - walkStartTime.valueOf();
      setWalkTotalTime(time);
    }
  };

  const delayTimeout = () => {
    let now = new Date();
    let timeout1 = new Date(now.valueOf() + delayTime);
    let timeout2 = new Date(now.valueOf() + delayTime + cancelTime);
    setFirstTimeout(timeout1);
    setSecondTimeout(timeout2);

    saveTimeouts(timeout1, timeout2);
  };

  const updateLocation = async () => {
    console.log("update location");

    // try to get current location
    let location = userLocation;
    try {
      let result = await Location.getCurrentPositionAsync(
        locationSourcingOptions
      );
      location = {
        longitude: result.coords.longitude,
        latitude: result.coords.latitude,
        timestamp: new Date(),
      };
    } catch (error) {
      console.log("Error updating location:", error);
    }

    console.log("sourced location: ", location);

    setUserLocation(location);

    setWalkPath((currentWalkPath) => {
      const newWalkPath = [...currentWalkPath, location];
      //console.log("Updated walkPath:", JSON.stringify(newWalkPath));

      let totalDistance = 0;
      for (let i = 1; i < newWalkPath.length; i++) {
        totalDistance += distanceInKmFromCoordinates(
          newWalkPath[i - 1].latitude,
          newWalkPath[i - 1].longitude,
          newWalkPath[i].latitude,
          newWalkPath[i].longitude
        );
      }

      setWalkDistance(totalDistance);
      saveWalkPath(newWalkPath);

      return newWalkPath;
    });

    sendLocationUpdate({
      userId: userId ?? "",
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp.toISOString(),
      groupWalkId: groupWalk?.id ?? "",
    });

    return [...walkPath, location];
  };

  const updateNearbyUsers = async (data: MapPosition[]) => {
    setNearbyUsers(
      data.filter(
        (elem: MapPosition) =>
          !otherParticipants.map((e) => e.userId).includes(elem.userId)
      )
    );
  };

  const updateWalkParticipants = async (data: MapPosition[]) => {
    setOtherParticipants(
      data.filter((elem: MapPosition) => elem.userId !== userId)
    );
  };

  const endWalk = async () => {
    console.log("end walk");

    let now = new Date();

    // end background task
    // Location.stopLocationUpdatesAsync("background-location-task");

    // remember to show summary
    setIsRecording(false);
    setSummaryVisible(true);
    setWalkEndTime(now);

    // do last location update
    await updateLocation().then((finalWalkPath) => {
      sendEndWalkMessage({
        timestamp: now.toISOString(),
        locations: finalWalkPath,
        groupWalkId: groupWalk?.id ?? "",
      });
    });

    // unsubscribe
    mqttUnsubscribe(groupWalk?.id);
    saveWalkEndTime(now);
  };

  const reset = async () => {
    console.log("reset");

    // set defaults

    setIsRecording(false);
    setSummaryVisible(false);
    setFirstTimeout(null);
    setSecondTimeout(null);

    setWalkStartTime(null);
    setWalkEndTime(null);
    setWalkTotalTime(0);
    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    setDogsParticipating([]);
    setGroupWalk(null);
    setVisibilityMode("Public");

    let result = await Location.getCurrentPositionAsync(
      locationSourcingOptions
    );
    let location = {
      longitude: result.coords.longitude,
      latitude: result.coords.latitude,
      timestamp: new Date(),
    };
    setUserLocation(location);

    deleteStorage();
  };

  const tryRestoreFromStorage = async () => {
    console.log("try to restore saved state");

    let data = await restoreFromStorage();

    if (data === null) {
      console.log("null or incomplete saved state");
      return;
    }

    setWalkStartTime(data.walkStartTime);
    setWalkEndTime(data.walkEndTime);
    setFirstTimeout(data.firstTimeout);
    setSecondTimeout(data.secondTimeout);
    setGroupWalk(data.groupWalkData);
    setDogsParticipating(data.dogsParticipating);
    setVisibilityMode(data.visibilityMode);
    setWalkPath(data.walkPath);
    if (data.walkPath.length > 0) {
      setUserLocation(data.walkPath[data.walkPath.length - 1]);
    }
    //console.log(data.walkPath);

    setWalkTotalTime((current) => {
      let referenceTIme = (
        data.walkEndTime ? new Date(data.walkEndTime).valueOf() : Date.now()
      ) as number;
      let value = new Date(data.walkStartTime).valueOf() as number;
      let result = (referenceTIme - value) as number;
      return result;
    });

    if (data.walkPath.length > 0) {
      setUserLocation(data.walkPath[data.walkPath.length - 1]);
    }

    let distance = 0;

    for (let i = 1; i < data.walkPath.length; i++) {
      distance += distanceInKmFromCoordinates(
        data.walkPath[i - 1].latitude,
        data.walkPath[i - 1].longitude,
        data.walkPath[i].latitude,
        data.walkPath[i].longitude
      );
    }
    setWalkDistance(distance);

    if (data.walkEndTime || data.secondTimeout.valueOf() <= Date.now()) {
      setIsRecording(false);
      setSummaryVisible(true);
    } else if (data.walkStartTime) {
      setIsRecording(true);
      updateTimer();
      await updateLocation();
    }
  };

  return (
    <RecordWalkContext.Provider
      value={{
        permissionsGranted,
        isRecording,
        summaryVisible,
        firstTimeout,
        secondTimeout,
        visibilityMode,
        dogsParticipating,
        groupWalk,
        userLocation,
        walkStartTime,
        walkEndTime,
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
      }}
    >
      {children}
    </RecordWalkContext.Provider>
  );
};
