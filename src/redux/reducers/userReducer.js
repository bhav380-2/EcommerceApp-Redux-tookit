import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import db, { auth } from "../../firebaseInit"
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signOut, onAuthStateChanged } from "firebase/auth"
import { doc, setDoc, getDoc } from "firebase/firestore";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


// user State
const INITIAL_STATE = { userData: null, isLoading: false, error: null }


// __________________if user logged in , gets user session ____________________________________
export const userSessionAsyncThunk = createAsyncThunk('user/session',
   async () => {

        let myPromise = new Promise(function (myResolve, myReject) {
        
            onAuthStateChanged(auth, async (currentUser) => {
                if (currentUser) {
                    let docSnap = await getDoc(doc(db, "users", currentUser.email));
                    let user = docSnap.data();
                    myResolve(user);
                } else {
                    myReject(null);
                }
            });
        });

        return myPromise.then();
    }
)

// ______________________signup_______________________________
export const signupAsyncThunk = createAsyncThunk('user/signup',

    async (data) => {

        createUserWithEmailAndPassword(auth, data.email, data.pswrd)
            .then(async (res) => {
                console.log("Signed Up Successfully!");
                await updateProfile(res.user, {
                    displayName: data.name
                });
                const currentUser = {
                    name: data.name,
                    email: data.email,
                    pswrd: data.pswrd,
                    cart: {
                        count: 0,
                        cost: 0,
                        items: []
                    },
                    orders: []
                }

                await setDoc(doc(db, 'users', currentUser.email), currentUser);
                toast.success("Signed Up Successfully! 🥳");
                return currentUser;
            }).catch((error) => {
                toast.error(error.message);
                return error;
            });
    }
)

// ________________________signin___________________
export const signinAsyncThunk = createAsyncThunk('user/signin',
    async (data) => {
        return signInWithEmailAndPassword(auth, data.email, data.pswrd)
            .then((res) => {
                console.log('signed in successfully');
                const currentUser = {
                    name: res.user.displayName,
                    email: res.user.email,
                    pswrd: data.pswrd,
                    cart: {
                        count: 0,
                        cost: 0,
                        items: []
                    },
                    orders: []
                }
                toast.success("Signed In Successfully 🥳");
                // console.log(JSON.stringify(currentUser)+"hi current user")
                return currentUser
            }).catch((error) => {

                console.log("wrong creds");
                toast.error(error.message);
                // setLoading(false);
                return error;
            });
    }
)

// ___________________signout____________________
export const signoutAsyncThunk = createAsyncThunk('user/signout',

    () => {
        signOut(auth)
            .then(() => {
                console.log("signed out successfully ! ");
                toast.success("Logged Out Successfully! 🙏");

            }).catch((err) => {
                toast.error(err.message);
                return err;
            });
    }
)


// _____________________________user Slice_________________________
const userSlice = createSlice({

    name: 'user',
    initialState: INITIAL_STATE,

    reducers: {
    },


    // extra reducers
    extraReducers: (builder) => {

        builder.addCase(userSessionAsyncThunk.fulfilled, (state, action) => {
            state.userData = action.payload;
            state.isLoading = false;
            state.error = null;

        })

        .addCase(signinAsyncThunk.fulfilled, (state, action) => {
            state.userData = action.payload;
            state.isLoading = false;
            state.error = null;

        })
            .addCase(signinAsyncThunk.pending, (state, action) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signinAsyncThunk.rejected, (state, action) => {
                state.error = action.payload;
                state.isLoading = false;
                state.userData = null;
            })

        .addCase(signupAsyncThunk.fulfilled,(state,action)=>{
            state.userData = action.payload;
            state.isLoading = false;
            state.error = null;

        })
        .addCase(signupAsyncThunk.pending,(state,action)=>{
            state.isLoading = true;
            state.error = null;
        })
        .addCase(signupAsyncThunk.rejected,(state,action)=>{
            state.error = action.payload;
            state.isLoading = false;
            state.userData = {}
        })

        .addCase(signoutAsyncThunk.fulfilled,(state,action)=>{
            state.userData = null;
            state.isLoading = false;
            state.error = null;
        })
        .addCase(signoutAsyncThunk.pending,(state,action)=>{
            state.isLoading = true;
            state.error = false;
        }).addCase(signoutAsyncThunk.rejected,(state,action)=>{
            state.error=action.payload;
            state.isLoading = false;

        })
    }
})

// exporting user's actions,reducers, and selector
export const userReducer = userSlice.reducer;
export const userActions = userSlice.actions;
export const userSelector = (state) => state.userReducer