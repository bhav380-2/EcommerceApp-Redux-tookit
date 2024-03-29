# React Ecommerce App (using Redux toolkit)

 This is a ecommerce applicaiton built using React and Redux Toolkit for efficient global state management. It provides users with a seamless shopping experience, including user authentication, product browsing, cart management, and order tracking.

## Key Features

- **Global State Management**: Integrated Redux Toolkit to manage the application state centrally, ensuring efficient data flow and easy state mutation.
- **Redux Thunks**: Utilized asynchronous thunks extensively for performing asynchronous logic, including managing user sessions, cart operations, and fetching product data.
- **Reducers and Actions**: Created necessary reducers and actions to handle state mutations, such as updating the cart, managing user sessions, and filtering products.
- **Login Page**: Implemented a login page allowing existing users to securely sign in to the application.
- **Components**: Utilized a variety of components to build the app, including Cart, Home, Navbar, Orders, ProductCard, SignIn, SignUp, and Error components.
- **Sidebar Filtering**: Implemented a sidebar feature on the homepage to enable users to filter products based on price and categories seamlessly.
- **Search Functionality**: Implemented a search feature allowing users to search for products by name, providing a convenient browsing experience.

## Redux Thunks

### Inside productReducer.js

1. `removeFromCartAsyncThunk`: Asynchronously removes items from the cart.
2. `decreaseCountAsyncThunk`: Asynchronously decreases the quantity of items in the cart.
3. `increaseCountAsyncThunk`: Asynchronously increases the quantity of items in the cart.
4. `clearCartAsyncThunk`: Asynchronously clears the entire cart.
5. `purchaseAllAsyncThunk`: Asynchronously handles the purchase of all items in the cart.
6. `fetchCartItemsAsyncThunk`: Asynchronously fetches cart items from the database.
7. `fetchOrdersAsyncThunk`: Asynchronously fetches user orders from the database.
8. `addToCartAsyncThunk`: Asynchronously adds items to the cart.

### Inside userReducer.js

1. `userSessionAsyncThunk`: Asynchronously manages user sessions, ensuring users remain authenticated.
2. `signupAsyncThunk`: Asynchronously handles user sign up requests.
3. `signinAsyncThunk`: Asynchronously handles user sign in requests.
4. `signoutAsyncThunk`: Asynchronously handles user sign out requests.

## Redux Toolkit Utilization

- **ExtraReducers**: Utilized `extraReducers()` to efficiently update the application state based on the promise returned by asynchronous thunks. This includes handling actions in the Pending, Fulfilled, and Rejected states.

## Components

The application consists of the following components:

1. `Cart.js`
2. `Home.js`
3. `Navbar.js`
4. `Orders.js`
5. `ProductCard.js`
6. `SignIn.js`
7. `SignUp.js`
8. `App.js`
9. `Error.js`

These components are responsible for rendering various parts of the application and providing a seamless user experience.
