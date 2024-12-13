import mqtt from "@taoqf/react-native-mqtt";
import { PathVertex, VisibilityMode } from "./RecordWalkContext";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRecordWalk } from "@/hooks/useRecordWalk";
import { mqttPassword, mqttURL, mqttUsername } from "@/constants/config/mqtt";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type MqttContextType = {
  mqttConnect: (
    onNearbyUsersUpdate: (payload: any) => void,
    onWalkParticipantsUpdate: (payload: any) => void
  ) => void;
  mqttDisconnect: () => void;
  mqttSubscribe: (groupWalkId?: string) => void;
  mqttUnsubscribe: (groupWalkId?: string) => void;
  sendStartWalkMessage: (payload: {
    timestamp: string;
    visibility: VisibilityMode;
    dogIds: string[];
    groupWalkId?: string;
  }) => void;
  sendLocationUpdate: (payload: {
    userId: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    groupWalkId?: string;
  }) => void;
  sendEndWalkMessage: (payload: {
    timestamp: string;
    locations: PathVertex[];
    groupWalkId: string;
  }) => void;
};

export const MqttContext = createContext<MqttContextType | null>(null);

export const MqttProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { userId } = useAuth();
  const [mqttClient, setMqttClient] = useState<mqtt.MqttClient | null>(null);

  useEffect(() => {
    // clean up
    return () => {
      mqttClient?.removeAllListeners();
      mqttClient?.end();
    };
  }, []);

  const mqttConnect = (
    onNearbyUsersUpdate: (payload: any) => void,
    onWalkParticipantsUpdate: (payload: any) => void
  ) => {
    console.log("Connecting to MQTT...");

    if (mqttClient) {
      mqttDisconnect();
    }

    const client = mqtt.connect(mqttURL, {
      username: mqttUsername,
      password: mqttPassword,
      clientId: `user-${userId}`,
      reconnectPeriod: 3000,
      clean: false,
    });

    client.on("connect", () => {
      console.log("Connected to MQTT broker");
      handleUnsentMessages();
    });

    client.on("message", (topic, message) => {
      if (topic === `location/nearby/${userId}`) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          // console.log(
          //   "Nearby users recieved: " + JSON.stringify(parsedMessage)
          // );
          onNearbyUsersUpdate(parsedMessage);
        } catch (err) {
          console.error("Error parsing message from location/nearby:", err);
        }
      }

      if (
        topic.startsWith("location/walk/") &&
        topic.endsWith(userId ?? "null")
      ) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          // console.log(
          //   "Participants recieved: " + JSON.stringify(parsedMessage)
          // );
          onWalkParticipantsUpdate(parsedMessage);
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

    client.on("offline", () => {
      console.log("MQTT client offline");
    });

    client.on("reconnect", () => {
      console.log("MQTT reconnecting...");
    });

    setMqttClient(client);
  };

  const mqttDisconnect = () => {
    mqttUnsubscribe();
    mqttClient?.removeAllListeners();
    mqttClient?.end();
  };

  const mqttSubscribe = (groupWalkId?: string) => {
    mqttClient?.subscribe(`location/nearby/${userId}`);
    if (groupWalkId) {
      mqttClient?.subscribe(`location/walk/${groupWalkId}/${userId}`);
    }
  };

  const mqttUnsubscribe = (groupWalkId?: string) => {
    mqttClient?.unsubscribe(`location/nearby/${userId}`);
    if (groupWalkId) {
      mqttClient?.unsubscribe(`location/walk/${groupWalkId}/${userId}`);
    }
  };

  const sendStartWalkMessage = (payload: {
    timestamp: string;
    visibility: VisibilityMode;
    dogIds: string[];
    groupWalkId?: string;
  }) => {
    const message = JSON.stringify(payload);
    sendMessageWithRetries("startWalkMessage", `walk/start/${userId}`, message);
  };

  const sendLocationUpdate = (payload: {
    userId: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    groupWalkId?: string;
  }) => {
    const message = JSON.stringify(payload);
    mqttClient?.publish(`location/user/${userId}`, message, {
      qos: 1,
    });
  };

  const sendEndWalkMessage = (payload: {
    timestamp: string;
    locations: PathVertex[];
    groupWalkId: string;
  }) => {
    const message = JSON.stringify(payload);
    sendMessageWithRetries("endWalkMessage", `walk/end/${userId}`, message);
  };

  const sendMessageWithRetries = (
    key: string,
    topic: string,
    message: string
  ) => {
    return new Promise<void>((resolve) => {
      mqttClient?.publish(topic, message, { qos: 2 }, async (error) => {
        if (error) {
          console.log(`error sending message to ${topic}:`, error);
          await saveMessage(key, { topic, message });
          resolve();
        } else {
          console.log(`message sent to ${topic}.`);
          await removeMessage(key);
          resolve();
        }
      });
    });
  };

  const saveMessage = async (
    key: string,
    data: { topic: string; message: string }
  ) => {
    console.log("saving message " + key + " to send on reconnect.");
    try {
      await AsyncStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.log("mqttContext saveMessage error:", error);
    }
  };

  const removeMessage = async (key: string) => {
    console.log("removing message " + key);
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.log("mqttContext removeMessage error:", error);
    }
  };

  const handleUnsentMessages = async () => {
    console.log("sending unsent messages:");
    try {
      let item = await AsyncStorage.getItem("startWalkMessage");
      console.log("startWalkMessage = " + item);
      if (item) {
        console.log("sending start walk message");
        let data = JSON.parse(item);
        if (data.topic && data.message) {
          await sendMessageWithRetries(
            "startWalkMessage",
            data.topic,
            data.message
          );
        }
      }
    } catch (error) {
      console.log("mqttContext handleUnsentMessages start: ", error);
    }

    try {
      let item = await AsyncStorage.getItem("endWalkMessage");
      console.log("endWalkMessage = " + item);
      if (item) {
        console.log("sending start end message");
        let data = JSON.parse(item);
        if (data.topic && data.message) {
          await sendMessageWithRetries(
            "endWalkMessage",
            data.topic,
            data.message
          );
        }
      }
    } catch (error) {
      console.log("mqttContext handleUnsentMessages end", error);
    }
  };

  return (
    <MqttContext.Provider
      value={{
        mqttConnect,
        mqttDisconnect,
        mqttSubscribe,
        mqttUnsubscribe,
        sendStartWalkMessage,
        sendLocationUpdate,
        sendEndWalkMessage,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};
