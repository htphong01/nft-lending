/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { sliceHeadTail, setNFTPermits } from '@src/utils';
import styles from './styles.module.scss';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function Table() {
  const data = [];
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCollection, setSelectedCollection] = useState({});

  const handleSetNFTsPermitted = async (collections, isPermitted) => {
    setIsLoading(true);
    try {
      // const tx = await setNFTPermits(collections, isPermitted);
      // await tx.wait();
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    if (e.target.checked) {
      setSelectedCollection({
        ...selectedCollection,
        [e.target.value]: true,
      });
    } else {
      const newCollection = selectedCollection;
      delete newCollection[e.target.value];
      setSelectedCollection(newCollection);
    }
  };

  const fetchCollections = async () => {
    setIsLoading(false);
  };

  useEffect(() => {
    fetchCollections();
  }, []);

  return (
    <div className={styles.table}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <div className={styles.heading}>Collections</div>
      <div className={styles['table-list']}>
        <div className={styles['table-list-item']}>#</div>
        <div className={styles['table-list-item']}>Collection</div>
        <div className={styles['table-list-item']}>From</div>
        <div className={styles['table-list-item']}>Usage</div>
        <div className={styles['table-list-item']}>Status</div>
        <div className={styles['table-list-item']}>Action</div>
      </div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div className={styles['table-list']} key={index}>
            <div className={styles['table-list-item']}>
              <input type="checkbox" name="collection" value={item.collection} onChange={handleChange} />
            </div>
            <div className={styles['table-list-item']}>
              <Link to={`${CVC_SCAN}/address/${item.collection}`} target="_blank">
                {sliceHeadTail(item.collection, 8)}
              </Link>
            </div>
            <div className={styles['table-list-item']}>
              <Link to={`${CVC_SCAN}/address/${item.from}`} target="_blank">
                {sliceHeadTail(item.from, 8)}
              </Link>
            </div>
            <div className={styles['table-list-item']}>{item.usage}</div>
            <div className={styles['table-list-item']}>{item.isApproved ? 'APPROVED' : 'UNAPPROVED'}</div>
            <div className={styles['table-list-item']}>
              <button onClick={() => handleSetNFTsPermitted([item.collection], !item.isApproved)}>
                {item.isApproved ? 'Remove approval' : 'Approve'}
              </button>
            </div>
          </div>
        ))
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
