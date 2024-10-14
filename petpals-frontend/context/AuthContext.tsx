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
  userEmail?: string;
  responseMessage?: string;
  checkConnection: () => void;
  register: (displayName: string, email: string, password: string) => void;
  verifyEmail: (email: string, code: string) => void;
  resendVerification: (email: string) => void;
  requestPasswordReset: (email: string) => void;
  confirmPasswordReset: (email: string, code: string) => void;
  resetPassword: (email: string, password: string, code: string) => void;
  login: (email: string, password: string) => void;
  logout: () => void;
};

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isProcessing, setIsProcessing] = useState(false);
  const [authToken, setAuthToken] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const sendJsonQuery = (path: string, method: string, payload?: any) =>
    fetch(path, {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json", // Ensure the Content-Type is set to application/json
      },
      body: JSON.stringify(payload),
    }).then((response) => response.json());

  const checkConnection = async () => {
    setIsProcessing(true);

    await sendJsonQuery(apiPaths.checkConnection, "GET")
      .then((_) => {
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });

    setIsProcessing(false);
  };

  const register = async (
    displayName: string,
    email: string,
    password: string
  ) => {
    setIsProcessing(true);

    await sendJsonQuery(apiPaths.auth.register, "POST", {
      displayName: displayName,
      email: email,
      password: password,
    })
      .then((response: Dictionary<any>) => {
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const verifyEmail = async (email: string, verificationCode: string) => {
    setIsProcessing(true);
    await sendJsonQuery(apiPaths.auth.verifyEmail, "POST", {
      email: email,
      verificationCode: verificationCode,
    })
      .then((_) => {
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const resendVerification = async (email: string) => {
    setIsProcessing(true);
    await sendJsonQuery(apiPaths.auth.verifyEmail, "POST", email)
      .then((_) => {
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const requestPasswordReset = async (email: string) => {
    setIsProcessing(true);
    await sendJsonQuery(apiPaths.auth.requestPasswordReset, "POST", {
      email: email,
    })
      .then((response: string) => {
        setResponseMessage(response);
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const confirmPasswordReset = async (email: string, code: string) => {
    setIsProcessing(true);
    await sendJsonQuery(apiPaths.auth.confirmPasswordReset, "POST", {
      email: email,
      code: code,
    })
      .then((response: string) => {
        setResponseMessage(response);
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const resetPassword = async (
    email: string,
    password: string,
    code: string
  ) => {
    await sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
      email: email,
      password: password,
      code: code,
    })
      .then((response: Dictionary<any>) => {
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const checkSavedLogin = async () => {
    setIsProcessing(true);
    await asyncStorage
      .getItem("authToken")
      .then((token: string | null) => setAuthToken(token ?? ""));
    setIsProcessing(false);
    setIsLoading(false);
  };

  const login = async (email: string, password: string) => {
    await sendJsonQuery(apiPaths.auth.login, "POST", {
      email: email,
      password: password,
    })
      .then((response: Dictionary<any>) => {
        setUserEmail(email);
        setAuthToken(response.token);
        asyncStorage.setItem("authToken", JSON.stringify(authToken));
        setResponseMessage("OK");
        setIsProcessing(false);
      })
      .catch((err: Error) => {
        console.error(err.message);
        setResponseMessage(err.message);
        setIsProcessing(false);
      });
  };

  const logout = async () => {
    setIsProcessing(true);
    setAuthToken("");
    await asyncStorage.setItem("authToken", authToken);
    setIsProcessing(false);
  };

  useEffect(() => {
    if (isLoading) {
      //checkConnection();
      checkSavedLogin();
    }
  }, [isLoading, isProcessing, responseMessage]);

  return (
    <AuthContext.Provider
      value={{
        isLoading,
        isProcessing,
        userEmail,
        authToken,
        responseMessage,
        checkConnection,
        register,
        verifyEmail,
        resendVerification,
        requestPasswordReset,
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
