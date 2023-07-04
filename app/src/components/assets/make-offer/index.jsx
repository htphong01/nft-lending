/* eslint-disable react/prop-types */
import Form from './form';
import Table from './table';
import { OFFERS_RECEIVED } from '@src/constants/example-data';
import styles from './styles.module.scss';

export default function MakeOffer({ item }) {
  const data = Object.entries(item).filter((element) => element[0] !== 'lender' && element[0] !== 'metadata');

  const sliceAddress = (address) => {
    return `${address.slice(0, 5)} ... ${address.slice(-4)}`;
  };

  return (
    <div className={styles.container}>
      <div className={styles['make-offer']}>
        <div className={styles.section}>
          <div>
            <div className={styles['real-price']}>
              Real price: <b>13.25 XCR</b>
            </div>
            <div className={styles['real-price-source']}>Fetch price from Chainlink Oracle</div>
          </div>
          <img src={item.metadata.image} alt={item.metadata.name} />
        </div>
        <div className={styles.section}>
          <div className={styles['heading']}>
            Proposed offer from owner
          </div>
          {data.map((element, index) => (
            <div className={styles.info} key={index}>
              <div className={styles.label}>{element[0].charAt(0).toUpperCase() + element[0].slice(1)}: </div>
              <div className={styles.value}>{element[0] === 'borrower' ? sliceAddress(element[1]) : element[1]}</div>
            </div>
          ))}
        </div>
        <div className={styles.section}>
          <Form />
        </div>
      </div>
      <Table title="Offers received" data={OFFERS_RECEIVED} />
    </div>
  );
}
