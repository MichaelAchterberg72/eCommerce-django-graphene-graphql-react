import { ApolloClient, InMemoryCache } from '@apollo/client';
import { createUploadLink } from "apollo-upload-client";
import cookie from "js-cookie";
import nextCookie from "next-cookies";
import { expiredToken, isLogin, setUser, token } from "./dataVariables.js";
import { errorHandler } from './errorHandler.js';
import Router from "next/router";
import { getAccessMutation } from './graphQueries.js';

const url = "http://127.0.0.1:8000/graphql/";

const link = createUploadLink({uri:url})

export const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
});

export const setAuthCookie = (authObj) => {
    cookie.set(token, JSON.stringify(authObj));
};

export const setIsLoginCookie = (status) => {
  cookie.set(isLogin, JSON.stringify(status));
};

export const parseCookie = (ctx) => {
  return nextCookie(ctx);
};

export const removeCookie = (name) => {
    cookie.remove(name);
};

export const getClientHeaders = (access) => {
    return {
        headers: {
          AUTHORIZATION: `JWT ${access}`
        }, 
      };
};

export const getActiveToken = () => {
  return JSON.parse(cookie.get(token));
};

export const getNewToken = async (e, refresh) => {
    const errorContent = errorHandler(e);
    if(errorContent === expiredToken) {
        const newAccess = await client.mutate({
            mutation: getAccessMutation,
            variables: {refresh }
          }).catch(e => removeCookie(token));
    
          if(newAccess){
            const accessToken = newAccess.data.getAccess.access;
            setAuthCookie({access: accessToken, refresh: refresh});
            return accessToken
          }
          return null;
    }
    return null;
};

export const handleRouting = (path) => {
  Router.push(path)
};

export const logout = (dispatch) => {
  cookie.remove(token);
  cookie.remove(isLogin);
  dispatch({type:setUser, payload: {}})
};