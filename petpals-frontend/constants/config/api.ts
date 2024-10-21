export const databaseURL = "http://localhost:8080/";

export const apiPaths = {
  checkConnection: "http://localhost:8080/v3/api-docs.yaml",
  auth: {
    register: databaseURL + "api/auth/register",
    verifyEmail: databaseURL + "api/auth/verify",
    resend: databaseURL + "api/auth/resend",
    requestPasswordReset: databaseURL + "api/account/password-reset/request",
    confirmPasswordReset: databaseURL + "api/account/password-reset/confirm",
    resetPassword: databaseURL + "api/account/password-reset",
    login: databaseURL + "api/auth/login",
    logout: databaseURL + "api/auth/logout",
  },
};
