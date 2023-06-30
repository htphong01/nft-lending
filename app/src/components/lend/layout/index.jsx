import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { LEND_TABS } from "@src/constants";
import styles from "./styles.module.scss";

export default function LendHeader() {
  const account = useSelector((state) => state.account);
  const { pathname } = useLocation();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.left}>
          <h1>Give a loan</h1>
          <div className={styles.description}>Offer loans to other users on their non-fungible tokens.</div>
        </div>
        <div className={styles.right}>
          <div>
            <div className={styles["right-item"]}>
              <div className={styles["right-item-left"]}>Balance:</div>
              <div>{account.balance} XCR</div>
            </div>
            <div className={styles["right-item"]}>
              <div className={styles["right-item-left"]}>Borrow:</div>
              <div>0</div>
            </div>
            <div className={styles["right-item"]}>
              <div className={styles["right-item-left"]}>Lend:</div>
              <div>0</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tabs}>
        {LEND_TABS.map((tab, index) => (
          <Link
            key={index}
            className={`${styles["tab-item"]} ${
              pathname === tab.url ? styles.active : ""
            }`}
            to={tab.url}
          >
            {tab.text}
          </Link>
        ))}
      </div>
      <Outlet />
    </div>
  );
}
