import { useState } from "react";
import styles from "./styles.module.scss";

export default function ListCollateralForm() {
  const [data, setData] = useState({
    currency: "XCR",
    amount: 0,
    duration: 0,
    repayment: 0,
    apr: 0,
  });

  const handleChange = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("data", data);
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.title}>List Collateral</div>
        <div className={styles["sub-title"]}>Proposed loan agreement</div>
        <div className={styles.section}>
          <div className={styles.head}>
            The loan must be in <span>{data.currency}</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>
              Which currency are you offering this loan in?
            </div>
            <label className={styles.input}>
              <input
                type="radio"
                value={data.currency}
                name="currency"
                onChange={handleChange}
                checked={true}
              />
              <span>{data.currency}</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Amount:{" "}
            <span>
              {data.amount} {data.currency}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>
              What loan amount are you offering?
            </div>
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
            <div className={styles.label}>
              What loan duration are you offering?
            </div>
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
            Repayment:{" "}
            <span>
              {data.repayment} {data.currency} ({data.apr}% APR)
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What APR are you offering?</div>
            <label className={styles.input}>
              <input
                className={styles["repayment-input"]}
                type="number"
                value={data.repayment}
                name="repayment"
                onChange={handleChange}
              />
              <input
                className={styles["apr-input"]}
                type="number"
                value={data.apr}
                name="apr"
                onChange={handleChange}
              />
              <div className={styles["percent-label"]}>%</div>
            </label>
          </div>
        </div>
        <div className={styles['button-wrap']}>
        <button type="button">Cancel</button>
        <button type="submit">List Collateral</button>
        </div>
      </form>
    </div>
  );
}
