export const databaseURL = "http://192.168.237.222:8080/";

export const apiPaths = {
  checkConnection: "http://localhost:8080/v3/api-docs.yaml",
  auth: {
    register: databaseURL + "api/auth/register",
    verifyEmail: databaseURL + "api/auth/verify",
    resend: databaseURL + "api/auth/resend",
    sendPasswordResetCode: databaseURL + "api/account/password-reset/request",
    resetPassword: databaseURL + "api/account/password-reset",
    login: databaseURL + "api/auth/login",
  },
  posts: {},
  profiles: {},
  friends: {},
  chats: {},
  walks: {},
  groupWalks: {},
};
