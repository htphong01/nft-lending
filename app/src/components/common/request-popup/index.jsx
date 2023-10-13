/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useRef, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import ReactLoading from 'react-loading';
import { Icon } from '@iconify/react';
import { calculateRepayment, sliceAddress } from '@src/utils';
import { getOrderByHash } from '@src/api/order.api';
import styles from './styles.module.scss';
import RequestForm from '../request-form';
import { useCallback } from 'react';
import { updateRequest } from '../../../api/request.api';
import { toast } from 'react-hot-toast';
import { RequestStatus } from '../../../constants/enum';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function RequestPopup({ item, onClose }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const currency = useSelector((state) => state.account.currency);

  const [data, setData] = useState(item);
  const [isLoading, setIsLoading] = useState(false);

  // useOnClickOutside(ref, () => onClose());

  const handleAcceptRenegotiation = async () => {
    // @TODO: Call renegotiateLoan() contract
    console.log('Ahihi');
  };

  const handleRejectRenegotiation = async () => {
    try {
      setIsLoading(true);
      await updateRequest(item.hash, {
        status: RequestStatus.REJECTED,
      });
    } catch (error) {
      console.log(error);
      toast.error('An error has occured!');
    } finally {
      setIsLoading(false);
      onClose();
    }
  };

  return (
    <div className={styles['form-container']}>
      <div className={styles.form} ref={ref}>
        <Icon icon="material-symbols:close" className={styles['close-btn']} onClick={() => onClose()} />
        {isLoading ? (
          <div className="react-loading-item mb-60 mt-60">
            <ReactLoading type="bars" color="#fff" height={100} width={120} />
          </div>
        ) : (
          <>
            <div className={styles.title}>Renegotiation Loan</div>
            <div className={styles.row}>
              <div className={styles.section}>
                <img src={item.order.metadata.image} alt="NFT Image" />
              </div>
              <div className={styles.section}>
                <div className={styles.info}>
                  <div className={styles.label}>Name:</div>
                  <div className={styles.value}>
                    <span>{item.order.metadata.name}</span>
                    {!data.lender && (
                      <Link to={`/assets/${item.order.hash}`} target="_blank">
                        <Icon icon="uil:edit" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Lender: </div>
                  <div className={styles.value}>
                    <span>{item.order.lender ? 'Lending Pool' : sliceAddress(item.order.creator)}</span>
                    {!item.order.lender && (
                      <Link
                        to={`${data.lender ? 'lending-pool' : CVC_SCAN}/address/${item.order.creator}`}
                        target="_blank"
                      >
                        <Icon icon="uil:edit" />
                      </Link>
                    )}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Borrower: </div>
                  <div className={styles.value}>
                    <span>{sliceAddress(item.order.creator)}</span>
                    <Link to={`${CVC_SCAN}/address/${item.order.creator}`} target="_blank">
                      <Icon icon="uil:edit" />
                    </Link>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Amount: </div>
                  <div className={styles.value}>
                    {item.order.offer} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Duration: </div>
                  <div className={styles.value}>
                    <span>{item.order.duration} day(s)</span>
                    <Icon icon={'uil:arrow-right'} />
                    <span style={{ marginLeft: '12px' }}>
                      <b>
                        <u>{item.loanDuration} day(s)</u>
                      </b>
                    </span>
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Repayment: </div>
                  <div className={styles.value}>
                    {calculateRepayment(item.order.offer, item.order.rate, item.order.duration)} {currency}
                  </div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>APR: </div>
                  <div className={styles.value}>{item.order.rate}%</div>
                </div>
                <div className={styles.info}>
                  <div className={styles.label}>Float price: </div>
                  <div className={styles.value}>
                    {item.order.floorPrice} {currency}
                  </div>
                </div>
                {item.status === RequestStatus.OPENING && (
                  <div className={styles.info}>
                    <button onClick={() => handleRejectRenegotiation()}>Reject</button>
                    <button onClick={() => handleAcceptRenegotiation()}>Accept</button>
                  </div>
                )}
                <div className={styles.info}>
                  <div className={styles.label}>Reason: </div>
                  <div className={styles.value}>{item.reason}</div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
      {/* {isOpenRequest && <RequestForm item={data} onClose={handleOpenRequestForm} />} */}
    </div>
  );
}
