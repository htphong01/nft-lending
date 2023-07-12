import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ethers } from 'ethers';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import { setAccount } from '@src/redux/features/accountSlice';
import { stake, unstake, getTotalBalanceOfUser, getStakedPerUser, getPoolBalance } from '@src/utils/contracts/lending-pool';
import { checkAllowance, approveERC20, getBalance } from '@src/utils/contracts/erc20';
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

  const [balance, setBalance] = useState({
    pool: 0,
    stake: 0,
    total: 0,
    bonus: 0,
  });

  const fetchBalanceInfo = async () => {
    try {
      setIsLoading(true);
      const currentBalance = await getBalance(account.address);
      dispatch(setAccount({ balance: currentBalance }));

      const [totalBalance, totalStaked, poolBalance] = await Promise.all([
        getTotalBalanceOfUser(account.address),
        getStakedPerUser(account.address),
        getPoolBalance(),
      ]);

      setBalance({
        pool: poolBalance,
        stake: totalStaked,
        total: totalBalance,
        bonus: totalBalance - totalStaked,
      });
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleUnstake = async (amount) => {
    try {
      setIsLoading(true);
      const amountBN = ethers.utils.parseUnits('6', 18);
      const tx = await unstake(amountBN);
      await tx.wait();
      if (amount == balance.bonus) {
        toast.success(`Claim bonus successfully`);
      } else {
        toast.success(`Withdraw successfully`);
      }
      fetchBalanceInfo();
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const handleSubmitStake = async (e, amount) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const amountBN = ethers.utils.parseUnits(amount, 18);
      if (!(await checkAllowance(LENDING_POOL_ADDRESS, account.address, amountBN))) {
        const tx = await approveERC20(LENDING_POOL_ADDRESS, amountBN);
        await tx.wait();
      }

      const tx = await stake(amountBN);
      await tx.wait();
      toast.success(`Stake ${amount} wXCR successfully`);
      fetchBalanceInfo();
    } catch (error) {
      setIsLoading(false);
      toast.error('An error has been occurred!');
      console.log('stake error', error);
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
              <Information title="Total stakers" value="100+ Holders" icon={stakerIcon} />
            </div>
            <div className={styles['section-item']}>
              <Information title="Pool balance" value={`${balance.pool} ${account.currency}`} icon={aprIcon} />
            </div>
          </div>
          <div className={styles.row}>
            <div className={styles['section-item']}>
              <Stake currency={account.currency} handleSubmitStake={handleSubmitStake} />
            </div>
            <div className={styles['section-item']}>
              <Account currency={account.currency} balance={balance} handleUnstake={handleUnstake} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
