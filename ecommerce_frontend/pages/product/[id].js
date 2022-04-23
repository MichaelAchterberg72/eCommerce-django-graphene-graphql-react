import React, { useEffect } from "react";
import Layout from "../../components/layout.js";
import { ProductCard, HomeSection, CommentItem, QuantityPicker } from "../../components/generics.js";
import styles from "../../styles/singleProductStyle.module.scss";
import { client } from "../../lib/network.js";
import { singleProductQuery } from "../../lib/graphQueries.js";
import { customNotifier } from "../../components/customNotifier.js";
import ProductComponent from '../components/productComponent.js';

export default function SingleProductPage({activeProduct}) {

    useEffect(() => {
        if (!activeProduct) {
            customNotifier({
                type: "error",
                content: "This product does not exist!"
            });
            // Router.push("/");
        }
    }, [])

    if (!activeProduct) return <div />;

    const {
        data: { product },
    } = activeProduct;

    const {productImages} = product;

    const getCover = () => {
        let image = "";
        for (let i of productImages){
            if(i.isCover){
                image = i.image.image;
                break;
            }
        }
        return image;
    };
   
    const getOtherImagews = () => {
        let image = [];
        for (let i of productImages){
            if(!i.isCover){
                image.push(i.image.image);
                break;
            }
        }
        return image;
    };

    return (
    <Layout hidefooter>
        <div className={styles.container}>
            <div className={styles.headerLinks}>
                <div className={styles.linkItem}>Home</div>
                <img src="/chevron-reight" />
                <div className={styles.linkItem}>{product.category.name}</div>
                <img src="/chevron-reight" />
                <div className={styles.linkItem}>
                    {product.name.length > 30 
                        ? product.name.substring(0, 30) 
                        : product.name}
                </div>
            </div>
            <div className={styles.mainContent}>
                <div className={styles.rightItem}>
                    <div className={styles.mainCover}>
                        <img src={getCover()} alt="" />
                    </div>
                    <div className={styles.imageSliders}>
                        {getOtherImagews().map((item, id) => <img key={id} src={item} alt="" />)}
                    </div>
                </div>
                <div className={styles.leftItem}>
                    <div className={styles.title}>
                        {product.name}
                    </div>
                    <div className={styles.listedBy}>
                        BY <strong>{product.business.name}S</strong>
                    </div>
                    <div className={styles.priceInfo}>
                        <h3>${product.price}</h3>
                        <small>SAVE 12% INCLUSIVE OF ALL TAXES</small>
                    </div>
                    {product.totalAvailable > 0 ? (
                        <div className={styles.purchaseInfo}>
                            <QuantityPicker maxAvailable={product.totalAvailable}/>>
                            <button>ADD TO CART</button>
                            <img src="favorite.svg" />
                        </div>
                     ) : (
                        <div>Product sold out</div>
                    )}
                    <div className={styles.description}>
                        <div className={styles.descTitle}>
                            DESCRIPTION
                        </div>
                        <p>
                            {product.description}
                        </p>
                    </div>
                    {/* <div className={styles.comments}>
                        <div className={styles.commentHeader}>
                            <div className={styles.commenttitle}>COMMENTS - 20</div>
                            <div className={styles.link}>SHOW ALL</div>
                        </div>
                        <CommentItem />
                    </div> */}
                </div>
            </div>
        </div>
        <ProductComponent title="SIMILAR PRODUCTS" tag="similar" category={product.category.name} />
        {/* <HomeSection title="SIMILAR PRODUCTS" canShowAll onSholAll={() => alert()}>
            {[0,0,0,0,0,0,0,0,0,0,0].map((item, id) => (
                <ProductCard key={id} />
            ))}
        </HomeSection> */}
    </Layout>
    );
}

SingleProductPage.getInitialProps = async (ctx) => {

    const { query } = ctx;
    let id = query.id;

    const res = await client.query({
        query: singleProductQuery,
        variables: {id}
    }).catch(e => null)

    return { activeProduct: res };
};