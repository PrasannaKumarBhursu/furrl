"use client";


import { FC, useCallback, useEffect, useState } from "react";
import styles from "../styles/page.module.css";
import ShareButton from "./ShareButton";
import Spinner from "./uiAssests/Spinnner/Spinner";
import { useRouter } from 'next/navigation';
import { useProduct } from "./ContextState";
import FilterList from "./FilterList/FilterList";

type ProductListProps = {
  title: string;
};

const ProductList: FC<ProductListProps> = ({ title }) => {
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [bannerImage, setBannerImage] = useState("");
  const [errorInGetByName, setErrorInGetByName] = useState("");
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [totalProdcuts, setTotalProducts] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);

  const fetchProducts = useCallback(async (page: number) => {
    setLoading(true);
    const requestBody = {
      input: {
        page,
        pageSize: 10,
        filters: [],
        id: "#HomeHunts",
        entity: "vibe",
      },
    };

    try {
      const response = await fetch(
        "https://api.furrl.in/api/v2/listing/getListingProducts",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        setError("Network response was not ok");
        return;
      }

      const data = await response.json();
      if ("code" in data) {
        setError(data.message);
      } else {
        setProducts((prevProducts) => [
          ...prevProducts,
          ...data.data.getListingProducts.products,
        ]);
        {
          totalProdcuts === "" &&
            setTotalProducts(data.data.getListingProducts.totalProducts);
        }
        setError("");
      }
    } catch (error: any) {
      setError(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchName = useCallback(async () => {
    setLoading(true);
    const requestBody = {
      name: "#HomeHunts",
    };

    try {
      const response = await fetch(
        "https://api.furrl.in/api/v2/listing/getVibeByName",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      if (!response.ok) {
        setErrorInGetByName("Network response was not ok");
        return;
      }

      const data = await response.json();
      if ("code" in data) {
        setErrorInGetByName(data.message);
      } else {
        {
          bannerImage === "" &&
            setBannerImage(data.data.getVibeByName.imageUrl);
        }
        setErrorInGetByName("");
      }
    } catch (error: any) {
      setErrorInGetByName(error.message || "An unexpected error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchName();
    fetchProducts(page);
  }, [page, fetchProducts]);

  const handleScroll = useCallback(() => {
    const scrollPosition = window.innerHeight + document.documentElement.scrollTop;
    const totalHeight = document.documentElement.offsetHeight;
    const seventyPercentHeight = 0.9 * totalHeight;
    if (
      scrollPosition >= seventyPercentHeight && !loading
    ) {
      setPage((prevPage) => prevPage + 1);
    }
  }, [loading]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const fetchFilters = async () => {
      try {
        const requestBody = {
          id: "#HomeHunts",
          entity: "vibe",
        };
        const response = await fetch(
          "https://api.furrl.in/api/v2/listing/getListingFilters",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
          }
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const responseData = await response.json();
        const data = responseData?.["data"]?.["getListingFilters"]?.["easyFilters"]
        setFilteredData(data);
        setSelectedFilter(data[0].uniqueId)
      } catch (error) {
        console.error("Error fetching filters:", error);
      }


    };

    fetchFilters();
  }, []);

  const handleFilterClick = (uniqueId: any) => {
    setSelectedFilter(uniqueId);
  };

  const router = useRouter();

  const contextValue = useProduct();
  const { Product, setProduct } = contextValue;

  const redirectToProductDetail = (product: any) => {
    setProduct(product)
    if (typeof window !== 'undefined') {
      localStorage.setItem("selectedProduct", JSON.stringify(product));
    }
    
    
    router.push(`/productDetail?id=${product.id}`);

  }

  return (
    <div>
      <div>
        <img src={bannerImage} className={styles.bannerImage} alt="Banner Image" />

      </div>
      {products.length > 0 && (
        <div className={styles.productsCountTextContainer}>
          <p className={styles.productsCountTextContainerText}>Shop Products</p>
          <div className={styles.productsCountTextContainerDot}></div>
          <p
            className={
              styles.productsCountTextContainerCount
            }>{`${totalProdcuts} Products`}</p>
        </div>
      )}
      <div>

        <FilterList filters={filteredData} selectedFilter={selectedFilter} onFilterClick={handleFilterClick} />
      </div>
      <div className={styles.productsListContainer}>
        {products.map((each, index) => (
          <div
            key={index}
            className={`${styles.Productcontainer} ${(index - 2) % 5 === 0 ? "width-98" : "width-48"
              }`} onClick={() => redirectToProductDetail(each)}>
            <div
              style={{ backgroundImage: `url(${each.images[0].src})` }}
              className={`${styles.productImage} ${(index - 2) % 5 === 0 ? "height-300" : "height-181"
                }`}>
              <div onClick={(event) => event.stopPropagation()}>
                <ShareButton
                  shareData={{
                    url: each.id,
                    title: each.title,
                  }}
                />
              </div>
            </div>
            <div className={styles.productListContent}>
              <p className={styles.productListContentTitle}>
                {each.brand[0].name}
              </p>
              <p className={styles.productListContentName}>{each.title}</p>
              <div className={styles.productListContentPricingContainer}>
                {`Rs. ${each.price.value}`}
                <span
                  className={
                    styles.productListContentMRP
                  }>{`Rs. ${each.MRP.value}`}</span>
                <p
                  className={
                    styles.productListContentDiscount
                  }>{`${each.discountPercent}%`}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      {loading && <Spinner />}
      {error && <p>{error}</p>}
    </div>
  );
};

export default ProductList;
