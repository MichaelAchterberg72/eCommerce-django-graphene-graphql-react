import React from "react";
import Layout from "../../components/layout.js";
import styles from "../../styles/dashboardStyle.module.scss";

export default function Dashboard(){
    return (
        <Layout hideFooter>
            <div className={styles.greeting}>
                <h3>Hello Rachel</h3>
                <p>How are you doing today?</p>
            </div>
            <NoBusiness />
            <HasBusiness />
        </Layout>
    );
};

const NoBusiness = () => {
    return (
        <div className={styles.noBusiness}>
            <img src="/invalid.png" />
            <p>
                Oops!, you need to create a business name first before you can add products
            </p>
            <button>
                CREATE BUSINESS
            </button>
        </div>
    );
};

const HasBusiness = () => {
    return (
        <div className={styles.hasBusiness}>
            <div className={styles.businessCard}>
                <img src="/service.png" />
                <p>View Products</p>
            </div>
            <div className={styles.businessCard}>
                <img src="/cart.png" />
                <p>View Requests</p>
            </div>
        </div>
    );
};