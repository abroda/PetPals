import React, {createContext, FC, ReactNode, useState,} from "react";
import {apiPaths} from "@/constants/config/api";
import {useAuth} from "@/hooks/useAuth";

export type PostContextType = {
    isProcessing: boolean;
    posts: any[];
    hasMore: boolean;
    // responseMessage: string;
    loadPosts: () => Promise<boolean | "no more">;
    // getFeed: (page: number, size: number) => Promise<void>; // for home page
    // getPosts: (username: string) => Promise<boolean>; // for profile
    // getPost: (username: string) => Promise<boolean>;
    // addPost: (username: string, data: Object) => Promise<boolean>;
    // editPost: (postId: string, data: Object) => Promise<boolean>;
    // removePost: (postId: string) => Promise<boolean>;
    // addReaction: (username: string, reaction: string) => Promise<boolean>;
    // removeReaction: (username: string, reaction: string) => Promise<boolean>;
    // addComment: (
    //   username: string,
    //   postId: string,
    //   contents: string
    // ) => Promise<boolean>;
    // removeComment: (commentId: string) => Promise<boolean>;
};

export type Post = {
    id: string;
    title: string;
    content?: string;
    imageUrl?: string;
    author: {
        id: string;
        username: string;
        imageUrl?: string;
    };
    comments: {
        commentId: string;
        content: string;
        createdAt: string;
        postId: string;
        commenter: {
            id: string;
            username: string;
            imageUrl: string;
        };
        likes: string[];
    }[];
    likes: string[];
};

type Pagination = {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
};

interface PostPageResponse {
    content: Post[];
    page: Pagination;
}

export const PostContext = createContext<PostContextType | null>(null);

export const PostProvider: FC<{ children: ReactNode }> = ({children}) => {
    const [isProcessing, setIsProcessing] = useState(false);
    const [responseMessage, setResponseMessage] = useState("");
    const {userEmail} = useAuth();
    const {authToken} = useAuth();

    // ALL POSTS
    const [posts, setPosts] = useState<Post[]>([])
    const [page, setPage] = useState(0);
    const pageSize = 2;
    const [hasMore, setHasMore] = useState(true);


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
        console.log("SENDING REQUEST")
        setResponseMessage("");
        setIsProcessing(true);
        console.log("AUTH TOKEN: ", authToken)
        console.log("PAYLOAD: ", payload)
        console.log("METHOD: ", method)
        console.log("PATH: ", path)
        let url = path;
        if (method === "GET" && payload) {
            const queryParams = new URLSearchParams(payload).toString();
            url += `?${queryParams}`;
        }
        const fetchOptions: RequestInit = {
            method: method,
            mode: "cors",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
            },
        };
        if (method !== "GET") {
            fetchOptions.body = JSON.stringify(payload);
        }

        try {
            const response = await fetch(url, fetchOptions);
            console.log("FETCH SUCCESSFUL", response.status);

            // Make sure to parse the response as JSON
            if (response.ok) {
                const data = await response.json(); // Parse JSON
                console.log("Parsed JSON Data:", data);
                onOKResponse(data);
                setIsProcessing(false);
                return data;
            } else {
                console.error("Bad Response", response);
                setIsProcessing(false);
                return null;
            }
        } catch (error) {
            console.error("Fetch failed:", error);
            setIsProcessing(false);
            return null;
        }


        // return fetch(path, {
        //     method: method,
        //     mode: "cors",
        //     headers: {
        //         "Content-Type": "application/json",
        //         Authorization: `Bearer ${authToken}`,
        //     },
        //     body: JSON.stringify(payload),
        // })
        //     .then((response: Response) => {
        //         return response
        //             .json()
        //             .then((payload) => {
        //                 if (response.ok) {
        //                     onOKResponse(payload);
        //                     setIsProcessing(false);
        //                     console.log("response ok")
        //                     return true;
        //                 } else {
        //                     onBadResponse(payload);
        //                     setIsProcessing(false);
        //                     console.log("response bad")
        //                     return false;
        //                 }
        //             })
        //             .catch((reason) => {
        //                 onJSONParseError(reason);
        //                 setIsProcessing(false);
        //                 console.log("response json error")
        //                 return false;
        //             });
        //     })
        //     .catch((error: Error) => {
        //         onError(error);
        //         setIsProcessing(false);
        //         console.error("response error")
        //         // console.error(error.message)
        //         return false;
        //     });
    };

    const loadPosts = async () => {
        console.log("CONTEXT")
        console.log(isProcessing)
        console.log(hasMore)
        if (isProcessing || !hasMore) return "no more";
        console.log("passed")
        const responseData: PostPageResponse | null = await sendJsonQuery(apiPaths.posts.getPosts, "GET", {
            page: page,
            size: pageSize
        });
        if (responseData !== null) {
            console.log("Received Data:", responseData); // Handle the actual data here
            setPosts([...posts, ...responseData.content])
            setPage(page + 1)
            setHasMore(responseData.page.number + 1 < responseData.page.totalPages);
        } else {
            console.error("Failed to fetch data.");
        }
        return true;


        //     .then((res) => {
        //     console.log(res)
        //     console.log("HEHE")
        // }).catch(err => {
        //     console.error(err)
        //     console.log("HEHE")
        // })

        // setIsProcessing(true);
        //     try {
        //         const response = await sendJsonQuery(
        //             apiPaths.posts.getPosts,
        //             "GET",
        //             {
        //                 page: page,
        //                 size: pageSize,
        //             }
        //         );
        //         if (response) {
        //             // setPosts((prevPosts) => [...prevPosts, ...response.content]);
        //             // setHasMore(!response.last);
        //             // setPage((prevPage) => prevPage + 1);
        //             console.log("SUCCESS")
        //         }
        //     } catch (error) {
        //         console.error("Error loading posts:", error);
        //     } finally {
        //         setIsProcessing(false);
        //     }
    };

    // const getFeed = async (page: number, size: number) => {
    //     if (isProcessing || !hasMore) return;
    //     await sendJsonQuery(
    //         apiPaths.posts.getPosts,
    //         "GET",
    //         {
    //             page: page,
    //             size: size,
    //         }
    //     ).then((response) => {
    //         setIsProcessing(false);
    //         console.log(response)
    //         return true;
    //     })
    //         .catch((err: Error) => {
    //             console.error(err.message);
    //             // setResponseMessage("Get posts: " + err.message);
    //             setIsProcessing(false);
    //             return false;
    //         });
    // }
    //
    //
    // const getPosts = async (userId: string) => {
    //     setIsProcessing(true);
    //     setResponseMessage("");
    //
    //     return sendJsonQuery(apiPaths.posts.getPosts, "GET", {
    //         userId: userId,
    //     })
    //         .then((_) => {
    //             setIsProcessing(false);
    //             return true;
    //         })
    //         .catch((err: Error) => {
    //             console.error(err.message);
    //             setResponseMessage("Get posts: " + err.message);
    //             setIsProcessing(false);
    //             return false;
    //         });
    // };
    //
    // const getPost = async (postId: string) => {
    //     setIsProcessing(true);
    //     setResponseMessage("");
    //
    //     return sendJsonQuery(apiPaths.auth.verifyEmail, "POST", postId)
    //         .then((_) => {
    //             setIsProcessing(false);
    //             return true;
    //         })
    //         .catch((err: Error) => {
    //             console.error(err.message);
    //             setResponseMessage("Resend verification: " + err.message);
    //             setIsProcessing(false);
    //             return false;
    //         });
    // };
    //
    // const addPost = async (username: string, data: Object) =>
    //     sendJsonQuery(apiPaths.auth.sendPasswordResetCode, "POST", {
    //         username: username,
    //     });
    //
    // const editPost = async (postId: string, data: Object) =>
    //     sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
    //         postId: postId,
    //     });
    //
    // const removePost = async (postId: string) =>
    //     sendJsonQuery(apiPaths.auth.resetPassword, "POST", {
    //         postId: postId,
    //     });
    //
    // const addReaction = async (username: string, reaction: string) => {
    //     setIsProcessing(true);
    //     setResponseMessage("");
    //
    //     return asyncStorage
    //         .getItem("authToken")
    //         .then((token: string | null) => {
    //             setIsProcessing(false);
    //             return true;
    //         })
    //         .catch((err: Error) => {
    //             console.error(err.message);
    //             setResponseMessage("Check saved login: " + err.message);
    //             setIsProcessing(false);
    //             return false;
    //         });
    // };
    //
    // const removeReaction = async (username: string, reaction: string) =>
    //     sendJsonQuery(apiPaths.auth.login, "POST", {
    //         email: username,
    //         password: reaction,
    //     });
    //
    // const addComment = async (
    //     username: string,
    //     postId: string,
    //     contents: string
    // ) => {
    //     return true;
    // };
    //
    // const removeComment = async (commentId: string) => {
    //     return true;
    // };

    return (
        <PostContext.Provider
            value={
                {
                    isProcessing,
                    // responseMessage,
                    posts,
                    hasMore,
                    loadPosts,
                    // getFeed,
                    // getPosts,
                    // getPost,
                    // addPost,
                    // editPost,
                    // removePost,
                    // addReaction,
                    // removeReaction,
                    // addComment,
                    // removeComment,
                }
            }
        >
            {children}
        </PostContext.Provider>
    );
};
