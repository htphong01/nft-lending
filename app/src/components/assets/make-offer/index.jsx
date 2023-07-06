/* eslint-disable react/prop-types */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import ReactLoading from 'react-loading';
import { getOffersByOrder } from '@src/api/offer.api';
import { calculateRepayment } from '@src/utils/apr';
import { sliceAddress } from '@src/utils/misc';
import Table from './table';
import Form from './form';
import styles from './styles.module.scss';

export default function MakeOffer({ item }) {
  const { hash } = useParams();
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency);

  const [offerList, setOfferList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const calculateRealPrice = (price) => {
    return price + (price * rate) / 1e7;
  };

  const fetchOffers = async () => {
    try {
      console.log('fetching');
      const { data } = await getOffersByOrder(hash);
      setOfferList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles['make-offer']}>
        <div className={styles.section}>
          <div>
            <div className={styles['real-price']}>
              Real price:{' '}
              <b>
                {calculateRealPrice(item.offer * 1.2)} {currency}
              </b>
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
            <div className={styles.value}>{item.offer} {currency}</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Duration: </div>
            <div className={styles.value}>{item.duration} days</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Repayment: </div>
            <div className={styles.value}>
              {calculateRepayment(item.offer, item.rate, item.duration)} {currency}
            </div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>APR: </div>
            <div className={styles.value}>{item.rate}%</div>
          </div>
          <div className={styles.info}>
            <div className={styles.label}>Float price: </div>
            <div className={styles.value}>
              {item.floorPrice} {currency}
            </div>
          </div>
        </div>
        <div className={styles.section}>
          <Form order={item} fetchOffers={fetchOffers} />
        </div>
      </div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers received" data={offerList} creator={item.creator} />
      )}
    </div>
  );
}
