import { MqttContext, MqttContextType } from "@/context/MqttContext";
import { useContext } from "react";

export function useMqtt() {
  return useContext(MqttContext) as MqttContextType;
}
