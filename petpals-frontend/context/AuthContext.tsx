import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { serverQuery } from "@/hooks/serverQuery";

export type AuthContextType = {
  isLoading: boolean;
  isProcessing: boolean;
  authToken?: string;
  userId?: string;
  userEmail?: string;
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

  const [authToken, setAuthToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const codeRegex = "^[0-9]{6}$";
  const passwordRegex =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";

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
        email: email,
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
        email: email,
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
        email: email,
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
        email: email,
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
        email: email,
        password: password,
        code: code,
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
        email: email,
        password: password,
      },
      onOKResponse: (payload: any) => {
        setUserId(payload.id);
        setUserEmail(email);
        setAuthToken(payload.token);
        asyncStorage.setItem("userId", JSON.stringify(userId));
        asyncStorage.setItem("userEmail", JSON.stringify(userEmail));
        asyncStorage.setItem("authToken", JSON.stringify(authToken));
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
    await asyncStorage.setItem("userId", "");
    await asyncStorage.setItem("userEmail", "");
    await asyncStorage.setItem("authToken", "");

    setIsProcessing(false);
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

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      load();
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
