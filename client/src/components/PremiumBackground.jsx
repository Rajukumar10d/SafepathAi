import React from 'react';
import styles from './PremiumBackground.module.css';

const PremiumBackground = () => {
  return (
    <div className={styles.backgroundContainer}>
      <div className={`${styles.blob} ${styles.blob1}`}></div>
      <div className={`${styles.blob} ${styles.blob2}`}></div>
      <div className={`${styles.blob} ${styles.blob3}`}></div>
      <div className={styles.gridOverlay}></div>
    </div>
  );
};

export default PremiumBackground;
