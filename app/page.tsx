import Image from "next/image";
import styles from "../styles/page.module.css";
import ProductList from "@/components/ProductList";
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.bgContainer}>
        <Navbar />
        <ProductList title={""} />
      </div>

    </main>
  );
}
