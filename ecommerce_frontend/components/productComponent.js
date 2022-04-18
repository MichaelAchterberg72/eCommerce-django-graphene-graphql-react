import React, { useEffect, useState } from "react";
import { errorHandler } from "../lib/errorHandler";
import { productQuery } from "../lib/graphQueries";
import { client } from "../lib/network";
import { customNotifier } from "./customNotifier";
import { HomeSection, ProductCard } from "./generics";

export default function ProductComponent({title, tag}) {

    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);

    useEffect(() => {
        getProducts();
    }, []);

    const getProducts = async () => {
        const result = await client.query({
            query: productQuery
        }).catch(e => customNotifier({
            type: "error",
            content: errorHandler(e)
        }));

        if (result) {
            const results = result.data.products.results;
            setProducts(results);
            setFetching(false);
        }
    };

    return (
        <HomeSection title={title} canShowAll onSholAll={() => alert()}>
            {!fetching && products.map((item, id) => (
                <ProductCard data={item} key={id} />
            ))}
        </HomeSection>
    );
};