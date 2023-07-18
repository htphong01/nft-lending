import { useState } from 'react';
import { mintERC20, parseMetamaskError } from '@src/utils';
import toast, { Toaster } from 'react-hot-toast';
import styles from './styles.module.scss';

export default function WXCRFaucet() {
  const [address, setAddress] = useState('');

  const handleMintERC20 = async () => {
    try {
      await mintERC20(address);
      toast.success('Faucet 20 wXCR successfully');
    } catch (error) {
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  return (
    <div className={styles.container}>
      <Toaster position="top-center" reverseOrder={false} />

      <div className={styles.content}>
        <div className={styles.title}>wXCR FAUCET</div>
        <div className={styles.description}>Fast and reliable. 20 wXCR/day</div>
        <div className={styles['input-control']}>
          <input
            placeholder="Enter your wallet address (0x...)"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
          <button disabled={address === ''} onClick={handleMintERC20}>
            Send me wXCR
          </button>
        </div>
      </div>
    </div>
  );
}
