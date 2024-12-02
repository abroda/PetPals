export const databaseURL = "http://192.168.0.104:8080/";

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
    getFeed: databaseURL + "api/posts",
    getPostById: (postId: string) => databaseURL + `api/posts/${postId}`,
    likePostById: (postId: string) => databaseURL + `api/posts/${postId}/like`, // POST and DELETE
    addPost: databaseURL + "api/posts",
  },
  profiles: {},
  friends: {},
  chats: {},
  walks: {},
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
