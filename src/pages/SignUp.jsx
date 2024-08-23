import React, { useState } from "react";
import GoogleLogin from "../components/authentication/GoogleLogin";
import { useUserAuth } from "../context/userAuthContext";
import { createUser } from "../functions/authFunctions";
import { useNavigate } from "react-router";
import { toast } from "react-toastify";

const SignUp = () => {
  const { signUp } = useUserAuth();
  let navigate = useNavigate();
  // Local states
  const [formValues, setFormValues] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState(""); // State to store error message

  // Function to handle sign up
  const handleSignUp = async () => {
    // Check if passwords match
    if (formValues.password !== formValues.confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    // Call signUp function from userAuthContext
    try {
      await signUp(
        formValues.email,
        formValues.password,
        formValues.firstName,
        formValues.lastName
      );

      // Redirect

      navigate("/task-board");
      toast.success("Signed up sucessfully");
    } catch (error) {
      // Show error message
      console.error("Failed to sign in:", error);
    }
  };

  return (
    <main className="flex justify-center w-full mt-7 ">
      {/* Login form */}
      <div className="flex flex-col max-w-md gap-4 md:w-1/2">
        {/* title */}
        <p className="text-3xl font-bold text-left text-accentblue">SignIn</p>
        {/* card */}
        <section className="flex flex-col w-full gap-3 border-2 rounded-md shadow-md min-w-md border-accentblue p-7 ">
          {/* First Name */}
          <input
            type="text"
            placeholder="First Name"
            onChange={(e) =>
              setFormValues({ ...formValues, firstName: e.target.value })
            }
            className="p-1 border border-gray-300"
          />
          {/* Last Name */}
          <input
            type="text"
            placeholder="Last Name"
            onChange={(e) =>
              setFormValues({ ...formValues, lastName: e.target.value })
            }
            className="p-1 border border-gray-300"
          />
          {/* Email */}
          <input
            type="text"
            placeholder="Email"
            onChange={(e) =>
              setFormValues({ ...formValues, email: e.target.value })
            }
            className="p-1 border border-gray-300"
          />
          {/* Password */}
          <input
            type="password"
            className="p-1 border border-gray-300"
            placeholder="Password"
            onChange={(e) => {
              setFormValues({ ...formValues, password: e.target.value });
            }}
          />
          {/* Confirm Password */}
          <input
            type="password"
            className="p-1 border border-gray-300"
            placeholder="Confirm Password"
            onChange={(e) => {
              setFormValues({ ...formValues, confirmPassword: e.target.value });
            }}
          />
          {error && <p className="text-red-500">{error}</p>}
          <button
            className="p-2 my-1 text-white bg-accentblue "
            onClick={handleSignUp}
          >
            Login
          </button>
          <p className="text-center">
            Already have account? &nbsp;
            <a href="/signin" className="text-accentblue">
              Sign in
            </a>
          </p>

          {/* Social login */}

          <div className="flex justify-center mt-2 ">
            <GoogleLogin />
          </div>
        </section>
      </div>
    </main>
  );
};

export default SignUp;
