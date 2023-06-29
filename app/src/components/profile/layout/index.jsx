import { Outlet, Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Icon } from "@iconify/react";
import cvcScanIcon from "@src/assets/cvcscan-icon.png";
import styles from "./styles.module.scss";

export default function ProfileHeader() {
  const account = useSelector((state) => state.account);
  const { pathname } = useLocation();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.left}>
          <h1>Account</h1>
          <div className={styles.address}>{account.address}</div>
          <div className={styles.social}>
            <a
              className={styles["social-item"]}
              href={`https://testnet.cvcscan.com/address/${account.address}`}
              rel="noreferrer"
              target="_blank"
            >
              <img src={cvcScanIcon} alt="CVCScan" />
              <span>CVCScan</span>
            </a>
            <a
              className={styles["social-item"]}
              href={`#`}
              rel="noreferrer"
              target="_blank"
            >
              <Icon icon="logos:twitter" fontSize={18} />
              <span>Twitter</span>
            </a>
            <a
              className={styles["social-item"]}
              href={`#`}
              rel="noreferrer"
              target="_blank"
            >
              <Icon icon="logos:facebook" fontSize={18} />
              <span>Facebook</span>
            </a>
          </div>
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
        <Link className={`${styles["tab-item"]} ${pathname === '/profile/history' ? styles.active : ""}`} to="/profile/history">
          Loans
        </Link>
        <Link className={`${styles["tab-item"]} ${pathname === '/profile/assets' ? styles.active : ""}`} to="/profile/assets">
          Assets
        </Link>
      </div>
      <Outlet />
    </div>
  );
}
