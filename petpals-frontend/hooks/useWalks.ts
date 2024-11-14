import { WalksContext, WalksContextType } from "@/context/WalksContext";
import { useContext } from "react";

export function useWalks() {
  return useContext(WalksContext) as WalksContextType;
}
