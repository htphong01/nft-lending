import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { setAccount } from '@src/redux/features/accountSlice';
import {
  deposit,
  withdraw,
  claimReward,
  checkAllowance,
  approveERC20,
  getBalance,
  parseMetamaskError,
  getTotalStakers,
  getPoolBalance,
  getStakedByUser,
  getBonus,
} from '@src/utils';
import { LENDING_POOL_ADDRESS } from '@src/constants';
import Stake from './stake';
import Information from './information';
import Account from './account';
import styles from './styles.module.scss';
import cvcScanIcon from '@src/assets/cvcscan-icon.png';
import stakerIcon from '@src/assets/staker-icon.svg';
import aprIcon from '@src/assets/apr-icon.svg';

export default function Pool() {
  const dispatch = useDispatch();

  const account = useSelector((state) => state.account);
  const [isLoading, setIsLoading] = useState(true);

  const [poolStakers, setPoolStakers] = useState(0);

  const [balance, setBalance] = useState({
    pool: 0,
    staked: 0,
    balance: 0,
    bonus: 0,
  });

  const fetchBalanceInfo = async () => {
    try {
      setIsLoading(true);
      const [stakedByUser, poolBalance, bonus, totalPoolStakers] = await Promise.all([
        getStakedByUser(account.address),
        getPoolBalance(),
        getBonus(account.address),
        getTotalStakers(),
      ]);
      setBalance({
        ...balance,
        staked: stakedByUser,
        bonus: bonus,
        balance: Number(stakedByUser) + Number(bonus),
        pool: poolBalance,
      });
      const currentBalance = await getBalance(account.address);
      dispatch(setAccount({ balance: currentBalance }));

      setPoolStakers(totalPoolStakers);
      setIsLoading(false);
    } catch (error) {
      console.log('error', error);
      setIsLoading(false);
    }
  };

  const handleWithdraw = async (amount) => {
    try {
      setIsLoading(true);
      const amountBN = ethers.utils.parseUnits(amount, 18);
      const tx = await withdraw(amountBN);
      await tx.wait();

      fetchBalanceInfo();
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleClaimReward = async () => {
    try {
      setIsLoading(true);
      const tx = await claimReward();
      await tx.wait();
      toast.success(`Claim wXCR successfully`);
      fetchBalanceInfo();
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleStake = async (amount) => {
    try {
      setIsLoading(true);
      const amountBN = ethers.utils.parseUnits(amount, 18);
      if (!(await checkAllowance(account.address, amountBN, LENDING_POOL_ADDRESS))) {
        const tx = await approveERC20(amountBN, LENDING_POOL_ADDRESS);
        await tx.wait();
      }

      const tx = await deposit(amountBN);
      await tx.wait();
      toast.success(`Stake ${amount} wXCR successfully`);
      fetchBalanceInfo();
    } catch (error) {
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBalanceInfo();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <div className={styles.section}>
        <div className={styles.heading}>
          <img src={cvcScanIcon} alt="CVCScan" />
          <div className={styles.content}>
            <div className={styles.note}>Lending Pool</div>
            <div className={styles.title}>Stake your {account.currency}</div>
          </div>
        </div>
        <div className={styles.body}>
          <div className={styles.row}>
            <div className={styles['section-item']}>
              <Information
                title={`Stakers`}
                value={`${poolStakers} ${poolStakers === 1 ? 'staker' : 'stakers'}`}
                icon={stakerIcon}
              />
            </div>
            <div className={styles['section-item']}>
              <Information title="Pool balance" value={`${balance.pool} ${account.currency}`} icon={aprIcon} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles['section-item']}>
              <Stake currency={account.currency} handleStake={handleStake} />
            </div>
            <div className={styles['section-item']}>
              <Account
                currency={account.currency}
                balance={balance}
                handleClaimReward={handleClaimReward}
                handleWithdraw={handleWithdraw}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
