import Head from 'next/head'
import styles from "../styles/layout.module.scss"
import Router from "next/router";

export default function Layout({ children, hideFooter }) {
  const routeToPage = (page) => {
      switch(page){
          case "home":
            Router.push("/");
            break;
          case "register":
            Router.push("/register");
            break;
          default:
            Router.push("/login");
      }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerInner}>
        <div className={ 'logo ${styles.logo}' } onClick={() => routeToPage('home')}>ECOMMERCE</div>
        <div className={styles.searchContainer}>
          <img src="./search.png" />
          <input name="search" type="text" placeholder="Search" />
        </div>
        <div className={styles.rightItem}>
          <a onClick={routeToPage}>Login</a>
          <a onClick={() => routeToPage('register')}>Register</a>
        </div>
      </div>
      <div className={styles.body}>
        <div className={styles.bodyInner}>
          {children}
        </div>
      </div>
      {/* {
        !hideFooter &&
      } */}
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
    </div>
  </div>
  )
}