import {
  RecordWalkMemoryContext,
  RecordWalkMemoryContextType,
} from "@/context/RecordWalkMemoryContext";
import { useContext } from "react";

export function useRecordWalkMemory() {
  return useContext(RecordWalkMemoryContext) as RecordWalkMemoryContextType;
}
