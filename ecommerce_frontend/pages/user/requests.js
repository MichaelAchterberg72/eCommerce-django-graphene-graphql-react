import React from "react";
import { RequestCard } from "../../components/generics.js";
import Layout from "../../components/layout";
import styles from "../../styles/singleProductStyle.module.scss";

export default function Requests() {
    return (
        <Layout hideFooter>
            <div className={styles.container}>
                <div className={styles.headerLinks}>
                    <div className={styles.linkItem}>Home</div>
                    <img src="/chevron-reight" />
                    <div className={styles.linkItem}>Phones</div>
                    <img src="/chevron-reight" />
                    <div className={styles.linkItem}>Samsung Note 20 Ultra</div>
                </div>
            </div>
            <div>
                <RequestCard />
                <RequestCard />
                <RequestCard />
                <RequestCard />
                <RequestCard />
                <RequestCard />
            </div>
        </Layout>
    );
};