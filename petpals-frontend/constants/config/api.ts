export const databaseURL = "http://192.168.0.4:8080/";

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
    getFeed: databaseURL + "api/posts"
  },
  profiles: {},
  friends: {},
  chats: {},
  walks: {},
  groupWalks: {},
};
