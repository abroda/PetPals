import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { serverQuery } from "@/helpers/serverQuery";
// import * as TaskManager from "expo-task-manager";

export type AuthContextType = {
  isLoading: boolean;
  isProcessing: boolean;
  authToken?: string|null;
  userId?: string|null;
  userEmail?: string|null;
  passwordRegex: string;
  codeRegex: string;
  register: (
    displayName: string,
    email: string,
    password: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  verifyEmail: (
    email: string,
    code: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  resendVerification: (
    email: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  sendPasswordResetCode: (
    email: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  resetPassword: (
    email: string,
    password: string,
    code: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  login: (
    email: string,
    password: string,
    asyncAbortController?: AbortController
  ) => Promise<{ success: boolean; returnValue: any }>;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const [authToken, setAuthToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const codeRegex = "^[0-9]{6}$";
  const passwordRegex =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";

  // Logging to check when userId is populated
  useEffect(() => {
    if (userId) {
      console.log("[AuthContext] User ID available in AuthContext:", userId);
    }
  }, [userId]);

  const register = async (
    displayName: string,
    email: string,
    password: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.auth.register,
      payload: {
        displayName: displayName,
        email: email.trimStart().trimEnd(),
        password: password,
      },
      onOKResponse: (payload: any) => setUserEmail(email),
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const verifyEmail = async (
    email: string,
    verificationCode: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.auth.verifyEmail,
      payload: {
        email: email.trimStart().trimEnd(),
        verificationCode: verificationCode,
      },
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const resendVerification = async (
    email: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.auth.resend,
      payload: {
        email: email.trimStart().trimEnd(),
      },
      onOKResponse: (payload: any) => "Verifcation code resent.",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const sendPasswordResetCode = async (
    email: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.auth.sendPasswordResetCode,
      payload: {
        email: email.trimStart().trimEnd(),
      },
      onOKResponse: (payload: any) => "Password reset code sent.",
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const resetPassword = async (
    email: string,
    password: string,
    code: string,
    asyncAbortController?: AbortController
  ) => {
    return serverQuery({
      path: apiPaths.auth.resetPassword,
      payload: {
        email: email.trimStart().trimEnd(),
        password: password,
        code: code.trimStart().trimEnd(),
      },
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const login = async (
    email: string,
    password: string,
    asyncAbortController?: AbortController
  ) => {
    return await serverQuery({
      path: apiPaths.auth.login,
      payload: {
        email: email.trimStart().trimEnd(),
        password: password,
      },
      onOKResponse: async (payload: any) => {
        setUserId(payload.id);
        setUserEmail(email.trimStart().trimEnd());
        setAuthToken(payload.token);

        // Await AsyncStorage updates to ensure consistency
        await asyncStorage.setItem("userId", payload.id);
        await asyncStorage.setItem("userEmail", email);
        await asyncStorage.setItem("authToken", payload.token);

        return;
      },
      onStart: () => setIsProcessing(true),
      onEnd: () => setIsProcessing(false),
      asyncAbortController: asyncAbortController,
    });
  };

  const logout = async () => {
    setIsProcessing(true);

    setUserId("");
    setUserEmail("");
    setAuthToken("");
    await asyncStorage.clear();
    // await asyncStorage.setItem("userId", "");
    // await asyncStorage.setItem("userEmail", "");
    // await asyncStorage.setItem("authToken", "");

    setIsProcessing(false);

    // TaskManager.isTaskRegisteredAsync("background-location-task").then(
    //   (registered) => {
    //     if (registered) {
    //       TaskManager.unregisterTaskAsync("background-location-task");
    //     }
    //   }
    // );
  };

  const load = async () => {
    setIsProcessing(true);

    asyncStorage.getItem("userId").then((value) => {
      setUserId(value ?? "");
    });
    asyncStorage.getItem("userEmail").then((value) => {
      setUserEmail(value ?? "");
    });
    asyncStorage.getItem("authToken").then((value) => {
      setAuthToken(value ?? "");
    });

    setIsProcessing(false);
  };

  useEffect(() => {
    if (isLoading) {
      console.log("LOADING")
      load().then(r => setIsLoading(false));
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isProcessing,
        userId,
        userEmail,
        authToken,
        passwordRegex,
        codeRegex,
        register,
        verifyEmail,
        resendVerification,
        sendPasswordResetCode,
        resetPassword,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
