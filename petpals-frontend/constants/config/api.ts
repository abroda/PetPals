export const databaseURL = "http://10.182.46.5:8080/";

export const apiPaths = {
  auth: {
    register: databaseURL + "api/auth/register",
    verifyEmail: databaseURL + "api/auth/verify",
    resend: databaseURL + "api/auth/resend",
    sendPasswordResetCode: databaseURL + "api/account/password-reset/request",
    resetPassword: databaseURL + "api/account/password-reset",
    login: databaseURL + "api/auth/login",
  },
  posts: {
    getFeed: databaseURL + "api/posts",
    getPostById: (postId: string) => databaseURL + `api/posts/${postId}`,
    likePostById: (postId: string) => databaseURL + `api/posts/${postId}/like`, // POST and DELETE
    addPost: databaseURL + "api/posts",
    checkForNewPosts: databaseURL + "api/posts/checkNew",

  },
  profiles: {},
  friends: {},
  chats: {},
  walks: {},
  groupWalks: {},
};
