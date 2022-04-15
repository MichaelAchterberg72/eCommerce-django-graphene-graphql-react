import React, { useContext } from "react";
import { isLogin } from "../lib/dataVariables.js";
import { parseCookie } from "../lib/network";
import Router from "next/router";

const withAuth = (AuthComponent) => {
    const Wrapper = (props) => {

        const {
            state:{userInfo, tokenData}, 
            dispatch,
        } = useContext(MyContext);

        return (
            <AuthComponent 
            userInfo={userInfo} 
            tokenData={tokenData} 
            dispatch={dispatch} 
            {...props} />
        );
    };

    Wrapper.getInitialProps = async (ctx) => {
        const isLoginState = parseCookie(ctx)[isLogin];
        if (!isLoginState) {
            const {req, res} = ctx;
            
            if (req){
                const url = `/login?redirect=${res.url}`;
                res.writeHead(301, {location: url})
                res.end()
            }
            else {
                const url = `/login?redirect=${document.location.pathname}`;
                Router.push(url);
            }
        }

        const appProps = {};
        if (AuthComponent.getInitialProps){
            appProps = await AuthComponent.getInitialProps(ctx);
        }

        return {...appProps};
    };

    return Wrapper;
};

export default withAuth;