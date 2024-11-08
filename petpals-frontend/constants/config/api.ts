export const databaseURL = "http://10.182.46.5:8080/";

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
  groupWalks: {
    create: databaseURL + "api/groupWalks", // POST
    walk: (walkId: string) => databaseURL + `api/groupWalks/${walkId}`, // GET=get, PUT=update, DELETE=delete
    join: (walkId: string) => databaseURL + `api/groupWalks/${walkId}/join`,
    leave: (walkId: string) => databaseURL + `api/groupWalks/${walkId}/leave`,
    walkTags: databaseURL + "api/groupWalks/tags", // GET
    list: (tags: string[]) =>
      databaseURL +
      `api/groupWalks${
        tags.length == 0
          ? ""
          : tags.reduce(
              (prev, s, i) => prev + s + (i < tags.length - 1 ? "," : ""),
              "tags?="
            )
      }`, // GET
    listJoined: (userId: string) =>
      databaseURL + `api/users/${userId}/groupWalks/joined`, // GET
    listCreated: (userId: string) =>
      databaseURL + `api/users/${userId}/groupWalks/created`, // GET
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
