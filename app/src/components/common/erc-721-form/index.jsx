/* eslint-disable react/prop-types */
import { useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useOnClickOutside } from 'usehooks-ts';
import toast, { Toaster } from 'react-hot-toast';
import ReactLoading from 'react-loading';
import {
  mintERC721,
  createTokenBoundAccount,
  getTokenBoundAccount,
  ERC721Contract,
  parseMetamaskError,
} from '@src/utils';
import { DEFAULT_ERC6551_BASE_URI, TOKEN_BOUND_ACCOUNT_NFT_ADDRESS } from '@src/constants';
import { createTokenBoundAccount as createTokenBoundAccountApi } from '@src/api/token-bound-account.api';
import styles from './styles.module.scss';

export default function ERC6551Form({ onClose }) {
  const account = useSelector((state) => state.account);

  const ref = useRef(null);

  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    account: '',
    collectionAddress: '',
  });

  const handleChange = async (e) => {
    // eslint-disable-next-line no-unused-vars
    const { account, ...newData } = {
      ...data,
      [e.target.name]: String(e.target.value).toLowerCase(),
    };

    if (!Object.values(newData).includes('')) {
      try {
        const importedAccount = await getTokenBoundAccount(newData);
        newData.account = importedAccount;
      } catch (error) {
        console.log('error', error);
      }
    } else {
      newData.account = '';
    }

    setData(newData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const erc721Contract = await ERC721Contract(data.tokenAddress);
      const isOwnerOfTokenId =
        (await erc721Contract.ownerOf(data.tokenId)).toLowerCase() === account.address.toLowerCase();
      if (!isOwnerOfTokenId) {
        toast.error(`You are not owner of the Token ID: ${data.tokenId}`);
        setIsLoading(false);
        return;
      }
      await createTokenBoundAccountApi({ ...data, owner: account.address });
      toast.success('Import ERC-6551 Account successfully');
      setIsLoading(false);
      onClose(true);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      const txError = parseMetamaskError(error);
      toast.error(txError.context);
    }
  };

  useOnClickOutside(ref, () => onClose());

  return (
    <div className={styles.container}>
      {isLoading && (
        <div className="screen-loading-overlay">
          <ReactLoading type="spinningBubbles" color="#ffffff" height={60} width={60} />
        </div>
      )}
      <Toaster position="top-center" reverseOrder={false} />
      <form className={styles.form} onSubmit={handleSubmit} ref={ref}>
        <div className={styles.title}>Import your NFT Collection</div>
        <div className={styles['sub-title']}>Easier to make a loan with your NFTs</div>
        <div className={styles.section}>
          <div className={styles.head}>Your Account Address: xxxx</div>
          <div className={styles.details}>
            <div className={styles.label}>NFT Collection Address:</div>
            <label className={styles.input}>
              <input type="text" value={data.collectionAddress} name="collectionAddress" onChange={handleChange} required />
            </label>
          </div>
        </div>
        <div className={styles['button-wrap']}>
          <button type="button" onClick={() => onClose()}>
            Cancel
          </button>
          <button type="submit" className={styles['get-loan-btn']}>
            Import
          </button>
        </div>
      </form>
    </div>
  );
}
