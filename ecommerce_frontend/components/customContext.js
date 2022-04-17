import React, { useReducer } from "react";
import { setUser, setCategory } from "../lib/dataVariables.js";

export const MyContext = React.createContext({});

const myReducer = (state, action) => {
    const { type, payload } = action;
    switch (type){
        case setUser:
            return {
                ...state,
                userInfo: payload,
            };
        case setCategory:
            return {
                ...state,
                categories: payload,
            };
        default:
            console.log("No action type specified")
    }
};

const ContextComponent = ({ initialValue, children }) => {
    const [state, dispatch] = useReducer(myReducer, initialValue);

    return (
    <MyContext.Provider value={{ state, dispatch }}>
        {children}
    </MyContext.Provider>
    );
};

export default ContextComponent;