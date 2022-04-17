import "../styles/global.scss";
import { meQuery, getAccessMutation } from "../lib/graphQueries.js";
import { client, getClientHeaders, getNewToken, removeCookie, setAuthCookie, setIsLoginCookie, parseCookie } from "../lib/network";
import { token, expiredToken } from "../lib/dataVariables";
import { errorHandler } from "../lib/errorHandler";
import ContextComponent from "../components/customContext";
import App from "next/app";

function MyApp({ Component, pageProps, userData, token }) {
  return (
    <ContextComponent initialValue={{userInfo: userData, tokenData: token}}>
      <Component {...pageProps} />
    </ContextComponent>
    );
}

MyApp.getInitialProps = async (appContext) => {
  const { ctx } = appContext;
  const tokenData = parseCookie(ctx)[token];

  let result = null;

  const getUser = (access) => {
    return client.query({
      query: meQuery,
      context: getClientHeaders(access)
    });
  };

  if(tokenData && tokenData["access"]){
    try{
      result = await getUser(tokenData["access"]);
    }
    catch(e) {
      const newAccess = await getNewToken(e, tokenData["refresh"]);
      const errorContent = errorHandler(e);
      if(newAccess){
        result = await getUser(newAccess);
        tokenData["access"] = newAccess;
      }
    }
  }

  let userData = null;
  const appProps = await App.getInitialProps(appContext);

  if(result) {
    userData = result.data.me;
    setIsLoginCookie(true);
  }
  else {
    setIsLoginCookie(false)
  }

  return {
    ...appProps, 
    userData: userData,
    token: tokenData
  }
  
};

export default MyApp;
  