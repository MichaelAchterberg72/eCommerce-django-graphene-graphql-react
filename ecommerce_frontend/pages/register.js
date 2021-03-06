import React, { useState, useContext } from "react";
import AuthComponent from "../components/authComponent.js";
import { client } from "../lib/network.js";
import { RegisterMutation } from "../lib/graphQueries.js";
import { errorHandler } from "../lib/errorHandler.js";
import { customNotifier } from "../components/customNotifier.js";
import Router from "next/router";
import { MyContext } from "../components/customContext.js";


const Register = () => {
    const [loading, setLoading] = useState(false);
    const [acceptedTerms, setAcceptedTerms] = useState(false);

    const { 
        state: { userInfo }, 
    } = useContext(MyContext);

    if(userInfo){
        Router.push("/");
    }

    const submit = async (e, data) => {
        e.preventDefault();

        if (data.password !== data.cpassword) {
            customNotifier({ type: "error", content: "Passwords do not match"});
            return;
        }
        setLoading(true);

        const result = await client.mutate({
            mutation: RegisterMutation,
            variables: data,
        })
        .catch((e) => 
            customNotifier({
                type: "error",
                content: errorHandler(e),
            }),
        );

        if(result){
            customNotifier({
                type: "success",
                content: result.data.registerUser.message,
            });
            Router.push("/login")
        }
        else {
            setLoading(false)
        }
    };

    return (
        <AuthComponent 
            title="Create Account" 
            content="Already have an account?"
            loading={loading}
            onSubmit={submit}
            acceptedTerms={acceptedTerms}
            setAcceptedTerms={setAcceptedTerms}
         />
    );
};

export default Register;