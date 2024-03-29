// imports
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { productSelector,addToCartAsyncThunk } from "../redux/reducers/productReducer";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../redux/reducers/userReducer";

function ProductCard({ product }) {

    const dispatch = useDispatch();
    const cart = useSelector(productSelector).cart;
    const user = useSelector(userSelector).userData;
    const [isInCart, setIsInCart] = useState(false);
    const navigate = useNavigate();

    // identify which items are in cart
    useEffect(() => {
        if(cart){
            const index = cart.items.findIndex((item) => item.id === product.id);
            if (index !== -1) {
                setIsInCart(true);
            } else {
                setIsInCart(false);
            }
        }
    }, [cart])

    //add selected item in the cart
    async function handleAddCart(product) {
        if (!user) {console.log("user is null");

            navigate("/")
        } else {

            setIsInCart(true);
            dispatch(addToCartAsyncThunk({cart,product,user}))
        }
    }

    // remove selected item from cart
    async function handleRemoveCart(product) {
        setIsInCart(false);
    }

    return (
        <div className="card border border-primary border-1 " style={{ width: "15rem" }}>
            <img src={product.image} className="card-img-top border-bottom border-1 border-primary-subtle  " alt="..." height={250} />
            <div className="card-body">
                <h5 className="card-title">{product.name}</h5>
                <p className="card-text fs-5">₹{product.price}</p>
            </div>
            {user && isInCart ?
                    <button type="button" className="btn btn-danger w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleRemoveCart(product)}>Remove</button>
                    :
                    <button type="button" className="btn btn-primary w-75 align-self-center mb-3 btn-lg fs-5" onClick={() => handleAddCart(product)} >Add to Cart</button>}
        </div >
    )
}

export default ProductCard;