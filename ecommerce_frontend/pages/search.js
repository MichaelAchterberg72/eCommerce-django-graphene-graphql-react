import React from 'react';
import styles from "../styles/generics.module.scss";
import Layout from "../components/layout.js";
import { ProductCard, CategoryCard } from "../components/generics";
import { MyContext } from '../components/customContext';
import { getProducts } from '../lib/network';
import Pagination from "kodobe-react-pagination";
import Dropdown from 'kodobe-react-dropdown';

export default function Search(){
    const [products, setProducts] = useState([]);
    const [fetching, setFetching] = useState(true);
    const [pageInformation, setPageInfo] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [sort, setSort] = useState("latest");
    const [sorted, setSorted] = useState({});
    const {state:{search, sortGlobal}} = useContext(MyContext);

    useEffetc(() => {
        if (sortGlobal) {
            handleDropChange(sortGlobal);
        }
        fetchProducts();
    }, [search, sorted]);

    const fetchProducts = async () => {
        const query = { ...sorted, search}
        const res = await getProducts(query);
        if (res) {
            const { results, pageInfo } = res;
            setProducts(results);
            setPageInfo(pageInfo);
            setFetching(false);
        }
    };

    const handleDropChange = e => {
        switch(e){
            case "latest":
                setSorted({sortBy:"created_at", isAsc:false});
                break;
            case "oldest":
                setSorted({sortBy:"created_at", isAsc:true});
                break;
            case "highest":
                setSorted({sortBy:"price", isAsc:false});
                break;
            case "lowest":
                setSorted({sortBy:"price", isAsc:true});
                break;
            default:
                return;
        }
        setSort(e);
    };

    if (fetching) {
        <div />;
    }

    return (
    <Layout hidefooter>
        <div className={styles.section}>
            <div className={styles.sectionHeading}>
                <div className={styles.title}>
                    {search && search !== "" && `RESULTS FOR ${search}:`} {pageInformation.size} ITEM(S) FOUND
                </div>
                <div className={styles.title}>
                    SORT BY: <Dropdown 
                        value={sort} 
                        direction="right"
                        maxWidth={200}
                        options={[
                            {title: "Latest", value: "latest"},
                            {title: "Oldest", value: "oldest"},
                            {title: "Highest Price", value: "highest"},
                            {title: "Lowest Price", value: "lowest"},
                        ]}
                        onChange={handleDropChange}
                        />
                    <span className={styles.link}>POPULARITY</span>
                </div>
            </div>
            <div className={styles.sectionBody}>
            {products.map((item, id) => (
                <ProductCard data={item} key={id} />
            ))}
            </div>
            <br />
            <br />
            <Pagination 
                totalPage={oageInformation.size} 
                currentPage={currentPage} 
                onChangePage={e => setSurrentPage(e)}
            />
        </div>
    </Layout>
    )
}