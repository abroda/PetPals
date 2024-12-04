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
  userProfile?: UserProfile;
  getUserById: (id: string) => Promise<boolean>;
  fetchUserById: (id: string) =>  Promise<UserProfile | null>;
  updateUser: (id: string, data: Partial<UserProfile>) => Promise<boolean>;
  changeUserAvatar: (id: string, file: File | Blob) => Promise<false | true>;
  searchUsers: (query: string) => Promise<UserProfile[]>;
};

export type UserProfile = {
  id: string;
  email: string;
  username: string;
  description: string;
  imageUrl?: string;
  visibility: string;
};

export const UserContext = createContext<UserContextType | null>(null);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [responseMessage, setResponseMessage] = useState("");
  const [userProfile, setUserProfile] = useState<UserProfile>();
  const { authToken, userId } = useAuth(); // Assuming useAuth provides authToken

  useEffect(() => {
    if (userId) {
      getUserById(userId).catch((error) => {
        console.error("Failed to fetch user profile:", error);
      });
    }
  }, [userId]);

  const sendJsonQuery = async (
    path: string,
    method: string = "POST",
    payload: any = {},

    onOKResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("OK: " + payload.message);
      console.log("OK: ", payload);
    },

    onBadResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("Server error: " + payload.message);
      console.log("NOT OK: ", payload);
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
        if (
          response.status === 204 ||
          response.headers.get("Content-Length") === "0"
        ) {
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
        console.log(
          "Fetched data:\nid -- ",
          payload.id,
          " | email -- ",
          payload.email,
          " | username -- ",
          payload.username,
          "imgaeUrl -- ",
          payload.imageUrl
        );
      },
      (payload) => {
        console.error("Failed to fetch user:", payload);
        setResponseMessage("Failed to fetch user: " + payload.message);
      }
    );
  };


  // Get a user by id and return this user data (similar to getUserById, but does not populate UserProfile)
  const fetchUserById = async (id: string): Promise<UserProfile | null> => {
    console.log(`Fetching user by ID: ${id}`);
    let fetchedUser: UserProfile | null = null;

    await sendJsonQuery(
      apiPaths.users.getUserById(id),
      "GET",
      {},
      (payload) => {
        console.log("User data fetched successfully:", payload);
        fetchedUser = {
          id: payload.id,
          email: payload.email,
          username: payload.username,
          description: payload.description,
          imageUrl: payload.imageUrl,
          visibility: payload.visibility,
        };
      },
      (payload) => {
        console.error("Failed to fetch user:", payload);
        setResponseMessage("Failed to fetch user: " + payload.message);
      }
    );

    return fetchedUser;
  };



  // Update user data
  const updateUser = async (id: string, data: Partial<UserProfile>) => {
    console.log(`Updating user data for ID: ${id} with data:`, data);

    return sendJsonQuery(
      apiPaths.users.updateUser(id),
      "PUT",
      data,
      (payload) => {
        // Update the local userProfile state with the new data
        setUserProfile({
          id: payload.id,
          email: payload.email,
          username: payload.username,
          description: payload.description,
          imageUrl: payload.imageUrl,
          visibility: payload.visibility,
        });
        setResponseMessage("User data updated successfully!");
        console.log("User updated data:", payload);
      },
      (payload) => {
        setResponseMessage("Failed to update user: " + payload.message);
      }
    );
  };


  const sendFileQuery = async (
    path: string,
    method: string = "POST",
    file: File | Blob,
    onOKResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("OK: " + payload.message);
    },
    onBadResponse: (payload: any) => void = (payload: any) => {
      setResponseMessage("Server error: " + payload.message);
    },
    onError: (error: Error) => void = (error: Error) => {
      setResponseMessage("Fetch error: " + error.message);
    }
  ) => {
    setResponseMessage("");
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file); // The backend expects "file" as the key

    const options: RequestInit = {
      method: method,
      mode: "cors",
      headers: {
        Authorization: `Bearer ${authToken}`, // Attach auth token for protected route
      },
      body: formData,
    };

    console.log(`Sending file upload request to: ${path}`);

    return fetch(path, options)
      .then((response: Response) => {
        if (!response.ok) {
          return response.text().then((text) => {
            console.log("Error Response Text: ", text);
            onBadResponse({ message: text || response.statusText });
            return false;
          });
        }
        return response
          .json()
          .then((payload) => {
            onOKResponse(payload);
            setIsProcessing(false);
            return true;
          })
          .catch((error) => {
            onError(error);
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


  const changeUserAvatar = async (id: string, file: File | Blob) => {
    console.log(`Updating user avatar for ID: ${id}`);

    return sendFileQuery(
      apiPaths.users.updateUserProfilePicture(id), // Assuming the path is correct in apiPaths
      "PUT",
      file,
      (payload) => {
        setUserProfile({
          id: payload.id,
          email: payload.email,
          username: payload.username,
          description: payload.description,
          imageUrl: payload.imageUrl,
          visibility: payload.visibility,
        });
        setResponseMessage("User avatar updated successfully!");
        console.log("User avatar updated:", payload.imageUrl);
      },
      (payload) => {
        setResponseMessage("Failed to update user avatar: " + payload.message);
      }
    );
  };


  // Fetch users matching the query and visibility
  const searchUsers = async (query: string): Promise<UserProfile[]> => {
    console.log(`Searching users with query: "${query}"`);

    const results: UserProfile[] = [];

    await sendJsonQuery(
      apiPaths.users.getAllUsers,
      "GET",
      {},
      (payload) => {
        if (Array.isArray(payload)) {
          const filteredUsers = payload.filter(
            (user: UserProfile) =>
              user.visibility === "PUBLIC" &&
              user.username.toLowerCase().includes(query.toLowerCase())
          );
          console.log("Filtered users:", filteredUsers);
          results.push(...filteredUsers); // Add filtered users
        } else {
          console.error("Unexpected response type:", payload);
        }
      },
      (payload) => {
        console.error("Failed to fetch users:", payload);
      }
    );

    return results; // Return the list of users
  };



  return (
    <UserContext.Provider
      value={{
        isProcessing,
        responseMessage,
        userProfile,
        getUserById,
        fetchUserById,
        updateUser,
        changeUserAvatar, // Add this line
        searchUsers,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
