import React from "react";
import { ImageSelector } from "../../components/generics.js";
import Layout from "../../components/layout";
import styles from "../../styles/singleProductStyle.module.scss";

export default function AddProduct () {
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
            <div className={styles.productContainer}>
                <div className={styles.leftCon}>
                    <div className="input-field">
                        <input placeholder="Name" name="name" type="text" required />
                    </div>
                    <div className="input-field">
                        <input placeholder="Price" name="price" type="number" required />
                    </div>
                    <div className="input-grid">
                        <div className="input-field">
                            <select>
                                <option>Category</option>
                            </select>
                        </div>
                        <div className="input-field">
                            <input placeholder="Total Count" name="totalCount" type="number" required />
                        </div>
                    </div>
                    <textarea placeholder="Dexcription" />
                </div>
                <div className={styles.rightCon}>
                    <div className={styles.MainImage}>
                        <ImageSelector title="cover image" />
                    </div>
                    <div className={styles.OtherImages}>
                        <ImageSelector />
                        <ImageSelector />
                        <ImageSelector />
                        <ImageSelector />
                        <ImageSelector />
                        <ImageSelector />
                    </div>
                </div>
            </div>
        </Layout>
    );
};