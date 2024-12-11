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
//           "wss://e5d6e57acc5e4674831a0132e5180769.s1.eu.hivemq.cloud:8883/mqtt",
//           {
//             username: "abroda",
//             password: "Petpals123",
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
  firstTimeout: number;
  secondTimeout: number;
  visibilityMode: "Public" | "Friends" | "Private";
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
    visibilityMode: "Public" | "Friends" | "Private",
    groupWalk?: GroupWalk
  ) => Promise<{ success: boolean; returnValue: any }>;
  updateState: () => Promise<void>;
  endWalk: (
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  reset: () => Promise<void>;
};

export const WalksContext = createContext<WalksContextType | null>(null);

export const WalksProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userId, authToken } = useAuth();

  const [permissionsGranted, setPermissionsGranted] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [summaryVisible, setSummaryVisible] = useState(false);

  const [firstTimeout, setFirstTimeout] = useState(3 * 3600 * 1000);
  const [secondTimeout, setSecondTimeout] = useState(30 * 60 * 1000);

  const [groupWalkId, setGroupWalkId] = useState<string | null>(null);

  const [dogsParticipating, setDogsParticipating] = useState([] as string[]);
  const [visibilityMode, setVisibilityMode] = useState<
    "Public" | "Friends" | "Private"
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
    tryRestoreFromStorage().then((activeWalk) => {
      console.log("Active walk!");
      if (activeWalk) {
        connectToMQTT();
      }
    });

    return () => {
      // clean up
      mqttClient?.end();
    };
  }, []);

  const tryRestoreFromStorage = async () => {
    console.log("try to restore saved state");

    // let walkStartTime = await AsyncStorage.getItem("walkStartTime");
    // if (!walkStartTime) {
    //   setIsRecording(false);
    //   console.log("no saved state");
    //   return false;
    // }

    // setIsRecording(true);

    // let date = JSON.parse(walkStartTime) as Date;
    // setWalkStartTime(date);

    // let userLocation = await AsyncStorage.getItem("userLocation");
    // let vertex = userLocation
    //   ? (JSON.parse(userLocation) as PathVertex)
    //   : ({
    //       latitude: 51.108592525,
    //       longitude: 17.038330603,
    //       timestamp: new Date(),
    //     } as PathVertex);
    // setUserLocation(vertex);

    // let walkPath = await AsyncStorage.getItem("walkPath");
    // let path = walkPath ? (JSON.parse(walkPath) as PathVertex[]) : [];
    // setWalkPath(path);

    // let firstTimeout = await AsyncStorage.getItem("firstTimeout");
    // let time = firstTimeout ? (JSON.parse(firstTimeout) as number) : 0;
    // setFirstTimeout(time);

    // let secondTimeout = await AsyncStorage.getItem("secondTimeout");
    // time = secondTimeout ? (JSON.parse(secondTimeout) as number) : 0;
    // setSecondTimeout(time);

    // let groupWalkId = await AsyncStorage.getItem("groupWalkId");
    // let id = groupWalkId ? (JSON.parse(groupWalkId) as string) : null;
    // setGroupWalkId(id);

    // let walkDistance = await AsyncStorage.getItem("walkDistance");
    // let dist = walkDistance ? (JSON.parse(walkDistance) as number) : 0;
    // setWalkDistance(dist);

    // let summaryVisible = await AsyncStorage.getItem("summaryVisible");
    // let show = summaryVisible ? (JSON.parse(summaryVisible) as boolean) : false;
    // setSummaryVisible(show);

    // if (summaryVisible) {
    //   setIsRecording(false);
    // }

    return true;
  };

  const connectToMQTT = async () => {
    const client = mqtt.connect(
      "wss://e5d6e57acc5e4674831a0132e5180769.s1.eu.hivemq.cloud:8883/mqtt",
      {
        username: "abroda",
        password: "Petpals123",
        clientId: `user-${userId}`,
      }
    );

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
    });

    client.on("message", (topic, message) => {
      if (topic === `location/nearby/${userId}`) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          updateNearbyUsers(parsedMessage);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      }

      if (groupWalkId && topic === `location/walk/${groupWalkId}`) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          updateOtherParticipants(parsedMessage);
        } catch (err) {
          console.error("Error parsing message:", err);
        }
      }
    });

    client.on("error", (err) => {
      console.error("MQTT connection error:", err);
    });

    client.on("close", () => {
      console.log("x Disconnected from MQTT broker");
      client.end();
    });

    setMqttClient(client);
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
    visibilityMode: "Public" | "Friends" | "Private",
    groupWalk?: GroupWalk
  ) => {
    console.log("start walk with");
    console.log("dogs: " + JSON.stringify(dogsParticipating));
    console.log("vis: " + JSON.stringify(visibilityMode));
    console.log("walk: " + JSON.stringify(groupWalk));
    // initialize default variables
    initialize();

    // ensure mqtt is on
    if (!mqttClient || !mqttClient.connected) {
      await connectToMQTT();
    }

    // send start walk message
    mqttClient?.publish(
      `walk/start/${userId}`,
      JSON.stringify({
        timestamp: new Date().toISOString(),
        visibilityMode: visibilityMode,
        dogsIds: dogsParticipating,
        groupWalkId: groupWalk?.id,
      }),
      {
        qos: 1,
      }
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
    await AsyncStorage.setItem("groupWalkId", JSON.stringify(groupWalkId));
    await AsyncStorage.setItem("groupWalkData", JSON.stringify(groupWalk));
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

    await updateState();

    return { success: true, returnValue: "" };
  };

  const updateState = async () => {
    console.log("update state");

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
    let loc = await Location.getCurrentPositionAsync();
    let vertex = {
      latitude: loc.coords.latitude,
      longitude: loc.coords.longitude,
      timestamp: new Date(),
    };
    setUserLocation(vertex);
    setWalkPath([...walkPath, vertex]);

    let dist = 0;

    for (let j = 1; j < walkPath.length; j++) {
      dist += calculateDistance(
        walkPath[j - 1].latitude,
        walkPath[j - 1].longitude,
        walkPath[j].latitude,
        walkPath[j].longitude
      );
    }

    setWalkDistance(2.745); //dist);
    setWalkStartTime(new Date(Date.now() - 30 * 60 * 1000 + 32426));
    console.log("sourced location = " + JSON.stringify(vertex));
    //   sendUserLocation();
    // }

    // // save to storage
    // updateStorage();
  };

  const sendUserLocation = async () => {
    const payload = JSON.stringify({
      userId,
      latitude: userLocation.latitude,
      longitude: userLocation.longitude,
      timestamp: userLocation.timestamp,
      groupWalkId,
    });

    mqttClient?.publish(`location/user/${userId}`, payload, {
      qos: 1,
    });
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
    updateState();

    const payload = JSON.stringify({
      timestamp: new Date().toISOString(),
      walkPath,
      groupWalkId,
    });

    // send end walk message
    mqttClient?.publish(`walk/end/${userId}`, payload, { qos: 1 });

    // unsubscribe
    mqttClient?.unsubscribe(`location/nearby/${userId}`);
    if (groupWalkId) {
      mqttClient?.unsubscribe(`location/walk/${groupWalkId}/${userId}`);
    }

    // end connection
    mqttClient?.end();

    // end background task
    // Location.stopLocationUpdatesAsync("background-location-task");

    // remember to show summary
    setIsRecording(false);
    setSummaryVisible(true);
    await AsyncStorage.setItem("summaryVisible", JSON.stringify(true));

    // DELETE LATER
    clearStorage();

    return { success: true, returnValue: "" };
  };

  const initialize = async () => {
    console.log("reset");
    await clearStorage();

    // set defaults
    setSummaryVisible(false);
    setFirstTimeout(3 * 3600 * 1000);
    setSecondTimeout(30 * 60 * 1000);

    setWalkStartTime(new Date());
    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    mqttClient?.end();
    setMqttClient(null);
  };

  const reset = async () => {
    console.log("reset");
    await clearStorage();

    // set defaults
    setGroupWalkId(null);

    setIsRecording(false);
    setSummaryVisible(false);
    setFirstTimeout(3 * 3600 * 1000);
    setSecondTimeout(30 * 60 * 1000);

    setWalkStartTime(null);
    setWalkDistance(0);
    setWalkPath([]);
    setNearbyUsers([]);
    setOtherParticipants([]);

    setDogsParticipating([]);

    mqttClient?.end();
    setMqttClient(null);
  };

  const updateStorage = async () => {
    await AsyncStorage.setItem("userLocation", JSON.stringify(userLocation));
    await AsyncStorage.setItem("walkPath", JSON.stringify(walkPath));
    await AsyncStorage.setItem("firstTimeout", JSON.stringify(firstTimeout));
    await AsyncStorage.setItem("secondTimeout", JSON.stringify(secondTimeout));
    await AsyncStorage.setItem("walkDistance", JSON.stringify(walkDistance));
  };

  const clearStorage = async () => {
    await AsyncStorage.removeItem("walkStartTime");
    await AsyncStorage.removeItem("userLocation");
    await AsyncStorage.removeItem("walkPath");
    await AsyncStorage.removeItem("firstTimeout");
    await AsyncStorage.removeItem("secondTimeout");
    await AsyncStorage.removeItem("groupWalkId");
    await AsyncStorage.removeItem("groupWalkData");
    await AsyncStorage.removeItem("walkDistance");
    await AsyncStorage.removeItem("summaryVisible");
    await AsyncStorage.removeItem("dogsParticipating");
    await AsyncStorage.removeItem("visibilityMode");
  };

  return (
    <WalksContext.Provider
      value={{
        permissionsGranted,
        isRecording,
        summaryVisible,
        firstTimeout,
        secondTimeout,
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
        updateState,
        endWalk,
        reset,
      }}
    >
      {children}
    </WalksContext.Provider>
  );
};
