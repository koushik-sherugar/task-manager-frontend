import axios from "axios";

// Create a user in the database after successful login with firebase
export const createUser = async (res) => {
  try {
    await axios.post(`${process.env.REACT_APP_SERVERURL}/user/create-user`, {
      userId: res.uid,
      userName: res.displayName,
      email: res.email,
    });
  } catch (error) {
    console.error("Failed to create user:", error);
  }
};
