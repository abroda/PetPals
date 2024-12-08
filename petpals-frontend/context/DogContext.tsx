import { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiPaths } from "@/constants/config/api"; // Adjust the import path as needed

export interface Dog {
  id: string;
  name: string;
  description: string;
  imageUrl: string | null;
  tags: { id: string; tag: string }[]; // Define tags based on your API response structure
  age?: number; // Age in months (optional)
  breed?: string; // Breed (optional)
  weight?: number; // Weight in kg (optional)
}

export interface Tag {
  id: string;
  tag: string;
  category: string;
}

interface DogContextProps {
  addDog: (userId: string, dogData: Partial<Dog>) => Promise<Dog | null>;
  updateDogTags: (dogId: string, tagIds: string[]) => Promise<void>;
  getAvailableTags: () => Promise<Tag[]>;
  getTagById: (id: string) => Promise<Tag | null>;
  updateDogPicture: (dogId: string, formData: FormData) => Promise<void>;
  getDogsByUserId: (userId: string) => Promise<Dog[]>;
  getDogById: (id: string) => Promise<Dog | null>;
  updateDog: (id: string, data: Partial<Dog>) => Promise<any>;
  deleteDog: (id: string) => Promise<void>;
  responseMessage: string;
  isProcessing: boolean;
}

const DogContext = createContext<DogContextProps | undefined>(undefined);


export const useDog = () => {
  const context = useContext(DogContext);
  if (!context) {
    throw new Error("[DogContext] useDog must be used within a DogProvider");
  }
  return context;
};


// @ts-ignore
export const DogProvider: FC<{ children: ReactNode }> = ({ children }) => {

  const { authToken } = useAuth();

  const [responseMessage, setResponseMessage] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);


  // JSON request function with error handling
  const sendJsonQuery = async (
    path: string,
    method: string,
    payload?: any
  ): Promise<any> => {
    setIsProcessing(true);

    const headers = new Headers({
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    });

    const response = await fetch(path, {
      method,
      headers,
      body: payload ? JSON.stringify(payload) : undefined,
    });
    setIsProcessing(false);

    if (!response.ok) {
      throw new Error(await response.text());
    }
    return response.json();
  };


  // File upload function for images
  const sendFileQuery = async (
    path: string,
    method: string,
    file: File | Blob,
    onSuccess: (payload: any) => void,
    onFailure: (payload: any) => void
  ): Promise<boolean> => {
    setIsProcessing(true);

    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(path, {
      method,
      headers: { Authorization: `Bearer ${authToken}` },
      body: formData,
    });
    setIsProcessing(false);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[DogContext] File upload error:", errorText);
      onFailure({ message: errorText });
      return false;
    }
    const payload = await response.json();
    onSuccess(payload);
    return true;
  };


  // Add a new dog
  const addDog = async (
    userId: string,
    dogData: Partial<Dog>
  ): Promise<Dog | null> => {
    try {
      const newDog: Dog = await sendJsonQuery(
        apiPaths.users.addDog(userId),
        "POST",
        dogData
      );
      setResponseMessage("Dog added successfully!");
      return newDog;
    } catch (error) {
      console.error("Failed to add dog:", error);
      setResponseMessage("Failed to add dog");
      return null;
    }
  };


  // Get all Tags
  const getAvailableTags = async (): Promise<Tag[]> => {
    const response = await sendJsonQuery(apiPaths.dogs.getAllTags, "GET");
    //console.log("[DogContext] Get all available tags: ", response as Tag[])
    return response as Tag[];
  };

  // Get a tag by its id
  const getTagById = async (tagId: string): Promise<Tag | null> => {
    try {
      console.log("[DogContext] Fetching tag by ID:", tagId); // Add this logging
      const response = await sendJsonQuery(apiPaths.dogs.getTagById(tagId), "GET");
      return response as Tag;
    } catch (error) {
      console.error(`[DogContext] Failed to fetch tag by ID: ${tagId}`, error);
      return null;
    }
  };


  // Update Tags for a Dog
  const updateDogTags = async (dogId: string, tagIds: string[]): Promise<void> => {
    await sendJsonQuery(apiPaths.dogs.updateDogTags(dogId), "PUT", { tagIds });
    setResponseMessage("Tags updated successfully!");
  };


  // Update dog picture
  const updateDogPicture = async (dogId: string, formData: FormData) => {
    setIsProcessing(true);

    const options: RequestInit = {
      method: "PUT",
      mode: "cors",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
      body: formData,
    };

    console.log(`[DogContext] Uploading picture for dog ID: ${dogId}`);

    const response = await fetch(
      apiPaths.dogs.updateDogPicture(dogId),
      options
    );

    setIsProcessing(false);

    if (!response.ok) {
      const errorText = await response.text();
      console.error("[DogContext] Failed to upload dog picture:", errorText);
      throw new Error(errorText);
    }

    console.log(
      "[DogContext] Dog picture upload response:",
      await response.json()
    );
  };


  // Get dog by ID
  const getDogById = async (id: string): Promise<Dog | null> => {
    try {
      console.log("[DogContext] getDogById: ", id);
      const response = await sendJsonQuery(apiPaths.dogs.getDogById(id), "GET");

      // Explicitly map the API response to the Dog type
      const dogResponse: Dog = {
        id: response.id,
        name: response.name,
        description: response.description,
        imageUrl: response.imageUrl || null,
        tags: response.tags || [],
        age: response.age, // Optional, only include if the API response contains it
        breed: response.breed, // Optional, only include if the API response contains it
        weight: response.weight, // Optional, only include if the API response contains it
      };

      console.log("[DogContext] Got dog data: ", dogResponse.name);
      return dogResponse;
    } catch (error) {
      console.error("[DogContext] Failed to fetch dog:", error);
      return null;
    }
  };


  const updateDog = async (id: string, data: Partial<Dog>) => {
    console.log("[DogContext] updateDog got data: ", data);

    // Extract and structure tags
    const payload = {
      ...data,
      tagIds: data.tags, // Send tags as `tagIds` array
    };

    console.log("[DogContext] Sending updateDog payload: ", payload);
    return await sendJsonQuery(apiPaths.dogs.updateDog(id), "PUT", payload);
  };


  // Delete a dog by ID
  const deleteDog = async (id: string): Promise<void> => {
    try {
      await sendJsonQuery(apiPaths.dogs.deleteDog(id), "DELETE");
      setResponseMessage("[DogContext] Dog deleted successfully!");
    } catch (error) {
      //console.error("[DogContext] Failed to delete dog:", error);
      setResponseMessage("[DogContext] Failed to delete dog");
    }
  };


  const getDogsByUserId = async (userId: string): Promise<Dog[]> => {
    const response = await fetch(apiPaths.users.getDogsByUserId(userId), {
      method: "GET",
      headers: { Authorization: `Bearer ${authToken}` },
    });
    if (!response.ok) throw new Error("[DogContext] Failed to fetch dogs");
    return response.json();
  };

  return (
    <DogContext.Provider
      value={{
        addDog,
        updateDogTags,
        getAvailableTags,
        getTagById,
        updateDogPicture,
        getDogsByUserId,
        getDogById,
        deleteDog,
        updateDog,
        responseMessage,
        isProcessing,
      }}
    >
      {children}
    </DogContext.Provider>
  );
};
