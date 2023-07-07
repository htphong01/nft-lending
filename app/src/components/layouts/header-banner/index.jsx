/* eslint-disable react/prop-types */
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Icon } from '@iconify/react';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';

export default function HeaderBanner({ title = '', description = '', tabs = [], right = true }) {
  const account = useSelector((state) => state.account);
  const { pathname } = useLocation();

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.left}>
          {pathname.startsWith('/profile') ? (
            <>
              <h1>Account</h1>
              <div className={styles.address}>{account.address}</div>
              <div className={styles.social}>
                <Link
                  className={styles['social-item']}
                  href={`https://testnet.cvcscan.com/address/${account.address}`}
                  rel="noreferrer"
                  target="_blank"
                >
                  <img src={cvcScanIcon} alt="CVCScan" />
                  <span>CVCScan</span>
                </Link>
                <Link className={styles['social-item']} href={`#`} rel="noreferrer" target="_blank">
                  <Icon icon="logos:twitter" fontSize={18} />
                  <span>Twitter</span>
                </Link>
                <Link className={styles['social-item']} href={`#`} rel="noreferrer" target="_blank">
                  <Icon icon="logos:facebook" fontSize={18} />
                  <span>Facebook</span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <h1>{title}</h1>
              <div className={styles.description}>{description}</div>
            </>
          )}
        </div>
        {right && (
          <div className={styles.right}>
            <div>
              <div className={styles['right-item']}>
                <div className={styles['right-item-left']}>Balance:</div>
                <div>
                  {account.balance} {account.currency}
                </div>
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
        )}
      </div>
      {tabs.length > 0 && (
        <div className={styles.tabs}>
          {tabs.map((tab, index) => (
            <Link
              key={index}
              className={`${styles['tab-item']} ${pathname === tab.url ? styles.active : ''}`}
              to={tab.url}
            >
              {tab.text}
            </Link>
          ))}
        </div>
      )}

      <Outlet />
    </div>
  );
}
