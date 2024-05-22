'use client'

import { useState, useEffect } from 'react';
import styles from "./Image.module.css";

const ImageCarousel = ({ images }: any) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex(prevIndex => (prevIndex + 1) % images?.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [images?.length]);

  return (
    <div className={styles.imageContianer}>
      <img
        src={images[currentImageIndex].src}
        alt={images[currentImageIndex].title}
        className={styles.images}
      />

    </div>
  );
};

export default ImageCarousel;
