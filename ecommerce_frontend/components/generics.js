import React, { useRef, useState } from "react";
import { client } from "../lib/network.js";
import { uploadImageMutation } from "../lib/graphQueries";
import styles from "../styles/generics.module.scss";
import { customNotifier } from "./customNotifier";
import { errorHandler } from "../lib/errorHandler.js";

export const ProductCard = ({ data }) => {
    const { name, id, price, productImages} = data;
    const getCoverImages = (images) => {
        let image = "";
        for (let i of images){
            if(i.isCover){
                image = i.image.image;
                break;
            }
        }
        return image;
    };
    return <div className={styles.productCard}>
        <div className={styles.productCover}>
            <img src={getCoverImages(productImages)} alt="" />
        </div>
        <div className={styles.productContent}>
            <div className={styles.productTopContent}>
                <div className={styles.productPrice}>${price}</div>
                <div className={styles.productReaction}>
                    <img src="/add.svg" />
                    <img src="/favorite.svg" />
                </div>
            </div>
            <div className={styles.productInformation}>
                {name}
            </div>
        </div>
    </div>
  };

  export const CategoryCard = ({data}) => {
    const { id, name } = data;
    return <div className={styles.categoryCard}>
        <div className={styles.categoryCover}>
            <img src="/test.png" alt="" />
        </div>
        <div className={styles.categoryContent}>
            <h3>{name}</h3>
            <p>20 items available</p>
        </div>
    </div>
  };

  export const HomeSection = ({noHeader, title, canShowAll, onShowAll, children}) => {
    return(
      <div className={styles.section}>
          {!noHeader && (
            <div className={styles.sectionHeading}>
                <div className={styles.title}>
                    {title}
                </div>
                {
                    canShowAll && (
                    <div className={styles.link} onClick={onShowAll}>
                    Show All
                    </div>
                )}
            </div>
          )}
        <div className={styles.sectionBody}>{children}</div>
      </div>
    );
  };
  
  export const CommentItem = (commentData) => {
      return (
          <div className={styles.commentItem}>
              <p>
                Good product, Lorem ipsum dolor sit amet consectetur adipisicing elit. Maxime mollitia,
                molestiae quas vel sint commodi repudiandae consequuntur voluptatum laborum
                numquam blanditiis harum quisquam eius sed odit fugiat iusto fuga praesentium
                optio, eaque rerum! Provident similique accusantium nemo autem. Veritatis
                obcaecati tenetur iure eius earum ut molestias architecto voluptate aliquam
                nihil, eveniet aliquid culpa officia aut! Impedit sit sunt quaerat, odit,
                tenetur error, harum nesciunt ipsum debitis quas aliquid. Reprehenderit,
                quia.
              </p>
              <div className={styles.footer}>
                  <div className={styles.title}>Alan Smith</div>
                  <div className={styles.title}>12-01-2022</div>
              </div>
          </div>
      );
  };

export const QuantityPicker = () => {
    return (
        <div className={styles.quantitySelector}>
            <small>QTY</small>
            <select>
                <option>1</option>
            </select>
        </div>
    );
};

export const CartCard = (CartData) => {
    return (
        <div className={styles.CartCard}>
            <div className={styles.leftCartItem}>
                <div className={styles.cartCover}>
                    <img src="test.png" alt="" />
                </div>
            </div>
            <div className={styles.middleCartItem}>
                Samsung Note 20 Ultra
            </div>
            <div className={styles.rightCartItem}>
                <div className={styles.cartItemPrice}>
                    $3,460.00
                </div>
                <QuantityPicker />
            </div>
        </div>
    );
};

export const FeeItem = ({title, price}) => {
    return (
        <div className={styles.FeeCard}>
            <div className={styles.feeTitle}>{title}</div>
            <div className={styles.feeContent}>{price}</div>
        </div>
    );
};

export const RequestCard = (requestData) => {
    return (
        <div className={styles.RequestCard}>
            <div className={styles.leftRequest}>
                <div className={styles.requestCover}>
                    <img src="test.png" alt="" />
                </div>
                <div className={styles.content}>
                    <div className={styles.title}>
                        Samsung note 20 pro ultra, 1tb rom, 26gb ram
                    </div>
                    <div className={styles.downItem}>
                        <div className={styles.address}>
                            Address: 2303 Butterfly Street, Marloth Park
                        </div>
                        <div className={styles.contact}>
                            From Thomas lane (
                                <span>+27781283938</span>
                            )
                        </div>
                    </div>
                </div>
            </div>
            <div className={styles.rightRequest}>
                <div className={styles.price}>
                    $3,460.00
                </div>
                <div className={styles.count}>
                    4 Items
                </div>
                <QuantityPicker />
            </div>
        </div>
    );
};

export const ImageSelector = ({ title="image", cover=false, handleImageUpload }) => {
    const fileRef = useRef();
    const [loading, setLoading] = useState(false);
    const [imageObj, setImageObj] = useState(null);
    const handleChange = async (e) => {
        const image = e.target.files[0];
        setLoading(true);
        const result = await client.mutate({
            mutation: uploadImageMutation,
            variables: {image}
        })
        .catch((e) =>
            customNotifier({
                type: "error",
                content: errorHandler(e)
            })
        );

        if(result) {
            setImageObj(result.data.imageUpload.image);
            handleImageUpload({...result.data.imageUpload.image, isCover: cover});
        }
        setLoading(false);
    };
    const handleClick = () => {
        if(loading)return;
        fileRef.current.value = null;
        fileRef.current.click();
    };
    return (
        <>
            {imageObj ? (
                <div 
                    src={imageObj.image} 
                    className={`${styles.ImageLoaded} ${loading ? styles.imageLoading : ""}`} 
                    style={{backgroundImage: `url('${imageObj.image})`}}
                    onChange={handleChange} />
            ) : 
            (
                <div className={`${styles.ImageSelector} ${loading ? styles.imageLoading : ""}`} onClick={handleClick}>
                    {title}
                </div>
            )}
            <input 
                type="file" 
                ref={fileRef} 
                style={{display:"none"}} 
                onChange={handleChange}
            ></input>
        </>
    );
}; 