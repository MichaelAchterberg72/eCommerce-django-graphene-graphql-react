import React from "react";
import { FeeItem, CartCard } from "../components/generics.js";
import Layout from "../components/layout.js";
import styles from "../styles/cartStyle.module.scss";
// import styles from "../styles/singleProductStyle.module.scss";



export default function Cart(){
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
                    <CartCard />
                    <CartCard />
                    <CartCard />
                    <CartCard />
                    <CartCard />
                    <CartCard />
                </div>
                <div className={styles.rightItem}>
                    <div className={styles.infoText}>SHIP TO</div>
                    <div className={styles.addressInfo}>2303 Butterfly Street, Marloth Park</div>
                    <div className={styles.link}>CHANGE ADDRESS</div>
                    <br />
                    <div className={styles.infoText}>TOTAL</div>
                    <div className={styles.price}>$3,460.00</div>
                    <div className={styles.breakdown}>
                    <div className={styles.title}>Fee Breakdown</div>
                    <FeeItem title="SUBTOTAL" price="$3,160.00" />
                    <FeeItem title="SHIPPING" price="$300.00" />
                    <FeeItem title="TAXES" price="$0.00" />
                    <button>PROCEED TO PAYMENT</button>
                    </div>
                </div>
            </div>
        </div>
    </Layout>
    );
};
