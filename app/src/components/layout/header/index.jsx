import Link from 'next/link'
import styles from './styles.module.scss';

export default function Header() {
  return <div className={styles.header}>
    <Link href="/" className={styles.logo}>AvengersFI</Link>
    <div className={styles.menu}>
      <ul className={styles['menu-list']}>
        <li className={styles['menu-item']}>
          <Link href="#" className={styles['menu-item-link']}>Get a loan</Link>
          <ul className={styles['sub-menu']}>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Get a new loan</Link>
            </li>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Loans received</Link>
            </li>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Offers received</Link>
            </li>
          </ul>
        </li>
        <li className={styles['menu-item']}>
          <Link href="#" className={styles['menu-item-link']}>Give a loan</Link>
          <ul className={styles['sub-menu']}>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Give a new loan</Link>
            </li>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Loans given</Link>
            </li>
            <li className={styles['sub-menu-item']}>
              <Link href="#" className={styles['sub-menu-item-link']}>Offers sent</Link>
            </li>
          </ul>
        </li>
        <li className={styles['menu-item']}>
          <Link href="#" className={styles['menu-item-link']}>Lending pool</Link>
        </li>
      </ul>
    </div>

    <div className={styles.account}>
      <button>Connect Wallet</button>
    </div>
  </div>;
}
