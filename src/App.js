// imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./components/Home";
import Cart from "./components/Cart";
import Orders from "./components/Orders";
import SignUp from "./components/SignUp";
import SignIn from "./components/SignIn";
import Error from "./components/Error"
import { Slide, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch, useSelector } from "react-redux";
import { userSessionAsyncThunk } from './redux/reducers/userReducer';
import { useEffect, } from "react";
import { fetchCartItemsAsyncThunk ,fetchOrdersAsyncThunk} from "./redux/reducers/productReducer";
import { userSelector } from "./redux/reducers/userReducer";

function App() {

  const dispatch = useDispatch()
  const userData = useSelector(userSelector).userData
  useEffect(() => {

    if (!userData) {
      // get user session if already logged in
      dispatch(userSessionAsyncThunk())
    }
  }, [userData,dispatch]);

  useEffect(() => {
    // fetch cart item of logged in user
    dispatch(fetchCartItemsAsyncThunk(userData));
  }, [userData,dispatch]);


  useEffect(() => {
    // fetch orders of logged in user
    dispatch(fetchOrdersAsyncThunk(userData));
  }, [userData,dispatch]);



  // routes for different pages of the app with navbar as a parent route
  const router = createBrowserRouter([
    {
      path: "/", element: <Navbar />, errorElement: <Error />, children: [
        { index: true, element: <Home /> },
        { path: "/cart", element: <Cart /> },
        { path: "/orders", element: <Orders /> },
        { path: "/signup", element: <SignUp /> },
        { path: "/signin", element: <SignIn /> }
      ]
    }
  ])
  return (
    <>
      {/* toast */}
      <ToastContainer
        position="top-center"
        autoClose={1500}
        hideProgressBar={false}
        newestOnTop
        transition={Slide}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <RouterProvider router={router} />
    </>
  );
}

export default App;
