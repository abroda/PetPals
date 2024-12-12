import mqtt from "@taoqf/react-native-mqtt";
import { PathVertex, VisibilityMode } from "./RecordWalkContext";
import { createContext, FC, ReactNode, useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useRecordWalk } from "@/hooks/useRecordWalk";
import { mqttPassword, mqttURL, mqttUsername } from "@/constants/config/mqtt";

export type MqttContextType = {
  mqttConnect: (
    onNearbyUsersUpdate: (payload: any) => void,
    onWalkParticipantsUpdate: (topic: string, payload: any) => void
  ) => void;
  mqttDisconnect: () => void;
  mqttSubscribe: (groupWalkId?: string) => void;
  mqttUnsubscribe: (groupWalkId?: string) => void;
  sendStartWalkMessage: (payload: {
    timestamp: string;
    visibility: VisibilityMode;
    dogIds: string[];
    walkId?: string;
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

  const mqttConnect = async (
    onNearbyUsersUpdate: (payload: any) => void,
    onWalkParticipantsUpdate: (topic: string, payload: any) => void
  ) => {
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
          onNearbyUsersUpdate(parsedMessage);
        } catch (err) {
          console.error("Error parsing message from location/nearby:", err);
        }
      }

      if (topic.startsWith("location/walk/")) {
        try {
          const parsedMessage = JSON.parse(message.toString());
          console.log("Participants recieved: " + parsedMessage);
          onWalkParticipantsUpdate(topic, parsedMessage);
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

  const mqttDisconnect = () => {
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

  const sendStartWalkMessage = async (payload: {
    timestamp: string;
    visibility: VisibilityMode;
    dogIds: string[];
    walkId?: string;
  }) => {
    console.log("Sending start message");
    // ensure mqtt is on
    if (!mqttClient || !mqttClient.connected) {
      mqttClient?.reconnect();
    }

    const message = JSON.stringify(payload);

    // send start walk message
    mqttClient?.publish(`walk/start/${userId}`, message, {
      qos: 1,
    });
  };

  const sendLocationUpdate = async (payload: {
    userId: string;
    latitude: number;
    longitude: number;
    timestamp: string;
    groupWalkId?: string;
  }) => {
    if (!mqttClient || !mqttClient.connected) {
      mqttClient?.reconnect();
    }

    const message = JSON.stringify(payload);

    mqttClient?.publish(`location/user/${userId}`, message, {
      qos: 1,
    });
  };

  const sendEndWalkMessage = async (payload: {
    timestamp: string;
    locations: PathVertex[];
    groupWalkId: string;
  }) => {
    if (!mqttClient || !mqttClient.connected) {
      mqttClient?.reconnect();
    }

    const message = JSON.stringify(payload);

    mqttClient?.publish(`walk/end/${userId}`, message, { qos: 1 });
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
