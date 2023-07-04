/* eslint-disable react/prop-types */
import { Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import styles from './styles.module.scss';

export default function Header({ item }) {
  const account = useSelector((state) => state.account);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.left}>
          <h1>{item.metadata.collection}</h1>
          <div className={styles.description}>{item.metadata.name}</div>
        </div>
        <div className={styles.right}>
          {/* <div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Balance:</div>
              <div>{account.balance} XCR</div>
            </div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Borrow:</div>
              <div>0</div>
            </div>
            <div className={styles['right-item']}>
              <div className={styles['right-item-left']}>Lend:</div>
              <div>0</div>
            </div>
          </div> */}
        </div>
      </div>
      <Outlet />
    </div>
  );
}
