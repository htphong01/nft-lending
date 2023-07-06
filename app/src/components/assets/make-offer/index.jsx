/* eslint-disable react/prop-types */
import { ethers } from 'ethers';
import { useSelector } from 'react-redux';
import { calculateRepayment } from '@src/utils/apr';
import { OFFERS_RECEIVED } from '@src/constants/example-data';
import Form from './form';
import Table from './table';
import styles from './styles.module.scss';

export default function MakeOffer({ item }) {
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency)

  const sliceAddress = (address) => {
    return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
  };

  const calculateRealPrice = (price) => {
    const priceBN = ethers.BigNumber.from(`${price}`);
    const newPrice = priceBN.add(priceBN.mul(rate).div(1e7));
    return ethers.utils.formatUnits(newPrice);
  }

  return (
    <div className={styles.container}>
      <div className={styles['make-offer']}>
        <div className={styles.section}>
          <div>
            <div className={styles['real-price']}>
              Real price: <b>{calculateRealPrice(item.offer * 1.2)} {currency}</b>
            </div>
            <div className={styles['real-price-source']}>Fetch price from Oracle</div>
          </div>
          <img src={item.metadata.image} alt={item.metadata.name} />
        </div>
        <div className={styles.section}>
          <div className={styles['heading']}>Proposed offer from owner</div>
          <div className={styles.info}>
            <div className={styles.label}>Name: </div>
            <div className={styles.value}>{item.metadata.name}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Collection: </div>
            <div className={styles.value}>{sliceAddress(item.nftAddress)}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Borrower: </div>
            <div className={styles.value}>{sliceAddress(item.creator)}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Amount: </div>
            <div className={styles.value}>{ethers.utils.formatUnits(item.offer, 18)} {currency}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Duration: </div>
            <div className={styles.value}>{item.duration} days</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Repayment: </div>
            <div className={styles.value}>
              {calculateRepayment(ethers.utils.formatUnits(item.offer), (item.rate * 100) / 1e4, item.duration)} {currency}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>APR: </div>
            <div className={styles.value}>{(item.rate * 100) / 1e4}%</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Float price: </div>
            <div className={styles.value}>{Number(ethers.utils.formatUnits(`${item.floorPrice}`)).toFixed(2)} {currency}</div>
          </div>
        </div>
        <div className={styles.section}>
          <Form />
        </div>
      </div>
      <Table title="Offers received" data={OFFERS_RECEIVED} currency={currency} />
    </div>
  );
}
