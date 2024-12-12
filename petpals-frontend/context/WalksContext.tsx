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
import { mqttURL, mqttUsername, mqttPassword } from "@/constants/config/mqtt";
import { serverQuery } from "@/helpers/serverQuery";
import { useAuth } from "@/hooks/useAuth";
import mqtt from "@taoqf/react-native-mqtt";
import { LatLng } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

import * as TaskManager from "expo-task-manager";
import * as Location from "expo-location";
import { useGroupWalks } from "@/hooks/useGroupWalks";
import { GroupWalk, Participant } from "./GroupWalksContext";
import { Dog } from "./DogContext";

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
};

export type PathVertex = {
  latitude: number;
  longitude: number;
  timestamp: Date;
};

export type WalksContextType = {
  permissionsGranted: boolean;
  isRecording: boolean;
  summaryVisible: boolean;
  firstTimer: number;
  secondTimer: number;
  visibilityMode: "Public" | "Friends_only" | "Private";
  dogsParticipating: string[];
  groupWalkId: string | null;
  userLocation: PathVertex;
  walkStartTime: Date | null;
  walkDistance: number;
  walkPath: PathVertex[];
  nearbyUsers: (Participant & MarkerData)[];
  otherParticipants: (Participant & MarkerData)[];
  checkLocationPermissions: () => void;
  getOngoingGroupWalks: (
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  startWalk: (
    dogsParticipating: string[],
    visibilityMode: "Public" | "Friends_only" | "Private",
    groupWalk?: GroupWalk
  ) => Promise<void>;
  endWalk: () => Promise<void>;
  reset: () => Promise<void>;
  delayTimeout: () => void;
};

export const WalksContext = createContext<WalksContextType | null>(null);

export const WalksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userId, authToken } = useAuth();

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const initialTimeout = 3 * 3600; // = 3hrs
  const delayedTimeout = 3600; // = 1hr
  const cancelTimeout = 1800; // = 30 min
  const [firstTimer, setFirstTimer] = useState(initialTimeout);
  const [secondTimer, setSecondTimer] = useState(cancelTimeout);

  const [groupWalkId, setGroupWalkId] = useState<string | null>(null);

  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  const [visibilityMode, setVisibilityMode] = useState<
    "Public" | "Friends_only" | "Private"
  >("Public");

  const [userLocation, setUserLocation] = useState({
    latitude: 51.108592525,
    longitude: 17.038330603,
    timestamp: new Date(),
  });

  const [walkStartTime, setWalkStartTime] = useState<Date | null>(null);
  const [walkDistance, setWalkDistance] = useState(2.31);
  const [walkPath, setWalkPath] = useState([] as PathVertex[]);
  const [nearbyUsers, setNearbyUsers] = useState(
    [] as (MarkerData & Participant)[]
  );
  const [otherParticipants, setOtherParticipants] = useState(
    [] as (MarkerData & Participant)[]
  );

  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);

  // once on mount
  useEffect(() => {
    // tryRestoreFromStorage()
    connectToMQTT();

    return () => {
      // clean up
      mqttClient?.unsubscribe(`location/nearby/${userId}`);
      if (groupWalkId) {
        mqttClient?.unsubscribe(`location/walk/${groupWalkId}/${userId}`);
      }
      mqttClient?.end();
    };
  }, []);

  // update timers every 1s and locations every 4s when recording
  useEffect(() => {
    let intervalTimers = null;
    let intervalLocation = null;
    if (isRecording) {
      //intervalTimers = setInterval(updateTimers, 1000);
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

  const connectToMQTT = async () => {
    console.log("Connecting to MQTT...");

    const client = mqtt.connect(mqttURL, {
      username: mqttUsername,
      password: mqttPassword,
      clientId: `user-${userId}`,
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("message", (topic, message) => {
      if (topic === `location/nearby/${userId}`) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log("Nearby users recieved: " + parsedMessage);
          updateNearbyUsers(parsedMessage);
        } catch (err) {
          console.error("Error parsing message from location/nearby:", err);
        }
      }

      if (groupWalkId && topic === `location/walk/${groupWalkId}`) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log("Participants recieved: " + parsedMessage);
          updateOtherParticipants(parsedMessage);
        } catch (err) {
          console.error("Error parsing message from location/walk:", err);
        }
      }
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });

    client.on("close", () => {
      console.log("Disconnected from MQTT broker");
    });

    setMqttClient(client);
  };

  const sendStartWalkMessage = async (
    visibility: string,
    dogIds: string[],
    walkId: string
  ) => {
    console.log("Sending start message");
    // ensure mqtt is on
    if (!mqttClient || !mqttClient.connected) {
      await connectToMQTT();
    }

    const payload = JSON.stringify({
      timestamp: new Date().toISOString(),
      visibility: visibility,
      dogsIds: dogIds,
      groupWalkId: walkId ?? "",
    });

    console.log("Sending!");
    console.log(JSON.stringify(mqttClient));
    console.log("payload: " + payload);
    // send start walk message
    mqttClient?.publish(`walk/start/${userId}`, payload, {
      qos: 1,
    });
    console.log("Sent!");
  };

  const sendUserLocation = async (location: PathVertex) => {
    if (!mqttClient || !mqttClient.connected) {
      //await connectToMQTT();
    }

    const payload = JSON.stringify({
      userId: userId,
      latitude: location.latitude,
      longitude: location.longitude,
      timestamp: location.timestamp,
      groupWalkId: groupWalkId ?? "",
    });

    mqttClient?.publish(`location/user/${userId}`, payload, {
      qos: 1,
    });
  };

  const sendEndWalkMessage = async (locations: PathVertex[]) => {
    if (!mqttClient || !mqttClient.connected) {
      await connectToMQTT();
    }

    const payload = JSON.stringify({
      timestamp: new Date().toISOString(),
      locations: locations,
      groupWalkId: groupWalkId ?? "",
    });

    mqttClient?.publish(`walk/end/${userId}`, payload, { qos: 1 });
  };

  const checkLocationPermissions = async () => {
    console.log("checking permissions");
    let response = await Location.getBackgroundPermissionsAsync();
    if (response.status !== "granted") {
      let requestResponse = await Location.requestBackgroundPermissionsAsync();

      if (requestResponse.status !== "granted") {
        setPermissionsGranted(false);
      } else {
        setPermissionsGranted(true);
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
    visibilityMode: "Public" | "Friends_only" | "Private",
    groupWalk?: GroupWalk
  ) => {
    console.log("start walk with");
    console.log("dogs: " + JSON.stringify(dogsParticipating));
    console.log("vis: " + JSON.stringify(visibilityMode));
    console.log("walk: " + JSON.stringify(groupWalk));
    // initialize default variables
    await initialize();

    await sendStartWalkMessage(
      visibilityMode,
      dogsParticipating,
      groupWalk?.id ?? ""
    );

    // subscribe to channels
    mqttClient?.subscribe(`location/nearby/${userId}`, { qos: 1 });
    if (groupWalkId) {
      mqttClient?.subscribe(`location/walk/${groupWalkId}/${userId}`, {
        qos: 1,
      });
    }

    // initialize walk values
    let now = new Date();
    setIsRecording(true);
    setWalkStartTime(now);
    setDogsParticipating(dogsParticipating);
    setVisibilityMode(visibilityMode);
    setGroupWalkId(groupWalk?.id ?? null);

    // store once-a-walk values
    await AsyncStorage.setItem("walkStartTime", JSON.stringify(now));
    if (groupWalk) {
      await AsyncStorage.setItem("groupWalkId", JSON.stringify(groupWalkId));
      await AsyncStorage.setItem("groupWalkData", JSON.stringify(groupWalk));
    }
    await AsyncStorage.setItem(
      "dogsParticipating",
      JSON.stringify(dogsParticipating)
    );
    await AsyncStorage.setItem(
      "visibilityMode",
      JSON.stringify(visibilityMode)
    );

    // start background task
    // Location.startLocationUpdatesAsync("background-location-task", {
    //   accuracy: Location.Accuracy.High,
    //   timeInterval: 1000, // Update every 10 seconds
    //   distanceInterval: 1, // Minimum distance 10 meters for update
    // });

    await updateLocation();
  };

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRadians(lat1)) *
        Math.cos(toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in meters
  };

  const updateTimers = () => {
    console.log("update time");
    console.log("old timers: " + firstTimer + " " + secondTimer);
    let time = Math.max(firstTimer - 1, 0);
    console.log("new timers:");
    console.log(time);

    if (time > 0) {
      setFirstTimer(time);
    } else {
      time = Math.max(secondTimer - 1, 0);
      console.log(time);
      setSecondTimer(time);
      if (time == 0) {
        setIsRecording(false);
        setSummaryVisible(true);
      }
    }
  };

  const delayTimeout = () => {
    setFirstTimer(delayedTimeout);
    setSecondTimer(cancelTimeout);
  };

  const updateLocation = async () => {
    console.log("update location");
    // // try to get location data from Async Storage (from Bckg Task)
    // let location = await AsyncStorage.getItem("userLocation");
    // let active = await AsyncStorage.getItem("backgroundTaskActive");

    // if (location && active) {
    //   console.log("Task active = " + active);
    //   console.log("storage ok: location found = " + location);
    //   let vertex = JSON.parse(location) as PathVertex;
    //   setUserLocation(vertex);
    //   setWalkPath([...walkPath, vertex]);
    // } else {
    //   // if task not active -> source location
    //   console.log("Task active = " + active);
    //   console.log("storage error: location = " + location);
    let newWalkPath = walkPath;
    let loc = await Location.getCurrentPositionAsync();
    let location = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: new Date(),
    } as PathVertex;

    newWalkPath = [...newWalkPath, location];
    console.log("oldWalkPath = " + JSON.stringify(walkPath));
    console.log("newWalkPath = " + JSON.stringify(newWalkPath));

    let dist = 0;

    for (let j = 1; j < newWalkPath.length; j++) {
      dist += calculateDistance(
        newWalkPath[j - 1].latitude,
        newWalkPath[j - 1].longitude,
        newWalkPath[j].latitude,
        newWalkPath[j].longitude
      );
    }

    setUserLocation(location);
    setWalkPath(newWalkPath);
    setWalkDistance(dist);

    sendUserLocation(location);

    // save to storage
    updateStorage();

    return newWalkPath;
  };

  const updateNearbyUsers = async (data: any) => {
    setNearbyUsers(data);
    // TODO: get names + pics
  };

  const updateOtherParticipants = async (data: any) => {
    setNearbyUsers(data);
    // TODO: get names + pics
  };

  const endWalk = async () => {
    console.log("end walk");

    // do last location update
    let finalWalkPath = await updateLocation();

    await sendEndWalkMessage(finalWalkPath);

    // unsubscribe
    mqttClient?.unsubscribe(`location/nearby/${userId}`);
    if (groupWalkId) {
      mqttClient?.unsubscribe(`location/walk/${groupWalkId}/${userId}`);
    }

    // end connection
    //mqttClient?.end();

    // end background task
    // Location.stopLocationUpdatesAsync("background-location-task");

    // remember to show summary
    setIsRecording(false);
    setSummaryVisible(true);
    await AsyncStorage.setItem("summaryVisible", JSON.stringify(true));
  };

  const initialize = async () => {
    console.log("init");
    await clearStorage();

    // set defaults
    setSummaryVisible(false);
    setFirstTimer(initialTimeout);
    setSecondTimer(cancelTimeout);

    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    //mqttClient?.end();
    //setMqttClient(null);
  };

  const reset = async () => {
    console.log("reset");
    await clearStorage();

    // set defaults
    setGroupWalkId(null);

    setIsRecording(false);
    setSummaryVisible(false);
    setFirstTimer(3 * 3600 * 1000);
    setSecondTimer(30 * 60 * 1000);

    setWalkStartTime(null);
    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    setDogsParticipating([]);
  };

  const updateStorage = async () => {
    await AsyncStorage.setItem("userLocation", JSON.stringify(userLocation));
    await AsyncStorage.setItem("walkPath", JSON.stringify(walkPath));
    await AsyncStorage.setItem("firstTimer", JSON.stringify(firstTimer));
    await AsyncStorage.setItem("secondTimer", JSON.stringify(secondTimer));
    await AsyncStorage.setItem("walkDistance", JSON.stringify(walkDistance));
  };

  const clearStorage = async () => {
    await AsyncStorage.removeItem("walkStartTime");
    await AsyncStorage.removeItem("userLocation");
    await AsyncStorage.removeItem("walkPath");
    await AsyncStorage.removeItem("firstTimer");
    await AsyncStorage.removeItem("secondTimer");
    await AsyncStorage.removeItem("groupWalkId");
    await AsyncStorage.removeItem("groupWalkData");
    await AsyncStorage.removeItem("walkDistance");
    await AsyncStorage.removeItem("summaryVisible");
    await AsyncStorage.removeItem("dogsParticipating");
    await AsyncStorage.removeItem("visibilityMode");
  };

  const tryRestoreFromStorage = async () => {
    console.log("try to restore saved state");

    let walkStartTime = await AsyncStorage.getItem("walkStartTime");
    if (!walkStartTime) {
      setIsRecording(false);
      console.log("no saved state");
      return false;
    }

    setIsRecording(true);

    let date = JSON.parse(walkStartTime) as Date;
    setWalkStartTime(date);

    let userLocation = await AsyncStorage.getItem("userLocation");
    let vertex = userLocation
      ? (JSON.parse(userLocation) as PathVertex)
      : ({
          latitude: 51.108592525,
          longitude: 17.038330603,
          timestamp: new Date(),
        } as PathVertex);
    setUserLocation(vertex);

    let walkPath = await AsyncStorage.getItem("walkPath");
    let path = walkPath ? (JSON.parse(walkPath) as PathVertex[]) : [];
    setWalkPath(path);

    let firstTimer = await AsyncStorage.getItem("firstTimer");
    let time = firstTimer ? (JSON.parse(firstTimer) as number) : 0;
    setFirstTimer(time);

    let secondTimer = await AsyncStorage.getItem("secondTimer");
    time = secondTimer ? (JSON.parse(secondTimer) as number) : 0;
    setSecondTimer(time);

    let groupWalkId = await AsyncStorage.getItem("groupWalkId");
    let id = groupWalkId ? (JSON.parse(groupWalkId) as string) : null;
    setGroupWalkId(id);

    let walkDistance = await AsyncStorage.getItem("walkDistance");
    let dist = walkDistance ? (JSON.parse(walkDistance) as number) : 0;
    setWalkDistance(dist);

    let summaryVisible = await AsyncStorage.getItem("summaryVisible");
    let show = summaryVisible ? (JSON.parse(summaryVisible) as boolean) : false;
    setSummaryVisible(show);

    if (summaryVisible) {
      setIsRecording(false);
    }

    updateTimers();
    await updateLocation();
  };

  return (
    <WalksContext.Provider
      value={{
        permissionsGranted,
        isRecording,
        summaryVisible,
        firstTimer,
        secondTimer,
        visibilityMode,
        dogsParticipating,
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
        endWalk,
        reset,
        delayTimeout,
      }}
    >
      {children}
    </WalksContext.Provider>
  );
};
