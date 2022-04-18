import React, { useState, useContext, useEffect } from "react";
import { setCategory } from "../lib/dataVariables";
import { getCategories } from "../lib/network";
import { MyContext } from "./customContext";
import { CategoryCard, HomeSection } from "./generics";


export default function ProductCategories() {

    const [categorys, setCategories] = useState([]);
    const [fetching, setFetching] = useState(true);
    const {state:{categories}, dispatch} = useContext(MyContext);

    useEffect(() => {
        if(categories){
            setCategories(categories);
            setFetching(false);
        }
        else {
            fetchCategories();
        }
    }, []);

    const fetchCategories = async () => {
        const res = await getCategories();

        if (res){
            setCategories(res);
            dispatch({type: setCategory, payload: res});
            setFetching(false);
        }
    };

    return (
        <HomeSection title="CATEGORIES" canShowAll onSholAll={() => alert()}>
        {fetching && categorys.map((item, id) => (
          <CategoryCard data={item} key={id} />
        ))}
      </HomeSection>
    );
};