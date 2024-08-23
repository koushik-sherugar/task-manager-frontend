// import { GoogleOutlined } from "@ant-design/icons";
import React from "react";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useUserAuth } from "../../context/userAuthContext";
import { createUser } from "../../functions/authFunctions";
import { useNavigate } from "react-router";

const GoogleLogin = () => {
  const [isLoading, setIsLoading] = React.useState(false);
  let navigate = useNavigate();
  const { googleSignIn } = useUserAuth();

  // Google login
  const handleGoogleSignIn = async (e) => {
    e.preventDefault();
    try {
      // await googleSignIn().then(createUser(user));
      const userCredential = await googleSignIn(); // This returns a user credential object
      const user = userCredential.user; // Extract the user object

      // Pass the user object to the createUser function
      await createUser(user);
      navigate("/task-board");
    } catch (error) {
      alert(` ${error}`);
    }
  };

  return (
    <button
      // icon={}
      onClick={handleGoogleSignIn}
      className="p-2 text-white rounded-md bg-accentblue"
    >
      <p className="text-xl" /> Login With Google
    </button>
  );
};

export default GoogleLogin;
