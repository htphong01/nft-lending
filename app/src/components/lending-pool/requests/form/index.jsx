/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import { Icon } from '@iconify/react';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { calculateRepayment } from '@src/utils/apr';
import { generateSignature } from '@src/utils/ethers';
import { submitVote, getVote } from '@src/api/vote.api';
import { sliceAddress, calculateRealPrice } from '@src/utils/misc';
import styles from '../styles.module.scss';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function Form({ item, onClose }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const account = useSelector((state) => state.account);

  const [isAccepted, setIsAccepted] = useState();

  const calculatePercentVote = (input, total) => {
    return ((input * 100) / total).toFixed(2);
  };

  const handleSubmitVote = async (vote) => {
    if (isAccepted !== undefined) return;
    try {
      const voteData = {
        voter: account.address,
        orderHash: item.hash,
        isAccepted: vote,
      };

      const signature = await generateSignature(voteData);
      voteData.signature = signature;

      toast.promise(submitVote(voteData), {
        loading: 'Listing...',
        success: <b style={{ color: '#000' }}>Vote successfully!</b>,
        error: <b style={{ color: '#000' }}>An error has been occurred!</b>,
      });
      setIsAccepted(vote);
    } catch (error) {
      toast.error('An error has been occurred!');
    }
  };

  useOnClickOutside(ref, () => onClose());

  useEffect(() => {
    getVote({ voter: account.address, orderHash: item.hash }).then(({ data }) => {
      if (data.length > 0) {
        setIsAccepted(data[0].isAccepted);
      } else {
        setIsAccepted();
      }
    });
  }, [account.address]);

  return (
    <div className={styles['form-container']}>
      <Toaster position="top-center" reverseOrder={false} />

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
                {item.offer} {account.currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Duration: </div>
              <div className={styles.value}>{item.duration} days</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Repayment: </div>
              <div className={styles.value}>
                {calculateRepayment(item.offer, item.rate, item.duration)} {account.currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>APR: </div>
              <div className={styles.value}>{item.rate}%</div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Float price: </div>
              <div className={styles.value}>
                {item.floorPrice} {account.currency}
              </div>
            </div>
            <div className={styles.info}>
              <div className={styles.label}>Oracle price: </div>
              <div className={styles.value}>
                {calculateRealPrice(item.offer * 1.2, rate, 1e7)} {account.currency}
              </div>
            </div>
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <div
              className={`${styles.chart} ${styles['chart-accept']}`}
              style={{
                width: `${calculatePercentVote(item.vote.accepted, item.vote.total)}%`,
              }}
            >
              {calculatePercentVote(item.vote.accepted, item.vote.total)}%
            </div>
            <div
              className={`${styles.chart} ${styles['chart-reject']}`}
              style={{
                width: `${calculatePercentVote(item.vote.rejected, item.vote.total)}%`,
              }}
            >
              {calculatePercentVote(item.vote.rejected, item.vote.total)}%
            </div>
          </div>
          <div className={`${styles.section} ${styles['section-btn']} `}>
            <button
              className={styles['accept-btn']}
              disabled={isAccepted === false}
              onClick={() => handleSubmitVote(true)}
            >
              <span>
                {isAccepted === true ? 'You ' : ''} Accept{isAccepted === true ? 'ed' : ''}
              </span>
              {isAccepted === true && <Icon icon="material-symbols:check" />}
            </button>
            <button
              className={styles['reject-btn']}
              disabled={isAccepted === true}
              onClick={() => handleSubmitVote(false)}
            >
              <span>
                {isAccepted === false ? 'You ' : ''} Reject{isAccepted === false ? 'ed' : ''}
              </span>
              {isAccepted === false && <Icon icon="gridicons:cross" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
