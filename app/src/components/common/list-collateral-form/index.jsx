/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { ethers } from 'ethers';
import { useOnClickOutside } from 'usehooks-ts';
import { calculateAPR, calculateRepayment } from '@src/utils/apr';
import { generateSignature } from '@src/utils/ethers';
import { COLLATERAL_FORM_TYPE, NFT_CONTRACT_ADDRESS } from '@src/constants';
import { ORDER_TYPE_SIGNATURE } from '@src/constants/signature';
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
        console.log('Remove');
      } else {
        const order = {
          creator: account.address,
          nftAddress: NFT_CONTRACT_ADDRESS,
          nftTokenId: item.metadata.edition,
          offer: ethers.utils.parseUnits(data.offer, 18),
          duration: data.duration,
          rate: data.apr * 1e4 / 100,
        };
        const signature = await generateSignature(order, { Order: ORDER_TYPE_SIGNATURE });
        console.log(signature)
      }
    } catch (error) {
      console.log('error', error);
    }
  };

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>{type === COLLATERAL_FORM_TYPE.VIEW ? 'View' : 'List'} Collateral</div>
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
                  readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
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
                  readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>Lending Pool</span>
              </label>
            </div>
          </div>
        </div>
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
