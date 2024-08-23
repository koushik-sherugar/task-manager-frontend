import { Routes, BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./App.css";

import Navbar from "./components/Navbar";
import { UserAuthContextProvider } from "./context/userAuthContext";
import UserRoutes from "./routes/UserRoutes";

function App() {
  return (
    <UserAuthContextProvider>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss={false}
        pauseOnHover={false}
        draggable
        theme="light"
      />
      <Navbar />

      <Routes>
        {/* Login Routes */}
        {UserRoutes()}
      </Routes>
    </UserAuthContextProvider>
  );
}

export default App;
