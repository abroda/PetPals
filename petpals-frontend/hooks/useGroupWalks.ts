import {
  GroupWalksContext,
  GroupWalksContextType,
} from "@/context/GroupWalksContext";
import { useContext } from "react";

export function useGroupWalks() {
  return useContext(GroupWalksContext) as GroupWalksContextType;
}
