import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";

export type AuthContextType = {
  isLoading: boolean;
  isProcessing: boolean;
  authToken?: string;
  userId?: string;
  userEmail?: string;
  responseMessage?: string;
  passwordRegex: string;
  codeRegex: string;
  register: (
    displayName: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  verifyEmail: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  resendVerification: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  sendPasswordResetCode: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  confirmPasswordReset: (
    email: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  resetPassword: (
    email: string,
    password: string,
    code: string
  ) => Promise<{ success: boolean; message: string }>;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<{ success: boolean; message: string }>;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const passwordRegex =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";
  const codeRegex = "^[0-9]{6}$";

  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},
    onOKResponse: (payload: any) => string = (payload: any) =>
      `OK: ${payload.message}`,
    onBadResponse: (payload: any) => string = (payload: any) =>
      `Server error: ${payload.message}`,
    onJsonParseError: (reason: any) => string = (reason: any) =>
      `JSON parse error: ${reason}`,
    onError: (error: Error) => string = (error: Error) =>
      `Fetch error: ${error.message}`
  ) => {
    setIsProcessing(true);

    return await fetch(path, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((response: Response) => {
        return response
          .json()
          .then((payload) => {
            if (response.ok) {
              setIsProcessing(false);
              return { success: true, message: onOKResponse(payload) };
            } else {
              setIsProcessing(false);
              return { success: false, message: onBadResponse(payload) };
            }
          })
          .catch((reason) => {
            setIsProcessing(false);
            return { success: false, message: onJsonParseError(reason) };
          });
      })
      .catch((error: Error) => {
        setIsProcessing(false);
        return { success: false, message: onError(error) };
      });
  };

  const register = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    return await sendJsonQuery(
      apiPaths.auth.register,
      "POST",
      {
        displayName: displayName,
        email: email,
        password: password,
      },
      (payload) => {
        setUserEmail(email);
        return "";
      }
    );
  };

  const verifyEmail = async (email: string, verificationCode: string) => {
    return await sendJsonQuery(apiPaths.auth.verifyEmail, "POST", {
      email: email,
      verificationCode: verificationCode,
    });
  };

  const resendVerification = async (email: string) => {
    return await sendJsonQuery(apiPaths.auth.resend, "POST", {
      email: email,
    });
  };

  const sendPasswordResetCode = async (email: string) => {
    return await sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
      email: email,
    });
  };

  const confirmPasswordReset = async (email: string, code: string) => {
    return await sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
      email: email,
      code: code,
    });
  };

  const resetPassword = async (
    email: string,
    password: string,
    code: string
  ) => {
    return await sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      email: email,
      password: password,
      code: code,
    });
  };

  const login = async (email: string, password: string) => {
    return await sendJsonQuery(
      apiPaths.auth.login,
      "POST",
      {
        email: email,
        password: password,
      },
      (payload) => {
        setUserId(payload.id);
        setUserEmail(email);
        setAuthToken(payload.token);
        asyncStorage.setItem("userId", JSON.stringify(userId));
        asyncStorage.setItem("userEmail", JSON.stringify(userEmail));
        asyncStorage.setItem("authToken", JSON.stringify(authToken));
        return "";
      }
    );
  };

  const logout = async () => {
    setIsProcessing(true);
    let success = await asyncStorage
      .setItem("authToken", authToken)
      .then(() => {
        setUserId("");
        setUserEmail("");
        setAuthToken("");
        return true;
      })
      .catch((error: Error) => {
        console.error("Logout: " + error.message);
        return false;
      });

    setIsProcessing(false);
    return { success: success, message: "" };
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
        confirmPasswordReset,
        resetPassword,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
