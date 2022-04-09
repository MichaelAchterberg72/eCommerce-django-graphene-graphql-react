import React, {useState, useEffect} from "react";
import AuthComponent from "../components/authComponent.js";
import {client} from "../lib/network.js";
import {LoginMutation} from "../lib/graphQueries.js";
import { errorHandler } from "../lib/errorHandler.js";
import { customNotifier } from "../components/customNotifier.js";

const Login = () => {
    const [loading, setLoading] = useState(false);

    const submit = async (e, data) => {
        e.preventDefault();
        setLoading(true);
        const result = await client.mutate({
            mutation: LoginMutation,
            variables: data,
        })
        .catch((e) => 
        customNotifier({ type: "error", content: errorHandler(e) }));

        if (result) {
            console.log(result.data);
        } else {
            setLoading(false);
        }
    };

    return (
        <AuthComponent 
            title="Login" 
            content="Don't have an account yet?" 
            login 
            onSubmit={submit}
            loading={loading} />
    );
};

export default Login;