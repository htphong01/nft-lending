/* eslint-disable react/prop-types */
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { calculateRepayment } from '@src/utils/apr';
import styles from './styles.module.scss';

export default function Table({ title, data, action }) {
  const currency = useSelector(state => state.account.currency);

  const sliceAddress = (address) => {
    return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
  };

  return (
    <div className={styles.table}>
      <div className={styles.heading}>{title}</div>
      <div className={styles['table-list']}>
        <div className={styles['table-list-item']}>Asset</div>
        <div className={styles['table-list-item']}>Name</div>
        <div className={styles['table-list-item']}>Status</div>
        <div className={styles['table-list-item']}>Lender</div>
        <div className={styles['table-list-item']}>Borrower</div>
        <div className={styles['table-list-item']}>Duration</div>
        <div className={styles['table-list-item']}>Created At</div>
        <div className={styles['table-list-item']}>Loan value</div>
        <div className={styles['table-list-item']}>Repayment</div>
        <div className={styles['table-list-item']}>APR</div>
        <div className={styles['table-list-item']}>Action</div>
      </div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div className={styles['table-list']} key={index}>
            <div className={styles['table-list-item']}>{item.metadata.collection}</div>
            <div className={styles['table-list-item']}>{item.metadata.name}</div>
            <div className={styles['table-list-item']}>{item.status}</div>
            <div className={styles['table-list-item']}>{item.doesBorrowUser ? sliceAddress(item.creator) : sliceAddress('Lending Pool')}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.creator)}</div>
            <div className={styles['table-list-item']}>{item.duration} days</div>
            <div className={styles['table-list-item']}>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div className={styles['table-list-item']}>{ethers.utils.formatUnits(item.offer, 18)} {currency}</div>
            <div className={styles['table-list-item']}>{calculateRepayment(ethers.utils.formatUnits(item.offer), item.rate * 100 / 1e4, item.duration)} {currency}</div>
            <div className={styles['table-list-item']}>{item.rate * 100 / 1e4}%</div>
            <div className={styles['table-list-item']}>
              {action ? <button onClick={() => action.handle(item)}>{action.text}</button> : '#'}
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
