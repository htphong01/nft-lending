import { useState } from 'react';
import { useSelector } from 'react-redux';
import { InlineIcon } from '@iconify/react';
import styles from '../styles.module.scss';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';

export default function Stake({ currency }) {
  const account = useSelector((state) => state.account);

  const [amount, setAmount] = useState(0);

  const handleSubmitStake = (e) => {
    e.preventDefault();
    console.log('amount', amount);
  };

  return (
    <div className={styles.item}>
      <form className={styles.content} onSubmit={handleSubmitStake}>
        <div className={styles.header}>
          <span>Amount</span>
          <div className={styles.amount}>
            <InlineIcon icon="mdi:wallet-outline" fontSize={12} color="rgba(235, 235, 245, 0.5)" />
            <div>
              {account.balance} {currency}
            </div>
          </div>
        </div>
        <div className={styles['stake-input']}>
          <img src={cvcScanIcon} alt={currency} />
          <input
            type="number"
            value={amount}
            name="amount"
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            max={account.balance}
            required
          />
          <span>{currency}</span>
        </div>
        <button type="submit">Stake</button>
      </form>
    </div>
  );
}
