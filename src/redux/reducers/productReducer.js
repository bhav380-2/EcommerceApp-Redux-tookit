import { createAsyncThunk, createSlice } from "@reduxjs/toolkit"
import { data } from "../../data";
import db from "../../firebaseInit"
import { doc, onSnapshot, updateDoc } from "firebase/firestore"
import { toast } from "react-toastify";


// product state
const INITIAL_STATE = {
    products: data,
    categories: ["Men's Clothing", "Women's Clothing", "Electronics", "Jewellery"],
    searchText: "",
    filterPrice: 50000,
    cart: {
        count: 0,
        cost: 0,
        items: []
    },
    orders: [],
    filterCategories: []
}

// ______________________remove from cart________________________________
export const removeFromCartAsyncThunk = createAsyncThunk('product/removeFromCart',

    async (payload) => {

        const {cart,item,user} = payload;
        const removedItem = cart.items.find((i) => i.id === item.id);
        const updatedItems = cart.items.filter((i) => i.id !== item.id);

        const newCart = {
            cost: cart.cost - (item.price * removedItem.count),
            count: cart.count - removedItem.count,
            items: updatedItems
        }

        await updateDoc(doc(db, "users", user.email), {
            cart: newCart
        });
        toast.success("Item removed Successfully!");
        return newCart;
    }
)

// __________________________decrease item count in cart_____________________
export const decreaseCountAsyncThunk = createAsyncThunk('product/decreaseCount',

    async (payload) => {

        const { item, cart, user } = payload;
        const index = cart.items.findIndex((i) => i.id === item.id);

        if (index !== -1) {
            if (cart.items[index].count > 1) {

                let items = [...cart.items];
                let product = { ...items[index] };
                product.count--;
                items[index] = product;

                const newCart = {
                    cost: cart.cost - product.price,
                    count: cart.count - 1,
                    items: items
                }

                await updateDoc(doc(db, "users", user.email), {
                    cart: newCart
                });

                return newCart
            }
        }
    }
)

// _________________________increase item count in cart______________________
export const increaseCountAsyncThunk = createAsyncThunk('product/increaseCount',

    async (payload) => {

        const { item, cart, user } = payload;
        const index = cart.items.findIndex((i) => i.id === item.id);

        if (index !== -1) {

            let items = [...cart.items];
            let product = { ...items[index] };
            product.count++;
            items[index] = product;

            const newCart = {
                cost: cart.cost + product.price,
                count: cart.count + 1,
                items: items
            }

            await updateDoc(doc(db, "users", user.email), {
                cart: newCart
            });
            return newCart
        }
    }
)

// ________________________clear cart_____________________________________
export const clearCartAsyncThunk = createAsyncThunk('product/clearCart',

    async (payload) => {
        const { user } = payload;
        const cart = {
            cost: 0,
            count: 0,
            items: []
        }
        await updateDoc(doc(db, "users", user.email), {
            cart: cart
        });
        return cart;
    }
)

// ________________________purchaseAll cartItems__________________________________
export const purchaseAllAsyncThunk = createAsyncThunk('product/purchaseAll',

    async (payload) => {

        const { cart, orders, user } = payload;
        let date = new Date();
        let currentDate = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
        let order = {
            orderDate: currentDate,
            total: cart.cost,
            details: cart.items
        }

        const newOrders = [order, ...orders];
        await updateDoc(doc(db, "users", user.email), {
            orders: newOrders
        });

        return newOrders;
    }
)

// _____________Fetch cart items_______________________
export const fetchCartItemsAsyncThunk = createAsyncThunk('product/fetchCart',

    (user) => {
        if (user) {
            let promise = new Promise(function (resolve, reject) {

                onSnapshot(doc(db, "users", user.email), (currentUser) => {

                    if (currentUser.data()) {
                        resolve(currentUser.data().cart)
                    } else {
                        reject(null);
                    }
                })
            });
            return promise.then();
        }
    }
)

// _____________fetch orders____________________________
export const fetchOrdersAsyncThunk = createAsyncThunk('product/fetchOrders',
    (user) => {
        if (user) {
            let promise = new Promise(function (resolve, reject) {

                onSnapshot(doc(db, "users", user.email), (currentUser) => {
                    if (currentUser.data()) {
                        resolve(currentUser.data().orders);
                    } else {
                        reject(null);
                    }
                })
            });
            return promise.then();
        }
    }
)

// ____________add to cart____________________________
export const addToCartAsyncThunk = createAsyncThunk('product/addToCart',
    async (payload) => {

        let { cart, user } = payload
        const isItemPresent = cart.items.some((item) => item.id === payload.product.id);
        let item = { category: payload.product.category, id: payload.product.id, image: payload.product.image, price: payload.product.price, name: payload.product.name, count: 1 };

        let newCart = {
            cost: cart.cost + item.price,
            count: cart.count + 1,
            items: [...cart.items, item]
        }

        if (isItemPresent) {
            return null;
        } else {

            await updateDoc(doc(db, "users", user.email), {
                cart: newCart
            });
            toast.success("Item added Successfully!");
            return newCart
        }
    }
)

// ______________________product Slice___________________________
const productSlice = createSlice({
    name: 'product',
    initialState: INITIAL_STATE,


    // reducers
    reducers: {

        filter: (state, action) => {

            state.filterPrice = action.payload.filterPrice;

            if (action.payload.category !== null) {
                if (state.filterCategories.includes(action.payload.category)) {
                    const temp = state.filterCategories.filter((cat) => cat !== action.payload.category);
                    state.filterCategories = temp;
                }
                else {
                    state.filterCategories = [...state.filterCategories, action.payload.category];
                }
            }
        },

        search: (state, action) => {
            state.searchText = action.payload;
        },

        setProducts: (state, action) => {
            if (state.filterCategories.length === 0) {
                const filteredProducts = data.filter((product) => product.price <= state.filterPrice && product.name.toLowerCase().includes(state.searchText.toLowerCase()));
                state.products = filteredProducts;
            }
            else {
                const filteredProducts = data.filter((product) => product.price <= state.filterPrice && state.filterCategories.includes(product.category) && product.name.toLowerCase().includes(state.searchText.toLowerCase()));
                state.products = filteredProducts;
            }
        }
    },

    // extra reducers
    extraReducers: (builder) => {

        builder.addCase(fetchCartItemsAsyncThunk.fulfilled, (state, action) => {
            const cart = action.payload;
            state.cart = cart
        })
            .addCase(fetchOrdersAsyncThunk.fulfilled, (state, action) => {
                state.orders = action.payload;
            })
            .addCase(addToCartAsyncThunk.fulfilled, (state, action) => {

                if (action.payload) {
                    state.cart = action.payload
                }
            })
            .addCase(purchaseAllAsyncThunk.fulfilled, (state, action) => {
                state.orders = action.payload
            })
            .addCase(clearCartAsyncThunk.fulfilled, (state, action) => {
                state.cart = action.payload
            })
            .addCase(increaseCountAsyncThunk.fulfilled, (state, action) => {
                console.log("new cart", action.payload)
                state.cart = action.payload
            })
            .addCase(decreaseCountAsyncThunk.fulfilled, (state, action) => {
                state.cart = action.payload
            })
            .addCase(removeFromCartAsyncThunk.fulfilled,(state,action)=>{
                state.cart = action.payload;
            })
    }
})


// exporting product's actions,reducers and selector
export const productActions = productSlice.actions;
export const productReducer = productSlice.reducer;
export const productSelector = (state) => state.productReducer