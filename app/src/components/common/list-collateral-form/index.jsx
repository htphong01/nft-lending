/* eslint-disable react/prop-types */
import { useState, useRef, useEffect } from 'react';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { useOnClickOutside } from 'usehooks-ts';
import { Link } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import { createOrder } from '@src/api/order.api';
import { generateSignature } from '@src/utils/ethers';
import { calculateAPR, calculateRepayment } from '@src/utils/apr';
import { COLLATERAL_FORM_TYPE, NFT_CONTRACT_ADDRESS } from '@src/constants';
import styles from './styles.module.scss';

export default function ListCollateralForm({ item, onClose, type }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  const [data, setData] = useState({
    currency: 'XCR',
    offer: 0,
    duration: 0,
    repayment: 0,
    apr: 0,
    borrowFrom: 'user',
  });

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    if (['offer', 'duration', 'repayment'].includes(e.target.name)) {
      newData.apr = calculateAPR(newData.offer, newData.repayment, newData.duration);
    } else if (e.target.name === 'apr') {
      newData.repayment = calculateRepayment(newData.offer, newData.apr, newData.duration);
    }

    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (type === COLLATERAL_FORM_TYPE.VIEW) {
        console.log('item', item);
      } else {
        if (Object.values(data).includes(0)) return;
        const order = {
          creator: account.address,
          nftAddress: NFT_CONTRACT_ADDRESS,
          nftTokenId: item.edition,
          offer: ethers.utils.parseUnits(data.offer, 18).toString(),
          duration: data.duration,
          rate: (data.apr * 1e4) / 100,
          doesBorrowUser: data.borrowFrom === 'user',
        };
        const signature = await generateSignature(order);
        order.signature = signature;
        order.metadata = item;
        await createOrder(order);
        toast.success('List collateral successfully!');
        setTimeout(() => {
          onClose();
        }, 1000);
      }
    } catch (error) {
      toast.error('An error has been occurred!');
      console.log('error', error);
    }
  };

  useOnClickOutside(ref, () => onClose());

  useEffect(() => {
    if (type === COLLATERAL_FORM_TYPE.VIEW) {
      setData({
        currency: 'XCR',
        offer: ethers.utils.formatUnits(item.offer, 18),
        duration: item.duration,
        repayment: calculateRepayment(ethers.utils.formatUnits(item.offer), (item.rate * 100) / 1e4, item.duration),
        apr: (item.rate * 100) / 1e4,
        borrowFrom: item.doesBorrowUser ? 'user' : 'pool',
      });
    }
  }, []);

  console.log(item);
  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>
          <span>{type === COLLATERAL_FORM_TYPE.VIEW ? 'View' : 'List'} Collateral</span>
          {type === COLLATERAL_FORM_TYPE.VIEW && item.doesBorrowUser && (
            <Link to={`/assets/${item.hash}`}>
              <Icon icon="uil:edit" />
            </Link>
          )}
        </div>
        <div className={styles['sub-title']}>Proposed loan agreement</div>
        <div className={styles.section}>
          <div className={styles.head}>
            Amount:{' '}
            <span>
              {data.offer} {data.currency}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What loan offer are you offering?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.offer}
                name="offer"
                onChange={handleChange}
                checked={true}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
              />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Loan duration: <span>{data.duration} days</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What loan duration are you offering?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.duration}
                name="duration"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
              />
              <span>days</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Repayment:{' '}
            <span>
              {data.repayment} {data.currency} ({data.apr}% APR)
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What APR are you offering?</div>
            <label className={styles.input}>
              <input
                className={styles['repayment-input']}
                type="number"
                value={data.repayment}
                name="repayment"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
              />
              <input
                className={styles['apr-input']}
                type="number"
                value={data.apr}
                name="apr"
                onChange={handleChange}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
              />
              <div className={styles['percent-label']}>%</div>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Lender: <span>{data.borrowFrom === 'user' ? 'User' : 'Lending Pool'}</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>Where do you want to borrow from ?</div>
            <div className={styles.select}>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="user"
                  name="borrowFrom"
                  onChange={handleChange}
                  checked={data.borrowFrom === 'user'}
                  disabled={data.borrowFrom !== 'user' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>User</span>
              </label>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="pool"
                  name="borrowFrom"
                  onChange={handleChange}
                  checked={data.borrowFrom === 'pool'}
                  disabled={data.borrowFrom !== 'pool' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>Lending Pool</span>
              </label>
            </div>
          </div>
        </div>
        {type === COLLATERAL_FORM_TYPE.VIEW && !item.doesBorrowUser && (
          <div className={styles.section}>
            <div className={styles.head}>
              Voting Result: {' '}
              <span>
                (87 Accepted & 34 Rejected)
              </span>
            </div>
            <div className={styles.details}>
            </div>
          </div>
        )}
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => onClose()}>
            Close
          </button>
          <button type="submit">{type === COLLATERAL_FORM_TYPE.VIEW ? 'Unlist' : 'List'} Collateral</button>
        </div>
      </form>
    </div>
  );
}
