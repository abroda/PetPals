import {
  RecordWalkContext,
  RecordWalkContextType,
} from "@/context/RecordWalkContext";
import { useContext } from "react";

export function useRecordWalk() {
  return useContext(RecordWalkContext) as RecordWalkContextType;
}
