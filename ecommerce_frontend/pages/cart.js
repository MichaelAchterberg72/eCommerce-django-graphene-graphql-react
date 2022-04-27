import React, {useState, useEffect, useContext} from "react";
import { FeeItem, CartCard } from "../components/generics.js";
import withAuth from "../../components/withAuth.js";
import Layout from "../components/layout.js";
import { cartQuery, completePaymentMutation } from "../lib/graphQueries.js";
import { client, getClientHeaders, updateCart } from "../lib/network.js";
import styles from "../styles/cartStyle.module.scss";
import { customNotifier } from "../components/customNotifier.js";
import { errorHandler } from "../lib/errorHandler.js";

function Cart(){

    const [carts, setCarts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [loading, setLoading] = useState(false);
    const shipping = 300;

    const {state:{tokenData}} = useContext(MyContext);

    useEffect(() => {
        getCarts();
    }, []);

    const getCarts = async () => {
        const res = await client.query({
            query: cartQuery,
            context: getClientHeaders(tokenData.access)
        }).catch(e => customNotifier({
            type: "error",
            contect: errorHandler(e)
        }));

        if (res) {
            setCarts(res.data.carts);
            setFetching(false);
        }
    };

    const handleQuantityChange = async (cartId, quantity) => {
        if (loading) return;
        const res = await updateCart(cartId, quantity);
        if (res) {
            getCarts();
        }
    };

    const completePayment = async () => {
        const res = await client.mutate({
            mutation: completePaymentMutation,
            context: getClientHeaders(tokenData.access)
        }).catch(e => customNotifier({
            type: "error",
            content: errorHandler(e)
        }));

        if (res) {
            customNotifier({
                type: "success",
                content: "Payment successful. Your order has been taken"
            });
            window.location.reload();
        }
    };

    const getTotalPrice = () => {
        let total = 0;
        for (let cart of carts){
            const price = cart.quantity * cart.product.price;
            total += price;
        }
        return total;
    };

    if (fetching) return <div />;

    return (
    <Layout hideFooter>
        <div className={styles.container}>
            <div className={styles.headerLinks}>
                <div className={styles.linkItem}>Home</div>
                <img src="/chevron-reight" />
                <div className={styles.linkItem}>Cart</div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.leftItem}>
                    {carts.map((item, key) => (
                        <CartCard 
                            key={key} 
                            data={item}
                            handleQuantityChange={handleQuantityChange} />
                    ))}
                </div>
                <div className={styles.rightItem}>
                    {/* <div className={styles.infoText}>SHIP TO</div>
                    <div className={styles.addressInfo}>2303 Butterfly Street, Marloth Park</div>
                    <div className={styles.link}>CHANGE ADDRESS</div>
                    <br /> */}
                    <div className={styles.infoText}>TOTAL</div>
                    <div className={styles.price}>${getTotalPrice() + (carts.length > 0 ? shipping : 0)}</div>
                    { carts.length > 1 && (
                        <div className={styles.breakdown}>
                        <div className={styles.title}>Fee Breakdown</div>
                        <FeeItem title="SUBTOTAL" price={`$${getTotalPrice()}`} />
                        <FeeItem title="SHIPPING" price={`$${shipping}`} />
                        <FeeItem title="TAXES" price="$0.00" />
                            <button 
                                disabled={loading} 
                                className={`${loading ? "loading disabled" : ""}`}
                                onClick={completePayment}
                            >
                                PROCEED TO PAYMENT
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    </Layout>
    );
};

export default withAuth(Cart);
