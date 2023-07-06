import { Outlet, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Icon } from '@iconify/react';
import { PROFILE_TABS } from '@src/constants';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';
import styles from './styles.module.scss';

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
              className={styles['social-item']}
              href={`https://testnet.cvcscan.com/address/${account.address}`}
              rel="noreferrer"
              target="_blank"
            >
              <img src={cvcScanIcon} alt="CVCScan" />
              <span>CVCScan</span>
            </a>
            <a className={styles['social-item']} href={`#`} rel="noreferrer" target="_blank">
              <Icon icon="logos:twitter" fontSize={18} />
              <span>Twitter</span>
            </a>
            <a className={styles['social-item']} href={`#`} rel="noreferrer" target="_blank">
              <Icon icon="logos:facebook" fontSize={18} />
              <span>Facebook</span>
            </a>
          </div>
        </div>
        <div className={styles.right}>
          <div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Balance:</div>
              <div>{account.balance} {account.currency}</div>
            </div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Borrow:</div>
              <div>0</div>
            </div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Lend:</div>
              <div>0</div>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.tabs}>
        {PROFILE_TABS.map((tab, index) => (
          <Link
            key={index}
            className={`${styles['tab-item']} ${pathname === tab.url ? styles.active : ''}`}
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
