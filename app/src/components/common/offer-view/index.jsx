/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import { calculateRepayment } from '@src/utils/apr';
import { sliceAddress, calculateRealPrice } from '@src/utils/misc';
import { getOrderByHash } from '@src/api/order.api';
import styles from './styles.module.scss';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function OfferView({ item, onClose, action }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency);

  const [data, setData] = useState(item);
  const [isLoading, setIsLoading] = useState(true);

  useOnClickOutside(ref, () => onClose());

  const fetchOrder = async () => {
    try {
      const { data: order } = await getOrderByHash(item.order);
      setData({ ...data, order });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, []);

  return (
    <div className={styles['form-container']}>
      <div className={styles.form} ref={ref}>
        <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={() => onClose()} />
        {isLoading ? (
          <div className="react-loading-item mb-60 mt-60">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : (
          <>
            <div className={styles.row}>
              <div className={styles.section}>
                <img src={data.order.metadata.image} alt="NFT Image" />
              </div>
              <div className={styles.section}>
                <div className={styles.info}>
                  <div className={styles.label}>Name:</div>
                  <div className={styles.value}>
                    <span>{data.order.metadata.name}</span>
                    <Link to={`/assets/${data.order.hash}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Lender: </div>
                  <div className={styles.value}>
                    <span>{sliceAddress(data.creator)}</span>
                    <Link to={`${CVC_SCAN}/address/${data.creator}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Borrower: </div>
                  <div className={styles.value}>
                    <span>{sliceAddress(data.order.creator)}</span>
                    <Link to={`${CVC_SCAN}/address/${data.order.creator}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Amount: </div>
                  <div className={styles.value}>
                    {data.offer} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Duration: </div>
                  <div className={styles.value}>{data.duration} days</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Repayment: </div>
                  <div className={styles.value}>
                    {calculateRepayment(data.offer, data.rate, data.duration)} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>APR: </div>
                  <div className={styles.value}>{data.rate}%</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Float price: </div>
                  <div className={styles.value}>
                    {data.floorPrice} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Oracle price: </div>
                  <div className={styles.value}>
                    {calculateRealPrice(data.offer * 1.2, rate, 1e7)} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <button onClick={() => onClose()}>Close</button>
                  <button onClick={() => action.handle(data)}>{action.text}</button>
                </div>
              </div>
            </div>
            <div className={styles.row}>
              {/* <div className={styles.section}>
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
          </div> */}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
