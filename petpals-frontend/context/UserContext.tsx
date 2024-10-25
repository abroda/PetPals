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
import { useAuth } from "@/hooks/useAuth";


export type UserContextType = {
  isProcessing: boolean;
  responseMessage: string;
  userProfile: UserProfile | null;
  getUserById: (id: string) => Promise<boolean>;
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  description: string;
  imageUrl: string | null;
  visibility: string;
};

export const UserContext = createContext<UserContextType | null>(null);


export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const { authToken, userId } = useAuth(); // Assuming useAuth provides authToken

  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},

    onOKResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("OK: " + payload.message);
      console.log("OK: ", payload)
    },

    onBadResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("Server error: " + payload.message);
      console.log("NOT OK: ", payload)
    },

    onJSONParseError: (reason: any) => void = (reason: any) => {
      setResponseMessage("JSON parse error: " + reason);
      console.log("JSON Parse error: ", reason);
    },

    onError: (error: Error) => void = (error: Error) => {
      setResponseMessage("Fetch error: " + error.message);
      console.log("ERROR: ", error);
    }
  ) => {
    setResponseMessage("");
    setIsProcessing(true);

    console.log(`Sending request to: ${path} with method: ${method}`);
    console.log("Payload:", payload);

    const options: RequestInit = {
      method: method,
      mode: "cors",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    };

    if (method !== "GET") {
      options.body = JSON.stringify(payload);
    }

    return fetch(path, options)
      .then((response: Response) => {
        console.log("Raw response received:", response);

        // Check if there is content to parse
        if (!response.ok) {
          return response.text().then((text) => {
            console.log("Error Response Text: ", text);
            onBadResponse({ message: text || response.statusText });
            return false;
          });
        }

        // If response has no content (like 204 No Content), don't try to parse JSON
        if (response.status === 204 || response.headers.get("Content-Length") === "0") {
          console.log("No content to parse");
          onOKResponse({});
          setIsProcessing(false);
          return true;
        }

        return response
            .json()
            .then((payload) => {
              onOKResponse(payload);
              setIsProcessing(false);
              return true;
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


  // Fetch user data by ID
  const getUserById = async (id: string) => {

	console.log(`Fetching user by ID: ${id}`);

    return sendJsonQuery(
      apiPaths.users.getUserById(id),
      "GET",
      {},
      (payload) => {
        console.log("User data fetched successfully:", payload);
        setUserProfile({
          id: payload.id,
          email: payload.email,
          username: payload.username,
          description: payload.description,
          imageUrl: payload.imageUrl,
          visibility: payload.visibility,
        });
        setResponseMessage("User data fetched successfully!");
        console.log("Fetched data: ", payload.id, payload.email)
      },
      (payload) => {
        console.error("Failed to fetch user:", payload);
        setResponseMessage("Failed to fetch user: " + payload.message);
      }
    );
  };

  return (
    <UserContext.Provider
      value={{
        isProcessing,
        responseMessage,
        userProfile,
        getUserById,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
