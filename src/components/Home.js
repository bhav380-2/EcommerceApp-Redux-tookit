import ProductCard from "./ProductCard";
import { useEffect, } from "react";
import { Grid } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { userSelector } from "../redux/reducers/userReducer";
import { productActions, productSelector } from "../redux/reducers/productReducer";

function Home() {
    const dispatch = useDispatch();
    const store = useSelector(userSelector);
    const user = store.userData;
    const loading = store.isLoading;
    const { products } = useSelector(productSelector);

    // load products
    useEffect(() => {
        dispatch(productActions.setProducts())
    }, [dispatch]);

    return (
        <>
            {/* <SignIn/> */}
            {loading ? <Grid
                height="80"
                width="80"
                color="#0d6efd"
                ariaLabel="grid-loading"
                radius="12.5"
                wrapperClass="loader-style"
                visible={true}
            /> :
                <div className="container h-100">
                    <div className="d-flex align-items-center justify-content-center w-100 border-bottom border-primary  border-2 my-3">
                        <h1 className="display-6 ">Welcome {user && user.name}</h1>
                    </div>
                    <div className="d-flex justify-content-evenly flex-wrap gap-3 my-3">
                        {products.map((product, i) => <ProductCard product={product} key={i} />)}
                    </div>
                </div>}
        </>
    )
}

export default Home;