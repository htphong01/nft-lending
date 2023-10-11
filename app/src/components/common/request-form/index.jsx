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
import toast, { Toaster } from 'react-hot-toast';
import { parseMetamaskError } from '../../../utils/convert';
import { renegotiateLoan } from '../../../utils/contracts/loan';
import { ethers } from 'ethers';
import { createRequest } from '../../../api/request.api';
import { convertRequestDataToSign } from '../../../utils/misc';
import { LOAN_ADDRESS, CHAIN_ID } from '../../../constants/contract';
import { generateRequestSignature } from '../../../utils/ethers';

const CVC_SCAN = import.meta.env.VITE_CVC_SCAN;

export default function RequestView({ item, onClose, type }) {
  const ref = useRef(null);
  const rate = useSelector((state) => state.rate.rate);
  const account = useSelector((state) => state.account);

  const [data, setData] = useState({
    duration: 0,
    value: 0,
    fee: 0,
    expiry: 0,
    currency: account.currency,
  });
  const [isLoading, setIsLoading] = useState(false);

  useOnClickOutside(ref, () => onClose());

  // const fetchOrder = async () => {
  //   try {
  //     const { data: order } = await getOrderByHash(item.order);
  //     setData({ ...data, order });
  //     setIsLoading(false);
  //   } catch (error) {
  //     setIsLoading(false);
  //     console.log('error', error);
  //   }
  // };

  const handleChange = (e) => {
    const newData = {
      ...data,
      [e.target.name]: e.target.value,
    };

    // if (['offer', 'duration', 'repayment'].includes(e.target.name)) {
    //   newData.apr = calculateAPR(newData.offer, newData.repayment, newData.duration);
    // } else if (e.target.name === 'apr') {
    //   newData.repayment = calculateRepayment(newData.offer, newData.apr, newData.duration);
    // }

    setData(newData);
  };

  const handleCreateRenegotiation = async () => {
    try {
      setIsLoading(true);
      const request = {
        creator: account.address,
        loanId: item.hash,
        loanDuration: data.duration,
        maxRepaymentAmount: data.value,
        renegotiateFee: data.fee,
        expiration: data.expiry,
        loanContract: LOAN_ADDRESS,
        chainId: CHAIN_ID,
        borrower: item.borrower,
        // signature: {
        //   signer: account.address,
        //   nonce,
        //   expiry,
        //   signature,
        // },
      };
      const { signatureData } = convertRequestDataToSign(request);
      const signature = await generateRequestSignature(request, signatureData);
      request.signature = {
        ...signatureData,
        signature,
      };

      await createRequest(request);
    } catch (error) {
      console.log(error);
      toast.error('An error has been occured!');
    } finally {
      setIsLoading(false);
      onClose(true);
    }
  };

  // useEffect(() => {
  //   fetchOrder();
  // }, []);

  useEffect(() => {
    console.log('Hash: ', item.hash);
  }, []);

  const handleSubmit = () => {};

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>
          {/* <span>{type === COLLATERAL_FORM_TYPE.VIEW ? 'View' : 'List'} Collateral</span>
          {type === COLLATERAL_FORM_TYPE.VIEW && item.lender === 'user' && (
            <Link to={`/assets/${item.hash}`}>
              <Icon icon="uil:edit" />
            </Link>
          )} */}
        </div>
        <div className={styles['sub-title']}>Loan renegotiation</div>
        {/* {!isPermittedNFT && (
          <div className={styles['error-text']}>This collection has not been permitted on this system.</div>
        )} */}
        <div className={styles.section}>
          <div className={styles.head}>
            Loan value:{' '}
            <span>
              {item.offer} {account.currency}
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What repayment value do you want to renegotiate?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.offer}
                name="value"
                onChange={handleChange}
                checked={true}
                readOnly={type === 'view'}
              />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          <div className={styles.head}>
            Loan duration: <span>{item.duration} days</span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What loan duration do you want to renegotiate?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.duration}
                name="duration"
                onChange={handleChange}
                readOnly={type === 'view'}
              />
              <span>days</span>
            </label>
          </div>
        </div>
        <div className={styles.section}>
          {/* <div className={styles.head}>
            Fee:{' '}
            <span>
              {data.fee} {data.currency}
            </span>
          </div> */}
          <div className={styles.details}>
            <div className={styles.label}>What renegotiation fee that you want to pay?</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.fee}
                name="fee"
                onChange={handleChange}
                checked={true}
                readOnly={type === 'view'}
              />
            </label>
          </div>
        </div>
        <div className={styles.section}>
          {/* <div className={styles.head}>
            Loan duration: <span>{data.duration} days</span>
          </div> */}
          <div className={styles.details}>
            <div className={styles.label}>The loan renegotiation will be expired in</div>
            <label className={styles.input}>
              <input
                type="number"
                value={data.expiry}
                name="expiry"
                onChange={handleChange}
                readOnly={type === 'view'}
              />
              <span>days</span>
            </label>
          </div>
        </div>
        {/* <div className={styles.section}>
          <div className={styles.head}>
            Repayment:{' '}
            <span>
              {data.repayment} {data.currency} ({data.apr}% APR)
            </span>
          </div>
          <div className={styles.details}>
            <div className={styles.label}>What APR are you offering?</div>
            <label className={styles.input}>
              <input
                className={styles['repayment-input']}
                type="number"
                value={data.repayment}
                name="repayment"
                // onChange={handleChange}
                // readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
              />
              <input
                className={styles['apr-input']}
                type="number"
                value={data.apr}
                name="apr"
                // onChange={handleChange}
                // readOnly={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}
              />
              <div className={styles['percent-label']}>%</div>
            </label>
          </div>
        </div> */}
        <div className={styles.section}>
          <div className={styles.head}>
            Lender: <span>{item.lender === 'user' ? 'User' : 'Lending Pool'}</span>
          </div>
          <div className={styles.details}>
            {/* <div className={styles.label}>Where do you want to borrow from ?</div>
            <div className={styles.select}>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="user"
                  name="lender"
                  // onChange={handleChange}
                  checked={data.lender === 'user'}
                  // disabled={data.lender !== 'user' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>User</span>
              </label>
              <label className={styles.input}>
                <input
                  type="radio"
                  value="pool"
                  name="lender"
                  // onChange={handleChange}
                  checked={data.lender === 'pool'}
                  // disabled={data.lender !== 'pool' && type === COLLATERAL_FORM_TYPE.VIEW}
                />
                <span>Lending Pool</span>
              </label>
            </div> */}
          </div>
        </div>
        {/* {type === COLLATERAL_FORM_TYPE.VIEW && item.lender === 'pool' && (
          <div className={styles.section}>
            <div className={styles.head}>
              Status: <span>{calculatePercentVote(item.vote.accepted, item.vote.total) >= 75 ? 'Accepted' : ''}</span>
              <span>{calculatePercentVote(item.vote.rejected, item.vote.total) > 25 ? 'Rejected' : ''}</span>
            </div>
            <div className={styles.details}>
              <span>
                {' '}
                {calculatePercentVote(item.vote.accepted, item.vote.total)}% Accepted -{' '}
                {calculatePercentVote(item.vote.rejected, item.vote.total)}% Rejected
              </span>
            </div>
          </div>
        )} */}
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => handleCreateRenegotiation()}>
            Submit
          </button>
          <button type="button" onClick={() => onClose()}>
            Close
          </button>

          {/* {item.lender === 'pool' ? (
            <button
              type="button"
              className={styles['get-loan-btn']}
              disabled={calculatePercentVote(item.vote.accepted, item.vote.total) < 75}
              onClick={handleGetLoan}
            >
              Get loan
            </button>
          ) : (
            <button type="submit" disabled={type === COLLATERAL_FORM_TYPE.VIEW || !isPermittedNFT}>
              {type === COLLATERAL_FORM_TYPE.VIEW ? 'Unlist' : 'List'} Collateral
            </button>
          )} */}
        </div>
      </form>
    </div>
  );
}
