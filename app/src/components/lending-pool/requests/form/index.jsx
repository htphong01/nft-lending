/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from 'react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import { calculateRepayment } from '@src/utils/apr';
import { sliceAddress, calculateRealPrice } from '@src/utils/misc';
import styles from '../styles.module.scss';

const VOTE_RESULT = {
  accepted: 87,
  rejected: 34,
};

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function Form({ item, onClose }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency);

  const calculatePercentVote = (accepted, rejected) => {
    const total = accepted + rejected;
    return {
      accepted: ((accepted * 100) / total).toFixed(2),
      rejected: ((rejected * 100) / total).toFixed(2),
    };
  };

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles['form-container']}>
      <div className={styles.form} ref={ref}>
        <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={() => onClose()} />
        <div className={styles.row}>
          <div className={styles.section}>
            <img src={item.metadata.image} alt="NFT Image" />
          </div>
          <div className={styles.section}>
            <div className={styles.info}>
              <div className={styles.label}>Name: </div>
              <div className={styles.value}>{item.metadata.name}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Collection: </div>
              <div className={styles.value}>{item.metadata.collection}</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Address: </div>
              <div className={styles.value}>
                <span>{sliceAddress(item.nftAddress)}</span>
                <Link to={`${CVC_SCAN}/address/${item.nftAddress}`} target="_blank">
                  <Icon icon="uil:edit" />
                </Link>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Borrower: </div>
              <div className={styles.value}>
                <span>{sliceAddress(item.creator)}</span>
                <Link to={`${CVC_SCAN}/address/${item.creator}`} target="_blank">
                  <Icon icon="uil:edit" />
                </Link>
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Amount: </div>
              <div className={styles.value}>
                {item.offer} {currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Duration: </div>
              <div className={styles.value}>{item.duration} days</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Repayment: </div>
              <div className={styles.value}>
                {calculateRepayment(item.offer, item.rate, item.duration)} {currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>APR: </div>
              <div className={styles.value}>{item.rate}%</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Float price: </div>
              <div className={styles.value}>
                {item.floorPrice} {currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Oracle price: </div>
              <div className={styles.value}>
                {calculateRealPrice(item.offer * 1.2, rate, 1e7)} {currency}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <div
              className={`${styles.chart} ${styles['chart-accept']}`}
              style={{
                width: `${calculatePercentVote(VOTE_RESULT.accepted, VOTE_RESULT.rejected).accepted}%`,
              }}
            >
              {VOTE_RESULT.accepted}
            </div>
            <div
              className={`${styles.chart} ${styles['chart-reject']}`}
              style={{
                width: `${calculatePercentVote(VOTE_RESULT.accepted, VOTE_RESULT.rejected).rejected}%`,
              }}
            >
              {VOTE_RESULT.rejected}
            </div>
          </div>
          <div className={`${styles.section} ${styles['section-btn']} `}>
            <button className={styles['accept-btn']}>Accept</button>
            <button className={styles['reject-btn']}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
