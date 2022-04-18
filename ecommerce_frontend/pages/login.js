import React, { useState, useContext } from "react";
import AuthComponent from "../components/authComponent.js";
import { client, parseCookie, setAuthCookie } from "../lib/network.js";
import { LoginMutation } from "../lib/graphQueries.js";
import { errorHandler } from "../lib/errorHandler.js";
import { customNotifier } from "../components/customNotifier.js";
import Router, { useRouter } from "next/router";
import { isLogin, setUser } from "../lib/dataVariables.js";
import { MyContext } from "../components/customContext.js";

const Login = () => {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const {dispatch} = useContext(MyContext);

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
            const { access, refresh, user } = result.data.loginUser;

            dispatch({ type:setUser, payload:user });

            setAuthCookie({ access, refresh });
            const redirect = router.query["redirect"];
            let url = "/";
            if(redirect){
                url = redirect
            }
            Router.push(url)
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

export const getServerSideProps = async (ctx) => {
    const isLoginState = parseCookie(ctx)[isLogin];
    if (isLoginState) {
        const {query} = ctx;
        const redirect = query["redirect"];
        let url = "/";
        if(redirect){
            url = redirect
        }
        return {
            redirect: {
                destination: url,
            }
        }
    }
    return {
        props: {},
    };
};

export default Login;