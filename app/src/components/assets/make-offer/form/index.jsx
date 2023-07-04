import { useState } from 'react';
import { calculateAPR, calculateRepayment } from '@src/utils/apr';
import styles from '../styles.module.scss';

export default function Form() {
  const [data, setData] = useState({
    currency: 'XCR',
    amount: 0,
    duration: 0,
    repayment: 0,
    apr: 0,
  });

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    if (['amount', 'duration', 'repayment'].includes(e.target.name)) {
      newData.apr = calculateAPR(newData.amount, newData.repayment, newData.duration);
    } else {
      newData.repayment = calculateRepayment(newData.amount, newData.apr, newData.duration);
    }

    setData(newData);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.title}>Make offer</div>
      {/* <div className={styles.section}>
        <div className={styles.head}>
          Amount:{' '}
          <span>
            {data.amount} {data.currency}
          </span>
        </div>
        <div className={styles.details}>
          <label className={styles.input}>
            <input type="number" value={data.amount} name="amount" onChange={handleChange} checked={true} />
          </label>
        </div>
      </div>
      <div className={styles.section}>
        <div className={styles.head}>
          Loan duration: <span>{data.duration} days</span>
        </div>
        <div className={styles.details}>
          <label className={styles.input}>
            <input type="number" value={data.duration} name="duration" onChange={handleChange} />
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
          <label className={styles.input}>
            <input
              className={styles['repayment-input']}
              type="number"
              value={data.repayment}
              name="repayment"
              onChange={handleChange}
            />
            <input className={styles['apr-input']} type="number" value={data.apr} name="apr" onChange={handleChange} />
            <div className={styles['percent-label']}>%</div>
          </label>
        </div>
      </div> */}
      
      <div className={styles.section}>
        <div className={styles.head}>
          Amount:{' '}
          <span>
            {data.amount} {data.currency}
          </span>
        </div>
        <div className={styles.details}>
          <div className={styles.label}>What loan amount are you offering?</div>
          <label className={styles.input}>
            <input
              type="number"
              value={data.amount}
              name="amount"
              onChange={handleChange}
              checked={true}
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
            />
            <input
              className={styles['apr-input']}
              type="number"
              value={data.apr}
              name="apr"
              onChange={handleChange}
            />
            <div className={styles['percent-label']}>%</div>
          </label>
        </div>
      </div>
      <div className={styles['button-wrap']}>
        <button type="submit">Make offer</button>
      </div>
    </form>
  );
}
