import React, { useState, useContext, useEffect } from "react";
import { ImageSelector } from "../../components/generics.js";
import withAuth from "../../components/withAuth.js";
import Layout from "../../components/layout";
import styles from "../../styles/singleProductStyle.module.scss";
import { MyContext } from "../../components/customContext.js";
import { client, getClientHeaders, getActiveToken, getNewToken, getCategories } from "../../lib/network.js";
import { categoryQuery, createProductMutation } from "../../lib/graphQueries.js";
import { customNotifier } from "../../components/customNotifier.js";
import { errorHandler } from "../../lib/errorHandler.js";
import { expiredToken, setCategory } from "../../lib/dataVariables.js";

function AddProduct () {

    const [imageList, setImageList] = useState([]);
    const [categorys, setCategories] = useState([]);
    const [fetching, setFetching] = useState(true);
    const {state: {}, dispatch} = useContext(MyContext);
    const [productData, setProductData] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [loading, setLoading] = useState(false);

    const onChange = (e) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value,
        })
    };

    useEffect(() => {
        if(categorys){
            setCategories(categorys);
            setFetching(false);
        }else{
            fetchCategories();
        }
    }, [])

    const fetchCategories = async () => {
        const res = await getCategories();

        if (res){
            setCategories(res);
            dispatch({type: setCategory, payload: res});
            setFetching(false);
        }
    };

    const handleImageUpload = (imageObj) => {
        const {id, isCover} = imageObj;
        setImageList([...imageList, { imageId:id, isCover }])
    };

    const submit = (e) => {
        e.preventDefault();
        setLoading(true);
        const activeToken = getActiveToken();
        handleSubmit(activeToken.access, activeToken.refresh);
        customNotifier({
            type: "success",
            content: "Your product has been successfully added",
        });
    };

    const handleSubmit = async (access, refresh) => {
        
        try{
            const result = await client
            .mutate({
                mutation: createProductMutation,
                variables: {
                    images: ImageList,
                    productData,
                    totalCount,
                },
                context: getClientHeaders(access)
            });
            setLoading(false);
        } catch (e) {
            const errorInfo = errorHandler(e);
            if(errorInfo === expiredToken) {
                const newAccess = await getNewToken(e, refresh);
                if(newAccess){
                    handleSubmit(newAccess, refresh)
                }
            }
            else {
                customNotifier({
                    type: "error",
                    content: errorInfo,
                });
                setLoading(false);
            }
        }
    };

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
            <form onSubmit={submit}>
            <div className={styles.productContainer}>
                <div className={styles.leftCon}>
                    <div className="input-field">
                        <input 
                            placeholder="Name" 
                            name="name" 
                            type="text" 
                            value={productData["name"] || ""} 
                            onChange={onChange}
                            required 
                        />
                    </div>
                    <div className="input-field">
                        <input 
                            placeholder="Price" 
                            name="price" 
                            type="number" 
                            value={productData["price"] || ""} 
                            onChange={onChange}
                            required 
                        />
                    </div>
                    <div className="input-grid">
                        <div className="input-field">
                            <select 
                                name="categoryId" 
                                value={productData["categoryId"] || ""} 
                                onChange={onChange} 
                                required
                            >
                                <option value="">Select category...</option>
                                {fetching && <option>Loading...</option>}
                                {categorys.map((item, i) => <option value={item.id} key={i}>{item.name}</option>)}
                            </select>
                        </div>
                        <div className="input-field">
                            <input 
                                placeholder="Total Count" 
                                name="totalCount" 
                                value={totalCount}
                                onChange={e => setTotalCount(e.target.value)}
                                type="number" 
                                required 
                            />
                        </div>
                    </div>
                    <textarea 
                        placeholder="Description" 
                        name="description"
                        value={productData["description"] || ""} 
                        onChange={onChange}
                    />
                </div>
                <div className={styles.rightCon}>
                    <div className={styles.MainImage}>
                        <ImageSelector 
                            handleImageUpload={handleImageUpload} 
                            cover
                            title="cover image" />
                    </div>
                    <div className={styles.OtherImages}>
                        <ImageSelector handleImageUpload={handleImageUpload} />
                        <ImageSelector handleImageUpload={handleImageUpload} />
                        <ImageSelector handleImageUpload={handleImageUpload} />
                        <ImageSelector handleImageUpload={handleImageUpload} />
                        <ImageSelector handleImageUpload={handleImageUpload} />
                        <ImageSelector handleImageUpload={handleImageUpload} />
                    </div>
                </div>
            </div>
            <button 
                disabled={loading} 
                type="submit" 
                className={`${styles.createButton} ${loading ? 'loading disabled' : ""}`}
            >Create Product</button>
            </form>
        </Layout>
    );
};

export default withAuth(AddProduct);