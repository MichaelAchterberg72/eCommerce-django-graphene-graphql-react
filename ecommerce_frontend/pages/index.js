import Head from 'next/head';
import styles from "../styles/homeStyle.module.scss";
import Layout from "../components/layout.js";
import ProductComponent from '../components/productComponent';
import ProductCategories from '../components/productCategories';

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Ecommerce Home | Search</title>
      </Head>
      <ProductComponent title="LATEST ADDITION" tag="latest" />
      <ProductComponent title="POPULAR PRODUCTS" tag="popular" />
     
      <ProductCategories />
    </Layout>
  )
}



