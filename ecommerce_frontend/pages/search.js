import React from 'react';
import styles from "../styles/generics.module.scss";
import Layout from "../components/layout.js";
import { ProductCard, CategoryCard } from "../components/generics";

export default function Search(){
    return (
    <Layout hidefooter>
        <div className={styles.section}>
            <div className={styles.sectionHeading}>
                <div className={styles.title}>
                    RESULTS FOR IPHONE: 279 ITEMS FOUND
                </div>
                <div className={styles.title}>
                    SORT BY: <span className={styles.link}>POPULARITY</span>
                </div>
            </div>
            <div className={styles.sectionBody}>
            {[0,0,0,0,0.0,0,0,0,0.0,0,0,0,0].map((item, id) => (
                <ProductCard key={id} />
            ))}
            </div>
        </div>
    </Layout>
    )
}