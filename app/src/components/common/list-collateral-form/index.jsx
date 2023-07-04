import { useState, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';
import { calculateAPR, calculateRepayment } from '@src/utils/apr';
import { COLLATERAL_FORM_TYPE } from '@src/constants';
import styles from './styles.module.scss';

export default function ListCollateralForm({ item, onClose, type }) {
  const ref = useRef(null);

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
    if (type === COLLATERAL_FORM_TYPE.VIEW) {
      console.log('Remove');
    } else {
      console.log('submit', data);
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
            The loan must be in <span>{data.currency}</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>Which currency are you offering this loan in?</div>
            <label className={styles.input}>
              <input
                type="radio"
                value={data.currency}
                name="currency"
                onChange={handleChange}
                checked={true}
                readOnly={type === COLLATERAL_FORM_TYPE.VIEW}
              />
              <span>{data.currency}</span>
            </label>
          </div>
        </div>
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
