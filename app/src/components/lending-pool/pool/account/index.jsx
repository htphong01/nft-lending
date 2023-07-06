import styles from './styles.module.scss';

export default function Account({ currency }) {
  return (
    <div className={styles.account}>
      <div className={styles['balance-block']}>
        <div className={styles.title}>My Balance</div>
        <div className={styles.balance}>100 {currency}</div>
        <div className={styles.money}>$11</div>
      </div>

      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Withdraw value</div>
          <div className={styles.value}>125.2 {currency}</div>
          <button>Withdraw</button>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Bonus rewards</div>
          <div className={styles.value}>25.2 {currency}</div>
          <button>Claim</button>
        </div>
      </div>
    </div>
  );
}
