"use client";

import { FC, useState } from "react";
import Image from "next/image";
import { isMobileDevice, canUseNavigatorShare } from "../utils/detectMobile";
import styles from "../styles/shareButton.module.css";

type ShareButtonProps = {
  shareData: {
    url: string;
    title: string;
  };
};

const ShareButton: FC<ShareButtonProps> = ({ shareData }) => {
  const modifiedUrl = `https://web.furrl.in/productDetail?id=${shareData.url}&ref=vibeResults_HomeHunts`;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLinkCopied, setIsLinkCopied] = useState(false);
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);

    setIsLinkCopied(false); 
  };

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(modifiedUrl)
      .then(() => {
        setIsLinkCopied(true); 
        setTimeout(() => setIsLinkCopied(false), 2000); 
      })
      .catch((err) => {

      });
  };

  const handleShare = async () => {
    const sharedData: ShareData = {
      url: modifiedUrl,
      title: shareData.title,
    };

    if (canUseNavigatorShare() && isMobileDevice()) {
      try {
        await navigator.share(sharedData);
      } catch (err) {
        console.log("error", err);
      }
    } else {
      openModal();
    }
  };

  return (
    <div className={styles.container}>
      <button onClick={handleShare} className={styles.shareButton}>
        <Image
          src="/images/arrow-up-from-bracket-solid_white.svg"
          height={24}
          width={24}
          alt="Share Icon"
        />
      </button>

      {isModalOpen && (
        <div className={styles.modal}>
          <div className={styles.modalContent}>
            <button onClick={closeModal} className={styles.closeButton}>
              <Image
                src="/images/xmark-solid.svg"
                height={24}
                width={24}
                alt="Close Icon"
              />
            </button>
            <h2>Share this Product</h2>
            <button
              onClick={copyToClipboard}
              className={styles.copyButton}
              title="Copy Link"
            >
              {isLinkCopied ? "Link copied!" : (
                <Image
                  src="/images/link-solid.svg"
                  height={24}
                  width={24}
                  alt="Copy Link Icon"
                />
              )}
            </button>

            <div className={styles.shareLinks}>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  modifiedUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Facebook"
              >
                <Image
                  src="/images/facebook.svg"
                  height={24}
                  width={24}
                  alt="Facebook Icon"
                />
              </a>
              <a
                href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(
                  modifiedUrl
                )}&text=${encodeURIComponent(shareData.title)}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Twitter"
              >
                <Image
                  src="/images/x-twitter.svg"
                  height={24}
                  width={24}
                  alt="Twitter Icon"
                />
              </a>
              <a
                href={`mailto:?subject=${encodeURIComponent(
                  shareData.title
                )}&body=${encodeURIComponent(
                  shareData.title + " " + modifiedUrl
                )}`}
                title="Email"
              >
                <Image
                  src="/images/envelope-regular.svg"
                  height={24}
                  width={24}
                  alt="Email Icon"
                />
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                  shareData.title + " " + modifiedUrl
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="WhatsApp"
              >
                <Image
                  src="/images/whatsapp.svg"
                  height={24}
                  width={24}
                  alt="WhatsApp Icon"
                />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShareButton;
