// imports
import { Grid } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom"
import { useEffect, useState } from "react";
import { useSelector,useDispatch } from "react-redux";
import { userSelector } from "../redux/reducers/userReducer";
import { removeFromCartAsyncThunk,decreaseCountAsyncThunk,clearCartAsyncThunk,purchaseAllAsyncThunk,productSelector, increaseCountAsyncThunk } from "../redux/reducers/productReducer";

function Cart() {
    const dispatch = useDispatch();
    const user = useSelector(userSelector).userData;
    const {cart,orders}= useSelector(productSelector)
    const[loading, setLoading] = useState(true);
    const navigate = useNavigate();

    let discount;
    let billingPrice ;

    if(cart){
         discount = Number((cart.cost * 0.10).toFixed(0));
         billingPrice = Number((cart.cost - discount).toFixed(0));
    }
  
    // load the pase for few moment for cart items to be fetched
    useEffect(() => {
        setTimeout(()=> {
            setLoading(false);
        }, 850);
    },[cart]);

    
    // fetch updated cart
    useEffect( () => {
        setTimeout(async ()=> {
            if(cart){
                //  dispatch(fetchCartItemsAsyncThunk(user));
            }
        }, 850);
     
    },[cart,user])

    // purchase items and go to orders page
    const handlePurchase = () => {
        dispatch(purchaseAllAsyncThunk({cart,orders,user}));
        dispatch(clearCartAsyncThunk({user}));
        navigate("/orders");
    }

    // decrease count of an item in cart
    const handleDecreaseCount=(item)=>{

        const index = cart.items.findIndex((i) => i.id === item.id);
        if(index!==-1){

            if(cart.items[index].count>1){
                dispatch(decreaseCountAsyncThunk({user,cart,item}));

            }else{
                dispatch(removeFromCartAsyncThunk({user,cart,item}))
            }
        }
    }

    return (
        <>
            {loading ? <Grid
                height="80"
                width="80"
                color="#0d6efd"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="loader-style"
                visible={true}
            /> :
                cart.items.length === 0 ?
                    <div className="mt-5  container d-flex flex-column align-items-center justify-content-center gap-3">
                        <i className="fa-regular fa-face-frown-open fs-1"></i>
                        <h6 className="display-6 "> Your BuyBu3sy Cart is Empty !</h6>
                        {user ? <Link to="/" className="btn btn-primary">Contin3ue Shopping</Link> : <Link to="/signin" className="btn btn-primary">SignIn Now</Link>}
                    </div>
                    :
                    <div className="container text-center mt-2">
                        <h4 className="mb-3 text-center w-100 display-4">Your Cart</h4>
                        <div className="row row-cols-2">
                            <div className="col col-lg-8">
                                {cart.items.map((item, i) => (
                                    <div key={i} className="card mb-3 " style={{maxWidth: "90%", maxHeight: "200px"}}>
                                        <div className="row g-0">
                                            <div className="d-none d-lg-block  col-lg-4">
                                                <div className="w-100 h-100">
                                                    <img src={item.image} alt="..." className="rounded-start w-100" style={{objectFit: "fill", maxHeight: "200px"}} />
                                                </div>
                                            </div>
                                            <div className="col-12 col-lg-8">
                                                <div className="card-body text-start ">
                                                    <div className="d-flex align-items-start justify-content-between gap-2 mb-2">
                                                        <h5 className="card-title">{item.name}</h5>
                                                        <h5 className="card-title">₹{item.price}</h5>
                                                    </div>
                                                    <div className="d-flex align-items-baseline justify-content-start mb-4 w-25 ">
                                                        <i className="fa-solid fa-circle-plus fs-6 cart-icons me-3" onClick={() =>{console.log("hii"); dispatch(increaseCountAsyncThunk({user,cart,item}))}}></i>
                                                        <span className='card-text fs-4'> {item.count} </span>
                                                        <i className="fa-solid fa-circle-minus fs-6 cart-icons ms-3" onClick={() => handleDecreaseCount(item)} ></i>
                                                    </div>
                                                    <button type="button" className="btn btn-danger" onClick={() => dispatch(removeFromCartAsyncThunk({cart,item,user}))}>Remove</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="col col-lg-4">
                                <div className="card">
                                    <h5 className="card-header">Summary</h5>
                                    <div className="card-body">
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Total Items:</span><span className="text-primary">{cart.count}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Total Amount:</span><span className="text-primary">{cart.cost}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Discount:</span><span className="text-primary">{discount}</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between "><span>Delivery Charges:</span><span className="text-primary">Free</span></p>
                                        <p className="card-text d-flex align-items-baseline justify-content-between border-top border-primary border-2 pt-2"><span>Billing Amount:</span><span className="text-primary">{billingPrice}</span></p>
                                        <div className="d-flex flex-column flex-md-row align-items-stretch justify-content-center gap-2">
                                            <button className="btn btn-primary" type="button" onClick={()=>dispatch(clearCartAsyncThunk({user}))}>Clear Cart</button>
                                            <button className="btn btn-primary" type="button" onClick={handlePurchase}>Purchase</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
            }
        </>
    )
}

export default Cart;