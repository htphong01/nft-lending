/* eslint-disable react/prop-types */
import styles from './styles.module.scss';

export default function Account({ currency, balance, handleUnstake }) {
  return (
    <div className={styles.account}>
      <div className={styles['balance-block']}>
        <div className={styles.title}>Staked</div>
        <div className={styles.balance}>
          {balance.stake} {currency}
        </div>
        <div className={styles.money}>${balance.stake * 0.11}</div>
      </div>

      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Withdraw value</div>
          <div className={styles.value}>
            {balance.total} {currency}
          </div>
          <button disabled={balance.total == 0} onClick={() => handleUnstake(balance.total)}>Withdraw</button>
        </div>
      </div>
      <div className={styles.block}>
        <div className={styles.content}>
          <div className={styles.label}>Bonus rewards</div>
          <div className={styles.value}>
            {balance.bonus} {currency}
          </div>
          <button disabled={balance.bonus == 0} onClick={() => handleUnstake(balance.bonus)}>Claim</button>
        </div>
      </div>
    </div>
  );
}
