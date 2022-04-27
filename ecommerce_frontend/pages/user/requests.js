import React, { useState, useContext, useEffect } from "react";
import { MyContext } from "../../components/customContext.js";
import { customNotifier } from "../../components/customNotifier.js";
import { RequestCard } from "../../components/generics.js";
import Layout from "../../components/layout";
import withAuth from "../../components/withAuth.js";
import { errorHandler } from "../../lib/errorHandler.js";
import { requestCartQuery } from "../../lib/graphQueries.js";
import { client, getClientHeaders } from "../../lib/network.js";
import styles from "../../styles/singleProductStyle.module.scss";

function Requests() {

    const [requests, setRequest] = useState([]);
    const [fetching, setFetching] = useState(true);

    const {state:{tokenData}} = useContext(MyContext);

    useEffect(() => {
        fetchRequest();
    }, []);

    const fetchRequest = async () => {
        const res = await client.query({
            query: requestCartQuery,
            context: getClientHeaders(tokenData.access)
        }).catch(e => customNotifier({
            type: "error",
            content: errorHandler(e)
        }));
        if (res){
            res.data;
            setRequest(res.data.requestCarts);
            setFetching(false);
        }
    };

    if (fetching){
        return <div />
    }

    return (
        <Layout hideFooter>
            <br />
            <div>
                {requests.map((item, key) => <RequestCard data={item} key={key} />)}
            </div>
        </Layout>
    );
};

export default withAuth(Requests);