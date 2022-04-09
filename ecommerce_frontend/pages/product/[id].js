import React from "react";
import Layout from "../../components/layout.js";
import { ProductCard, HomeSection, CommentItem, QuantityPicker } from "../../components/generics.js";
import styles from "../../styles/singleProductStyle.module.scss";

export default function SingleProductPage() {
    return (
    <Layout hidefooter>
        <div className={styles.container}>
            <div className={styles.headerLinks}>
                <div className={styles.linkItem}>Home</div>
                <img src="/chevron-reight" />
                <div className={styles.linkItem}>Phones</div>
                <img src="/chevron-reight" />
                <div className={styles.linkItem}>Samsung Note 20 Ultra</div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.rightItem}>
                    <div className={styles.mainCover}>
                        <img src="" alt="" />
                    </div>
                    <div className={styles.imageSliders}>
                        <img src="" alt="" />
                        <img src="" alt="" />
                        <img src="" alt="" />
                    </div>
                </div>
                <div className={styles.leftItem}>
                    <div className={styles.title}>
                        Samsung note 20 pro ultra, 1tb rom, 26gb ram
                    </div>
                    <div className={styles.listedBy}>
                        BY <strong>JT PHONES AND ACCESSORIES</strong>
                    </div>
                    <div className={styles.priceInfo}>
                        <h3>$1,460.00</h3>
                        <small>SAVE 12% INCLUSIVE OF ALL TAXES</small>
                    </div>
                    <div className={styles.purchaseInfo}>
                        <QuantityPicker />>
                        <button>ADD TO CART</button>
                        <img src="favorite.svg" />
                    </div>
                    <div className={styles.description}>
                        <div className={styles.descTitle}>
                            DESCRIPTION
                        </div>
                        <p>
                            Technology: GSM / CDMA / HSPA / EVDO / LTE / 5G Announced: 2020,
                            August 3 Status: Available. Released 2020, August 21
                            Dimensions: 164.8 x 77.2 x 8.1 mm (6.49 x 3.04 x 0.32 in)
                            Weight: 208 g (7.34 oz) Build: Glass front (Gorilla Glass
                            Victus), glass back (Gorilla Glass Victus), stainless steel
                            frame);
                        </p>
                    </div>
                    <div className={styles.comments}>
                        <div className={styles.commentHeader}>
                            <div className={styles.commenttitle}>COMMENTS - 20</div>
                            <div className={styles.link}>SHOW ALL</div>
                        </div>
                        <CommentItem />
                    </div>
                </div>
            </div>
        </div>
        <HomeSection title="SIMILAR PRODUCTS" canShowAll onSholAll={() => alert()}>
            {[0,0,0,0,0,0,0,0,0,0,0].map((item, id) => (
                <ProductCard key={id} />
            ))}
        </HomeSection>
    </Layout>
    );
}