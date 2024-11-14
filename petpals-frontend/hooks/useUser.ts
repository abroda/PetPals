import { useContext } from "react";
import { UserContext, UserContextType } from "@/context/UserContext";

export function useUser() {
  return useContext(UserContext) as UserContextType;
}
