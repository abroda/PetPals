import { createContext, useContext, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { apiPaths } from "@/constants/config/api"; // Adjust the import path as needed


export interface Dog {
    id: string;
    name: string;
    description: string;
    imageUrl: string | null;
    tags: { id: string; tag: string }[]; // Define tags based on your API response structure
}


interface DogContextProps {
    addDog: (userId: string, dogData: Partial<Dog>) => Promise<Dog | null>;
    updateDogPicture: (dogId: string, formData: FormData) => Promise<void>
    getDogsByUserId: (userId: string) => Promise<Dog[]>;
    getDogById: (id: string) => Promise<Dog | null>;
    deleteDog: (id: string) => Promise<void>;
    responseMessage: string;
    isProcessing: boolean;
}

const DogContext = createContext<DogContextProps | undefined>(undefined);

export const useDog = () => {
    const context = useContext(DogContext);
    if (!context) {
        throw new Error("useDog must be used within a DogProvider");
    }
    return context;
};

// @ts-ignore
export const DogProvider: React.FC = ({ children }) => {
    const { authToken } = useAuth();
    const [responseMessage, setResponseMessage] = useState("");
    const [isProcessing, setIsProcessing] = useState(false);

    // JSON request function with error handling
    const sendJsonQuery = async (path: string, method: string, payload?: any): Promise<any> => {
        setIsProcessing(true);

        const headers = new Headers({
            "Authorization": `Bearer ${authToken}`,
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
            console.error("File upload error:", errorText);
            onFailure({ message: errorText });
            return false;
        }

        const payload = await response.json();
        onSuccess(payload);
        return true;
    };

    // Add a new dog
    const addDog = async (userId: string, dogData: Partial<Dog>): Promise<Dog | null> => {
        try {
            const newDog: Dog = await sendJsonQuery(apiPaths.users.addDog(userId), "POST", dogData);
            setResponseMessage("Dog added successfully!");
            return newDog;
        } catch (error) {
            console.error("Failed to add dog:", error);
            setResponseMessage("Failed to add dog");
            return null;
        }
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

        console.log(`Uploading picture for dog ID: ${dogId}`);

        const response = await fetch(apiPaths.dogs.updateDogPicture(dogId), options);

        setIsProcessing(false);

        if (!response.ok) {
            const errorText = await response.text();
            console.error("Failed to upload dog picture:", errorText);
            throw new Error(errorText);
        }

        console.log("Dog picture upload response:", await response.json());
    };

    // Get dog by ID
    const getDogById = async (id: string): Promise<Dog | null> => {
        try {
            return await sendJsonQuery(apiPaths.dogs.getDogById(id), "GET");
        } catch (error) {
            console.error("Failed to fetch dog:", error);
            return null;
        }
    };

    // Delete a dog by ID
    const deleteDog = async (id: string): Promise<void> => {
        try {
            await sendJsonQuery(apiPaths.dogs.deleteDog(id), "DELETE");
            setResponseMessage("Dog deleted successfully!");
        } catch (error) {
            console.error("Failed to delete dog:", error);
            setResponseMessage("Failed to delete dog");
        }
    };

    const getDogsByUserId = async (userId: string): Promise<Dog[]> => {
        const response = await fetch(apiPaths.users.getDogsByUserId(userId), {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
        });
        if (!response.ok) throw new Error("Failed to fetch dogs");
        return response.json();
    };

    return (
        <DogContext.Provider
            value={{
                addDog,
                updateDogPicture,
                getDogsByUserId,
                getDogById,
                deleteDog,
                // getDogsByUserId,
                responseMessage,
                isProcessing,
            }}
        >
            {children}
        </DogContext.Provider>
    );
};
