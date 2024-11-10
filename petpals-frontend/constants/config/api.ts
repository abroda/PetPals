export const databaseURL = "http://192.168.88.42:8080/";

export const apiPaths = {
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
	users: {
		getAllUsers: databaseURL + "api/users",
		getUserById: (id: string) => databaseURL + "api/users/" + id,
		getLoggedInUser: databaseURL + "api/users/me",
		updateUser: (id: string) => databaseURL + "api/users/" + id,
		updateUserProfilePicture: (id: string) => databaseURL + "api/users/" + id + "/picture",
		deleteUserPicture: (id: string) => databaseURL + "api/users/" + id + "/picture",
		deleteUser: (id: string) => databaseURL + "api/users/" + id,
		addDog: (userId: string) => databaseURL + "api/users/"+ userId +"/dogs",
		getDogsByUserId: (userId: string) => databaseURL + "api/users/" + userId + "/dogs",
	},
	dogs: {
		getDogById: (id: string) => databaseURL + "api/dogs/" + id,
		updateDog: (id: string) => databaseURL + "api/dogs/" + id,
		updateDogPicture: (id: string) => databaseURL + "api/dogs/" + id + "/picture",
		deleteDogPicture: (id: string) => databaseURL + "api/dogs/" + id + "/picture",
		deleteDog: (id: string) => databaseURL + "api/dogs/" + id,
		getDogsByTagId: (tagId: string) => databaseURL + "api/dogs/tags/" + tagId,
	},
};
