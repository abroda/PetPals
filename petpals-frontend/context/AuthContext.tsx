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
  const [responseMessage, setResponseMessage] = useState("");
  const passwordRegex =
    "^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$";
  const codeRegex = "^[0-9]{6}$";

  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},
    onOKResponse: (payload: any) => void = (payload: any) =>
      setResponseMessage("OK: " + payload.message),
    onBadResponse: (payload: any) => void = (payload: any) =>
      setResponseMessage("Server error: " + payload.message),
    onJSONParseError: (reason: any) => void = (reason: any) =>
      setResponseMessage("JSON parse error: " + reason),
    onError: (error: Error) => void = (error: Error) =>
      setResponseMessage("Fetch error: " + error.message)
  ) => {
    setResponseMessage("");
    setIsProcessing(true);

    return fetch(path, {
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
              onOKResponse(payload);
              setIsProcessing(false);
              return true;
            } else {
              onBadResponse(payload);
              setIsProcessing(false);
              return false;
            }
          })
          .catch((reason) => {
            onJSONParseError(reason);
            setIsProcessing(false);
            return false;
          });
      })
      .catch((error: Error) => {
        onError(error);
        setIsProcessing(false);
        return false;
      });
  };

  const register = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    let success = await sendJsonQuery(
      apiPaths.auth.register,
      "POST",
      {
        displayName: displayName,
        email: email,
        password: password,
      },
      (payload) => setUserEmail(email)
    );
    return { success: success, message: responseMessage };
  };

  const verifyEmail = async (email: string, verificationCode: string) => {
    let success = await sendJsonQuery(apiPaths.auth.verifyEmail, "POST", {
      email: email,
      verificationCode: verificationCode,
    });
    return { success: success, message: responseMessage };
  };

  const resendVerification = async (email: string) => {
    let success = await sendJsonQuery(apiPaths.auth.resend, "POST", {
      email: email,
    });
    return { success: success, message: responseMessage };
  };

  const sendPasswordResetCode = async (email: string) => {
    let success = await sendJsonQuery(
      apiPaths.auth.sendPasswordResetCode,
      "POST",
      {
        email: email,
      }
    );
    return { success: success, message: responseMessage };
  };

  const confirmPasswordReset = async (email: string, code: string) => {
    let success = await sendJsonQuery(
      apiPaths.auth.sendPasswordResetCode,
      "POST",
      {
        email: email,
        code: code,
      }
    );
    return { success: success, message: responseMessage };
  };

  const resetPassword = async (
    email: string,
    password: string,
    code: string
  ) => {
    let success = await sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      email: email,
      password: password,
      code: code,
    });
    return { success: success, message: responseMessage };
  };

  const login = async (email: string, password: string) => {
    let success = await sendJsonQuery(
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
      }
    );
    return { success: success, message: responseMessage };
  };

  const logout = async () => {
    setResponseMessage("");
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
        setResponseMessage("Logout: " + error.message);
        return false;
      });

    setIsProcessing(false);
    return { success: success, message: responseMessage };
  };

  const load = async () => {
    setResponseMessage("");
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
        responseMessage,
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
