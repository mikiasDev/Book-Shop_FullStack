
import React from 'react';
import styles from './BookPageSkeleton.module.css';

const BookPageSkeleton = () => {
  return (
    <div className={styles.bookpageSkeleton} style={{ paddingTop: 80, minHeight: '100vh' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ marginBottom: 24 }}>
          <div className={`${styles.skeleton} ${styles.skeletonBtn}`} style={{ width: 100, height: 36, borderRadius: 8 }} />
        </div>
        <div className="row" style={{ display: 'flex', gap: 32 }}>
          <div className="col-md-5" style={{ flex: '0 0 35%', maxWidth: '35%' }}>
            <div className={`${styles.skeleton} ${styles.skeletonImg}`} style={{ width: '100%', height: 420, borderRadius: 12 }} />
          </div>
          <div className="col-md-4" style={{ flex: '0 0 32%', maxWidth: '32%' }}>
            <div className={`${styles.skeleton} ${styles.skeletonTitle}`} style={{ width: '80%', height: 32, borderRadius: 8 }} />
            <div className={`${styles.skeleton} ${styles.skeletonRating}`} style={{ width: 120, height: 20, borderRadius: 6 }} />
            <div className={`${styles.skeleton} ${styles.skeletonPrice}`} style={{ width: 80, height: 24, borderRadius: 6 }} />
            <div className={`${styles.skeleton} ${styles.skeletonDesc}`} style={{ width: '100%', height: 80, borderRadius: 8 }} />
          </div>
          <div className="col-md-3" style={{ flex: '0 0 25%', maxWidth: '25%' }}>
            <div className={`${styles.skeleton} ${styles.skeletonCard}`} style={{ width: '100%', height: 220, borderRadius: 12 }} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookPageSkeleton;
