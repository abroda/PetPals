import React, {
  createContext,
  FC,
  ReactNode,
  useEffect,
  useState,
} from "react";
import { apiPaths } from "@/constants/config/api";
import asyncStorage from "@react-native-async-storage/async-storage/src/AsyncStorage";
import { Dictionary } from "react-native-ui-lib/src/typings/common";

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
  ) => Promise<boolean>;
  verifyEmail: (email: string, code: string) => Promise<boolean>;
  resendVerification: (email: string) => Promise<boolean>;
  sendPasswordResetCode: (email: string) => Promise<boolean>;
  confirmPasswordReset: (email: string, code: string) => Promise<boolean>;
  resetPassword: (
    email: string,
    password: string,
    code: string
  ) => Promise<boolean>;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<boolean>;
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

  const sendJsonQuery = (path: string, method: string, payload?: any) =>
    fetch(path, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

  const checkConnection = async () => {
    setIsProcessing(true);
    setResponseMessage("");

    // @ts-ignore
      return sendJsonQuery(apiPaths.checkConnection, "GET")
      .then((_) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Check connection: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const register = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.register, "POST", {
      displayName: displayName,
      email: email,
      password: password,
    })
      .then((response: Dictionary<any>) => {
        setIsProcessing(false);
        setUserEmail(email);
        return true;
      })
      .catch((err: Error) => {
        console.error("Register: " + err.message);
        setResponseMessage("Register: error");
        setIsProcessing(false);
        return false;
      });
  };

  const verifyEmail = async (email: string, verificationCode: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.verifyEmail, "POST", {
      email: email,
      verificationCode: verificationCode,
    })
      .then((_) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Verify email: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const resendVerification = async (email: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.verifyEmail, "POST", email)
      .then((_) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Resend verification: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const sendPasswordResetCode = async (email: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
      email: email,
    })
      .then((response: string) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Request password reset: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const confirmPasswordReset = async (email: string, code: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
      email: email,
      code: code,
    })
      .then((response: string) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Confirm password reset: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const resetPassword = async (
    email: string,
    password: string,
    code: string
  ) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      email: email,
      password: password,
      code: code,
    })
      .then((response: Dictionary<any>) => {
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error("Reset password: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const checkSavedLogin = async () => {
    setIsProcessing(true);
    setResponseMessage("");
    // TODO
    setIsProcessing(false);
    return false;
  };

  const login = async (email: string, password: string) => {
    setIsProcessing(true);
    setResponseMessage("");

    return sendJsonQuery(apiPaths.auth.login, "POST", {
      email: email,
      password: password,
    })
      .then((response: Dictionary<any>) => {
        setUserId(response.id);
        setAuthToken(response.token);
        asyncStorage.setItem("authToken", JSON.stringify(authToken));
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Login: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  const logout = async () => {
    setIsProcessing(true);
    setResponseMessage("");

    return asyncStorage
      .setItem("authToken", authToken)
      .then(() => {
        setAuthToken("");
        setIsProcessing(false);
        return true;
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage("Logout: " + err.message);
        setIsProcessing(false);
        return false;
      });
  };

  useEffect(() => {
    if (isLoading) {
      checkSavedLogin().then(() => setIsLoading(false));
    }
  }, [isLoading, isProcessing, responseMessage]);

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
