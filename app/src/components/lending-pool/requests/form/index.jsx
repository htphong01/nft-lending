/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef } from "react";
import { useOnClickOutside } from "usehooks-ts";
import { Icon } from "@iconify/react";
import styles from "../styles.module.scss";

const VOTE_RESULT = {
  accepted: 87,
  rejected: 34,
};

export default function Form({ item, onClose }) {
  const ref = useRef(null);

  const data = Object.entries(item).filter(
    (element) => element[0] !== "status" && element[0] !== "metadata"
  );

  const sliceAddress = (address) => {
    return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
  };

  const calculatePercentVote = (accepted, rejected) => {
    const total = accepted + rejected;
    return {
      accepted: ((accepted * 100) / total).toFixed(2),
      rejected: ((rejected * 100) / total).toFixed(2),
    };
  };

  console.log(
    calculatePercentVote(VOTE_RESULT.accepted, VOTE_RESULT.rejected).accepted
  );

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles["form-container"]}>
      <div className={styles.form} ref={ref}>
        <Icon
          icon="material-symbols:close"
          className={styles["close-btn"]}
          onClick={() => onClose()}
        />
        <div className={styles.row}>
          <div className={styles.section}>
            <img src={item.metadata.image} alt="NFT Image" />
          </div>
          <div className={styles.section}>
            {data.map((element, index) => (
              <div className={styles.info} key={index}>
                <div className={styles.label}>
                  {element[0].charAt(0).toUpperCase() + element[0].slice(1)}:{" "}
                </div>
                <div className={styles.value}>
                  {element[0] === "borrower"
                    ? sliceAddress(element[1])
                    : element[1]}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className={styles.row}>
          <div className={styles.section}>
            <div
              className={`${styles.chart} ${styles["chart-accept"]}`}
              style={{
                width: `${
                  calculatePercentVote(
                    VOTE_RESULT.accepted,
                    VOTE_RESULT.rejected
                  ).accepted
                }%`,
              }}
            >{VOTE_RESULT.accepted}</div>
            <div
              className={`${styles.chart} ${styles["chart-reject"]}`}
              style={{
                width: `${
                  calculatePercentVote(
                    VOTE_RESULT.accepted,
                    VOTE_RESULT.rejected
                  ).rejected
                }%`,
              }}
            >{VOTE_RESULT.rejected}</div>
          </div>
          <div className={`${styles.section} ${styles["section-btn"]} `}>
            <button className={styles["accept-btn"]}>Accept</button>
            <button className={styles["reject-btn"]}>Reject</button>
          </div>
        </div>
      </div>
    </div>
  );
}
