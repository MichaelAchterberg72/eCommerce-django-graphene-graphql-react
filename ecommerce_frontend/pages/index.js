import Head from 'next/head';
import styles from "../styles/homeStyle.module.scss";
import Layout from "../components/layout.js";
import { ProductCard, CategoryCard, HomeSection } from "../components/generics";

export default function Home() {
  return (
    <Layout>
      <Head>
        <title>Ecommerce Home | Search</title>
      </Head>
     <HomeSection title="LATEST ADDITION" canShowAll onSholAll={() => alert()}>
      {[0,0,0,0,0,0,0,0,0,0,0].map((item, id) => (
        <ProductCard key={id} />
      ))}
    </HomeSection>

    <HomeSection title="POPULAR PRODUCTS" canShowAll onSholAll={() => alert()}>
      {[0,0,0,0,0].map((item, id) => (
        <ProductCard key={id} />
      ))}
    </HomeSection>

    <HomeSection title="CATEGORIES" canShowAll onSholAll={() => alert()}>
      {[0,0,0,0,0,0,0,0].map((item, id) => (
        <CategoryCard key={id} />
      ))}
    </HomeSection>
    </Layout>
  )
}



