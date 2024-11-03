import {useContext} from "react";
import {PostContext, PostContextType} from "@/context/PostContext";

export function usePosts() {
    return useContext(PostContext) as PostContextType;
}
