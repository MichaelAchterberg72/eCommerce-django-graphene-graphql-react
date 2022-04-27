import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../../components/customContext.js";
import { customNotifier } from "../../components/customNotifier.js";
import { ProductCardOwned } from "../../components/generics.js";
import Layout from "../../components/layout";
import withAuth from "../../components/withAuth.js";
import { errorHandler } from "../../lib/errorHandler.js";
import { deleteProductMutation, productQuery } from "../../lib/graphQueries.js";
import { client, getClientHeaders } from "../../lib/network.js";
import styles from "../../styles/singleProductStyle.module.scss";

function Products() {

    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);

    const {state:{tokenData}} = useContext(MyContext);

    useEffect(() => {
        fetchProducts();
    }, []);

    const deleteProduct = (productId) => {
        client.mutate({
            mutation: deleteProductMutation,
            variables: {productId},
            context: getClientHeaders(tokenData.access)
        }).catch(e => customNotifier({
            type: "error",
            content: errorHandler(e)
        }));

        const newProducts = products.filter(item => item.id !== productId);
        setProducts(newProducts);
    };

    const fetchProducts = async () => {
        const res = await client.query({
            query: productQuery,
            variables: {mine: true},
            context: getClientHeaders(tokenData.access)
        }).catch(e => customNotifier({
            type: "error",
            content: errorHandler(e)
        }));
        if (res){
            setProducts(res.data.products.results);
            setFetching(false);
        }
    };

    if (fetching){
        return <div />
    }

    return (
        <Layout hideFooter>
            <br />
            <div className={styles.productGroup}>
                {products.map((item, key) => <ProductCardOwned 
                    deleteProduct={deleteProduct} 
                    data={data} 
                    key={key} />)}
            </div>
        </Layout>
    );
};

export default withAuth(Products);