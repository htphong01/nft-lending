import { useSelector } from 'react-redux';
import Stake from './stake';
import Information from './information';
import Account from './account';
import styles from './styles.module.scss';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';
import stakerIcon from '@src/assets/staker-icon.svg';
import aprIcon from '@src/assets/apr-icon.svg';

export default function Pool() {
  const currency = useSelector((state) => state.account.currency);
  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <div className={styles.heading}>
          <img src={cvcScanIcon} alt="CVCScan" />
          <div className={styles.content}>
            <div className={styles.note}>Lending Pool</div>
            <div className={styles.title}>Stake your {currency}</div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles['section-item']}>
              <Information title="Total stakers" value="100 Holders" icon={stakerIcon} />
            </div>
            <div className={styles['section-item']}>
              <Information title="Pool balance" value={`1255.24 ${currency}`} icon={aprIcon} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles['section-item']}>
              <Stake currency={currency} />
            </div>
            <div className={styles['section-item']}>
              <Account currency={currency} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
