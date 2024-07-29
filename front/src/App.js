import "./App.css";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Logout from "./pages/Logout";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserProfile from "./pages/UserProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect, useState } from "react";
import ProtectedRoutes from "./components/protectedRoutes";
import About from "./pages/About";
import Conversation from "./pages/Conversation";
import AddConversation from "./components/addConversation";
import UpdateConversation from "./components/updateConversation";
import MyConversations from "./components/myConversations";
import Category from "./components/category";
import ConversationDetails from "./components/conversationDetails";
import AddProfile from "./components/addProfile";
import UpdateProfile from "./components/updateProfile";
import UserDetails from "./components/userDetails";
import UserContext from "./pages/UserContext"; 

axios.defaults.baseURL = "http://localhost:3001/CultureConnect/";
axios.defaults.withCredentials = true;

const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  {
    path: "/dashboard",
    element: (
      <ProtectedRoutes>
        <Dashboard />
      </ProtectedRoutes>
    ),
  },
  {
    path: "/profile",
    element: (
      <ProtectedRoutes>
        <UserProfile />
      </ProtectedRoutes>
    ),
  },
  {
    path: "add-profile",
    element: (
      <ProtectedRoutes>
        <AddProfile />
      </ProtectedRoutes>
    ),
  },
  {
    path: "update-profile/:id",
    element: (
      <ProtectedRoutes>
        <UpdateProfile />
      </ProtectedRoutes>
    ),
  },
  { path: "/conversation", element: <Conversation /> },
  { path: "/add-conversation", element: <AddConversation /> },
  { path: "/update-conversation/:id", element: <UpdateConversation /> },
  { path: "/my-conversations", element: <MyConversations /> },
  { path: "/category/:category", element: <Category /> },
  { path: "/user/:id", element: <UserDetails /> },
  { path: "/conversation/:id", element: <ConversationDetails /> },
  { path: "/logout", element: <Logout /> },
  { path: "/about", element: <About /> },
  { path: "*", element: <NotFound /> },
]);

function App() {
  const [user, setUser] = useState();
  const [isOnline, setIsOnline] = useState(false);

  useEffect(() => {
    axios
      .get("verify", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      })
      .then((res) => {
        if (res.data.success) {
          setUser(res.data.user);
          setIsOnline(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <ToastContainer />
      <UserContext.Provider value={{ user, setUser, setIsOnline, isOnline }}>
        <RouterProvider router={router} />
      </UserContext.Provider>
    </>
  );
}

export default App;
