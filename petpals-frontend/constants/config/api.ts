export const databaseURL = "http://192.168.0.4:8080/";
export const websocketURL = "http://192.168.0.4:8080/ws"

export const apiPaths = {
  auth: {
    register: databaseURL + "api/auth/register", // POST
    verifyEmail: databaseURL + "api/auth/verify", // POST
    resend: databaseURL + "api/auth/resend", // POST
    sendPasswordResetCode: databaseURL + "api/account/password-reset/request", // POST
    resetPassword: databaseURL + "api/account/password-reset", // POST
    login: databaseURL + "api/auth/login", // POST
  },
  posts: {
    getAllPosts: databaseURL + "api/posts",
    getPostById: (postId: string) => databaseURL + `api/posts/${postId}`,
    likePostById: (postId: string) => databaseURL + `api/posts/${postId}/like`, // POST and DELETE
    addPost: databaseURL + "api/posts",
    editPost: (postId: string) => databaseURL + `api/posts/${postId}`,
    deletePost: (postId: string) => databaseURL + `api/posts/${postId}`,
    addPicture: (postId: string) => databaseURL + `api/posts/${postId}/picture`,
    deletePicture: (postId: string) => databaseURL + `api/posts/${postId}/picture`,
    toggleLikePost: (postId: string) => databaseURL + `api/posts/${postId}/toggleLike`,
    checkNew: databaseURL + "api/posts/checkNew",
    comments: {
      getAllComments: databaseURL + "api/posts/comments",
      getByPostId: (postId: string) => databaseURL + `api/posts/${postId}/comments`,
      getById: (commentId: string) => databaseURL + `api/posts/comments/${commentId}`,
      addComment: (postId: string) => databaseURL + `api/posts/${postId}/comments`,
      editComment: (commentId: string) => databaseURL + `api/posts/comments/${commentId}`,
      deleteComment: (commentId: string) => databaseURL + `api/posts/comments/${commentId}`,
      toggleLikeComment: (commentId: string) => databaseURL + `api/posts/comments/${commentId}/toggleLike`,
    },
  },
  profiles: {},
  friends: {
    getRequests: (userId: string) =>
      databaseURL + `api/users/${userId}/friends/requests`,
    sendRequest: databaseURL + "api/users/friends/request",
    acceptRequest: (requestId: string) =>
      databaseURL + `api/users/friends/accept/${requestId}`,
    denyRequest: (requestId: string) =>
      databaseURL + `api/users/friends/deny/${requestId}`,
    removePendingRequest: (requestId: string) =>
      databaseURL + "api/users/friends/request/" + requestId,
    removeFriend: databaseURL + "api/users/remove",
    getFriends: (userId: string) => databaseURL + `api/users/${userId}/friends`,
  },
  chats: {
    chatrooms: databaseURL + "api/chatroom", // GET, POST
    latestMessages: databaseURL + "api/chatroom/messages/latest", // GET
    messages: (chatroomId: string) =>
      databaseURL + `api/chatroom/${chatroomId}/messages`, // GET
  },
  walks: {
    listOngoing: (userId: string) =>
      databaseURL + `api/users/${userId}/groupWalks/joined/ongoing`, // GET
    start: databaseURL + "api/walk/start", // POST w/ initial location
    pause: databaseURL + "api/walk/pause", // POST
    end: databaseURL + "api/walk/end", // POST
    sendLocation: databaseURL + "api/walk/updateLocation", // POST w/ location
    getActiveUsers: databaseURL + "api/walk/userLocations", // GET (returns Participant[])
  },
  users: {
    getAllUsers: databaseURL + "api/users",
    getUserById: (id: string) => databaseURL + "api/users/" + id,
    getLoggedInUser: databaseURL + "api/users/me",
    updateUser: (id: string) => databaseURL + "api/users/" + id,
    updateUserProfilePicture: (id: string) =>
      databaseURL + "api/users/" + id + "/picture",
    deleteUserPicture: (id: string) =>
      databaseURL + "api/users/" + id + "/picture",
    deleteUser: (id: string) => databaseURL + "api/users/" + id,
    addDog: (userId: string) => databaseURL + "api/users/" + userId + "/dogs",
    getDogsByUserId: (userId: string) =>
      databaseURL + "api/users/" + userId + "/dogs",
  },
  dogs: {
    getDogById: (id: string) => databaseURL + "api/dogs/" + id,
    updateDog: (id: string) => databaseURL + "api/dogs/" + id,
    updateDogPicture: (id: string) =>
      databaseURL + "api/dogs/" + id + "/picture",
    deleteDogPicture: (id: string) =>
      databaseURL + "api/dogs/" + id + "/picture",
    deleteDog: (id: string) => databaseURL + "api/dogs/" + id,
    getDogsByTagId: (tagId: string) => databaseURL + "api/dogs/tags/" + tagId,
    getAllTags: databaseURL + "api/dogtags",
  },
  groupWalks: {
    create: databaseURL + "api/groupWalks", // POST
    walk: (walkId: string) => databaseURL + `api/groupWalks/${walkId}`, // GET=get, PUT=update, DELETE=delete
    join: (walkId: string) => databaseURL + `api/groupWalks/${walkId}/join`,
    leave: (walkId: string) => databaseURL + `api/groupWalks/${walkId}/leave`,
    tagSuggestions: (input: string) =>
      databaseURL + `api/groupWalks/tags/suggest?query=${input}`, // GET
    list: (page: number, size: number, tags?: string[]) =>
      databaseURL +
      `api/groupWalks/list?page=${page}&size=${size}&sort=datetime,asc${
        !tags || tags.length == 0
          ? ""
          : tags.reduce(
              (prev, s, i) => prev + s + (i < tags.length - 1 ? "," : ""),
              "&tags="
            )
      }`, // GET - filtering walks by tags - pageable
    listJoined: (userId: string) =>
      databaseURL + `api/users/${userId}/groupWalks/joined`, // GET
    listCreated: (userId: string) =>
      databaseURL + `api/users/${userId}/groupWalks/created`, // GET
    listUsersDogs: (userId: string) => databaseURL + `api/users/${userId}/dogs`, // GET
    listComments: (walkId: string) =>
      databaseURL + `api/groupWalks/${walkId}/comments`, // GET
    addComment: (walkId: string) =>
      databaseURL + `api/groupWalks/${walkId}/comments`, // POST
    comment: (walkId: string, commentId: string) =>
      databaseURL + `api/groupWalks/${walkId}/comments/${commentId}`, // GET=get, PUT=update, DELETE=delete
    commentToggleLike: (walkId: string, commentId: string) =>
      databaseURL + `api/groupWalks/${walkId}/comments/${commentId}/toggleLike`, // POST
  },
};
