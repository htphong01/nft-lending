/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import toast, { Toaster } from 'react-hot-toast';
import { sliceAddress, calculateRepayment, acceptOffer } from '@src/utils';
import styles from './styles.module.scss';
import { ethers } from 'ethers';

export default function Table({ title, data, creator }) {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(false);

  const handleAccept = async (item) => {
    try {
      setIsLoading(true);
      console.log('item', item);

      const payment = item.offer + (item.offer * item.rate) / 100;

      const offer = {
        principalAmount: ethers.utils.parseUnits(item.offer, 18),
        maximumRepaymentAmount: ethers.utils.parseUnits(payment, 18),
        nftCollateralId: item.nftTokenId,
        nftCollateralContract: item.nftAddress,
        duration: item.duration * 24 * 60 * 60,
        adminFeeInBasisPoints: item.adminFeeInBasisPoints,
        erc20Denomination: item.erc20Denomination,
      };

      const signature = item.signature;

      const tx = await acceptOffer(offer, signature);
      await tx.wait();

      setIsLoading(false);
      toast.success('Accept offer successfully');
    } catch (error) {
      console.log('error', error);
      toast.error('An error has been occurred!');
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.table}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.heading}>{title}</div>
      <div className={styles['table-list']}>
        <div className={styles['table-list-item']}>Lender</div>
        <div className={styles['table-list-item']}>Loan value</div>
        <div className={styles['table-list-item']}>Repayment</div>
        <div className={styles['table-list-item']}>Duration</div>
        <div className={styles['table-list-item']}>APR</div>
        <div className={styles['table-list-item']}>Float price</div>
        <div className={styles['table-list-item']}>Created At</div>
        <div className={styles['table-list-item']}>Expiration</div>
        <div className={styles['table-list-item']}>Action</div>
      </div>
      {data && data.length > 0 ? (
        data.map((item, index) => (
          <div className={styles['table-list']} key={index}>
            <div className={styles['table-list-item']}>{sliceAddress(item.creator)}</div>
            <div className={styles['table-list-item']}>
              {item.offer} {account.currency}
            </div>
            <div className={styles['table-list-item']}>
              {calculateRepayment(item.offer, item.rate, item.duration)} {account.currency}
            </div>
            <div className={styles['table-list-item']}>{item.duration} days</div>
            <div className={styles['table-list-item']}>{item.rate} %</div>
            <div className={styles['table-list-item']}>
              {item.floorPrice} {account.currency}
            </div>

            <div className={styles['table-list-item']}>{new Date(item.createdAt).toLocaleDateString()}</div>
            <div className={styles['table-list-item']}>{item.expiration} days</div>
            <div className={styles['table-list-item']}>
              {account.address.toLowerCase() != creator.toLowerCase() ? (
                '#'
              ) : (
                <button onClick={() => handleAccept(item)}>Accept</button>
              )}
            </div>
          </div>
        ))
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
