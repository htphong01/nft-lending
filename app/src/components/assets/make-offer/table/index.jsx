/* eslint-disable react/prop-types */
import styles from './styles.module.scss';

export default function Table({ title, data }) {
  const sliceAddress = (address) => {
    return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
  };

  return (
    <div className={styles.table}>
      <div className={styles.heading}>{title}</div>
      <div className={styles['table-list']}>
        <div className={styles['table-list-item']}>Loan value</div>
        <div className={styles['table-list-item']}>Interest</div>
        <div className={styles['table-list-item']}>APR</div>
        <div className={styles['table-list-item']}>Duration</div>
        <div className={styles['table-list-item']}>Repayment</div>
        <div className={styles['table-list-item']}>Lender</div>
      </div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div className={styles['table-list']} key={index}>
            <div className={styles['table-list-item']}>{item.loanValue}</div>
            <div className={styles['table-list-item']}>{item.interest}</div>
            <div className={styles['table-list-item']}>{item.apr}</div>
            <div className={styles['table-list-item']}>{item.duration}</div>
            <div className={styles['table-list-item']}>{item.repayment}</div>
            <div className={styles['table-list-item']}>{sliceAddress(item.lender)}</div>
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