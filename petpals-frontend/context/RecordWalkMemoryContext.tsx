import AsyncStorage from "@react-native-async-storage/async-storage";
import { PathVertex, VisibilityMode } from "./RecordWalkContext";
import { createContext, FC, ReactNode } from "react";
import { GroupWalk } from "./GroupWalksContext";

export type RecordWalkMemory = {
  walkStartTime: Date;
  walkEndTime: Date | null;
  firstTimeout: Date;
  secondTimeout: Date;
  groupWalkData: GroupWalk | null;
  dogsParticipating: string[];
  visibilityMode: VisibilityMode;
  walkPath: PathVertex[];
};

export type RecordWalkMemoryContextType = {
  saveInStorage: (data: RecordWalkMemory) => Promise<void>;
  saveWalkPath: (newWalkPath: PathVertex[]) => Promise<void>;
  saveGroupWalkData: (groupWalkData: GroupWalk) => Promise<void>;
  saveTimeouts: (firstTimeout: Date, secondTimeout: Date) => Promise<void>;
  saveWalkEndTime: (walkEndTime: Date) => Promise<void>;
  restoreFromStorage: () => Promise<RecordWalkMemory | null>;
  deleteStorage: () => Promise<void>;
};

export const RecordWalkMemoryContext =
  createContext<RecordWalkMemoryContextType | null>(null);

export const RecordWalkMemoryProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const saveInStorage = async (data: RecordWalkMemory) => {
    console.log("save memory");

    await AsyncStorage.setItem(
      "walkStartTime",
      JSON.stringify(data.walkStartTime)
    );
    await AsyncStorage.setItem(
      "walkEndTime",
      JSON.stringify(data.walkEndTime ?? "null")
    );
    await AsyncStorage.setItem(
      "firstTimeout",
      JSON.stringify(data.firstTimeout)
    );
    await AsyncStorage.setItem(
      "secondTimeout",
      JSON.stringify(data.secondTimeout)
    );
    await AsyncStorage.setItem(
      "groupWalkData",
      JSON.stringify(data.groupWalkData ?? "null")
    );
    await AsyncStorage.setItem(
      "dogsParticipating",
      JSON.stringify(data.dogsParticipating)
    );
    await AsyncStorage.setItem(
      "visibilityMode",
      JSON.stringify(data.visibilityMode)
    );
    await AsyncStorage.setItem("walkPath", JSON.stringify(data.walkPath));
  };

  const saveWalkPath = async (newWalkPath: PathVertex[]) => {
    await AsyncStorage.setItem("walkPath", JSON.stringify(newWalkPath));
  };

  const saveGroupWalkData = async (groupWalkData: GroupWalk) => {
    await AsyncStorage.setItem("groupWalkData", JSON.stringify(groupWalkData));
  };

  const saveTimeouts = async (firstTimeout: Date, secondTimeout: Date) => {
    await AsyncStorage.setItem("firstTimeout", JSON.stringify(firstTimeout));
    await AsyncStorage.setItem("secondTimeout", JSON.stringify(secondTimeout));
  };

  const saveWalkEndTime = async (walkEndTime: Date) => {
    await AsyncStorage.setItem("walkEndTime", JSON.stringify(walkEndTime));
  };

  const restoreFromStorage = async () => {
    console.log("restore saved memory");

    let walkStartTime = JSON.parse(
      (await AsyncStorage.getItem("walkStartTime")) ?? "null"
    ) as Date | null;
    let walkEndTime = JSON.parse(
      (await AsyncStorage.getItem("walkEndTime")) ?? "null"
    ) as Date | null;
    let firstTimeout = JSON.parse(
      (await AsyncStorage.getItem("firstTimeout")) ?? "null"
    ) as Date | null;
    let secondTimeout = JSON.parse(
      (await AsyncStorage.getItem("secondTimeout")) ?? "null"
    ) as Date | null;
    let groupWalkData = JSON.parse(
      (await AsyncStorage.getItem("groupWalkData")) ?? "null"
    ) as GroupWalk | null;
    let dogsParticipating = JSON.parse(
      (await AsyncStorage.getItem("dogsParticipating")) ?? "null"
    ) as string[] | null;
    let visibilityMode = JSON.parse(
      (await AsyncStorage.getItem("visibilityMode")) ?? "null"
    ) as string | null;
    let walkPath = JSON.parse(
      (await AsyncStorage.getItem("walkPath")) ?? "null"
    ) as PathVertex[] | null;

    if (
      !walkStartTime ||
      !walkEndTime ||
      !firstTimeout ||
      !secondTimeout ||
      !dogsParticipating ||
      !visibilityMode ||
      !walkPath ||
      (visibilityMode !== "Public" &&
        visibilityMode !== "Friends_only" &&
        visibilityMode !== "Private")
    ) {
      return null;
    }

    return {
      walkStartTime: walkStartTime,
      walkEndTime: walkEndTime,
      firstTimeout: firstTimeout,
      secondTimeout: secondTimeout,
      groupWalkData: groupWalkData,
      dogsParticipating: dogsParticipating,
      visibilityMode: visibilityMode,
      walkPath: walkPath,
    } as RecordWalkMemory;
  };

  const deleteStorage = async () => {
    console.log("delete memory");

    await AsyncStorage.removeItem("walkStartTime");
    await AsyncStorage.removeItem("walkEndTime");
    await AsyncStorage.removeItem("firstTimeout");
    await AsyncStorage.removeItem("secondTimeout");
    await AsyncStorage.removeItem("groupWalkData");
    await AsyncStorage.removeItem("dogsParticipating");
    await AsyncStorage.removeItem("visibilityMode");
    await AsyncStorage.removeItem("walkPath");
  };

  const saveStartMessage = async (message: string) => {};

  return (
    <RecordWalkMemoryContext.Provider
      value={{
        saveInStorage,
        saveWalkPath,
        saveGroupWalkData,
        saveTimeouts,
        saveWalkEndTime,
        restoreFromStorage,
        deleteStorage,
      }}
    >
      {children}
    </RecordWalkMemoryContext.Provider>
  );
};
