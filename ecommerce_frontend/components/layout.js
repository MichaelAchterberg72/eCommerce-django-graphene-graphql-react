import Head from 'next/head'
import styles from "../styles/layout.module.scss"
import Router from "next/router";
import Dropdown from "kodobe-react-dropdown";
import { useState, useEffect, useContext, useRef } from "react";
import { logout } from '../lib/network';
import { MyContext } from './customContext';
import { setSearch } from '../lib/dataVariables';

export default function Layout({ children, hideFooter }) {

  const [mounted, setMounted] = useState(false);
  const searchInput = useRef("");
  const debounceTimeout = useRef();
  const { state:{userInfo, search}, dispatch } = useContext(MyContext);

  const {router} = Router;

  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (router.pathname === "/search") {
      searchInput.current.focus();
    }
  }, [router && router.pathname]);

  const routeToPage = (page) => {
      switch(page){
          case "home":
            Router.push("/");
            break;
          case "register":
            Router.push("/register");
            break;
          case "cart":
            Router.push("/cart");
            break;
          case "addProduct":
            Router.push("/user/add-product");
            break;
          default:
            Router.push("/login");
      }
  };

  const dropHandler = (e) => {
    switch(e){
      case "dashboard":
        Router.push("/user/dashboard");
        break;
      case "products":
        Router.push("/user/products");
        break;
      case "requests":
        Router.push("/user/requests");
        break;
      case "logout":
        setTimeout(() => logout(dispatch), 500);
        break;
      default:
        return;
  }
  };

  const handleSearchClick = () => {
    if ( router.pathname !== "/search"){
      Router.push("/search");
    }
  };

  const handleSearchChange = (e) => {
    clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(
      () => dispatch({type:setSearch, payload: e.target.value}), 
      1500
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
        <div className={ 'logo ${styles.logo}' } onClick={() => routeToPage('home')}>ECOMMERCE</div>
        <div className={styles.searchContainer} onClick={handleSearchClick}>
          <img src="./search.png" />
          <input 
            ref={searchInput} 
            name="search" 
            type="text" 
            onChange={handleSearchChange}
            placeholder="Search" 
          />
        </div>
        <div className={styles.rightItem}>
          {
            userInfo && userInfo.id ? (
              <>
              {userInfo.userBusiness && <button onClick={() => routeToPage("addProduct")}>Add Product</button>}
              {
                mounted && (
                  <Dropdown 
                    title={<img src="/user.png" alt="userImage"/>} 
                    options={[
                      {title:"Dashboard", value:"dashboard"},
                      {title:"Products", value:"products"},
                      {title:"Requests", value:"requests"},
                      {title:"Logout", value:"logout"}
                    ]} 
                    onChange={dropHandler}
                    direction="right" 
                    maxWidth={200}
                  />
                )}
            
              <div className={styles.cartHolder} onClick={() => routeToPage("cart")}>
                <img src="/cart.png" alt="userCart"/>
                <div className={styles.cartItem}>
                  {userInfo.userCarts.length}
                </div>
              </div>
            </>
            ) : (
              <>
                <a onClick={routeToPage}>Login</a>
                <a onClick={() => routeToPage('register')}>Register</a>
              </>
            )}
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {children}
        </div>
      </div>
      {
        !hideFooter &&
        
        <div className={styles.footer}>
        <div className={styles.footerInner}>
          <div className={styles.footerItems}>
            <h3>LET US HELP YOU</h3>
            <li>Help Center</li>
            <li>How to know on eCommerce</li>
            <li>Delivery options and timelines</li>
            <li>How to return products</li>
            <li>Corporate and bulk purchases</li>
            <li>Report a Product</li>
          </div>
          <div className={styles.footerItems}>
            <h3>ABOUT ECOMMERCE</h3>
            <li>About us</li>
            <li>Terms and Conditions</li>
            <li>Privacy Policy</li>
          </div>
          <div className={styles.footerItems}>
            <h3>CONNECT WITH US</h3>
            <div className={styles.socialGroup}>
              <img src="/socialGroup/facebook.png" alt="" />
              <img src="/socialGroup/twitter.png" alt="" />
              <img src="/socialGroup/instagram.png" alt="" />
              <img src="/socialGroup/youtube.png" alt="" />
            </div>
          </div>
          <div className={styles.footerItems}>
            <div className={styles.footerLogo}>
              ECOMMERCE
            </div>
            <div className={styles.footerCopywrite}>
              &copy; 2022, All Rights Reserved
            </div>
          </div>
        </div>
      </div>
        }
      
    </div>
  </div>
  )
}