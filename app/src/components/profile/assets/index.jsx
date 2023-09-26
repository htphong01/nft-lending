/* eslint-disable react-hooks/exhaustive-deps */
import axios from 'axios';
import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useSelector } from 'react-redux';
import { getNfts } from '@src/api/nfts.api';
import { getTokenBoundAccountByOwner } from '@src/api/token-bound-account.api';
import Card from '@src/components/common/card';
import ListCollateralForm from '@src/components/common/list-collateral-form';
import ERC6551Form from '@src/components/common/erc-6551-form';
import TokenBoundAccountCard from '@src/components/common/token-bound-account-card';
import { COLLATERAL_FORM_TYPE, TOKEN_BOUND_ACCOUNT_NFT_ADDRESS } from '@src/constants';
import { ERC721Contract } from '@src/utils';
import styles from './styles.module.scss';

export default function Assets() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [listNFT, setListNFT] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState();
  const [isOpenERC6551, setIsOpenERC6551] = useState(false);
  const [selectedTokenBoundAccount, setSelectedTokenBoundAccount] = useState();

  const handleOnClose = (isRefetch = false) => {
    setSelectedNFT();
    setSelectedTokenBoundAccount();
    setIsOpenERC6551(false);
    if (isRefetch) fetchNFTs();
  };

  const fetchNFTs = async () => {
    try {
      const { data } = await getNfts({
        owner: account.address,
        isAvailable: true,
      });
      const tbaNFt = await fetchTokenBoundAccount();
      if (tbaNFt) {
        data.push(...tbaNFt);
      }
      setListNFT(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  const fetchTokenBoundAccount = async () => {
    if (account.address) {
      const { data } = await getTokenBoundAccountByOwner(account.address);
      const erc6551Accounts = [];
      for (let i = 0; i < data.length; i++) {
        const erc721 = ERC721Contract(data[i].tokenAddress);
        const isOwnTBA = (await erc721.ownerOf(data[i].tokenId)).toLowerCase() === account.address.toLowerCase();
        if (isOwnTBA) {
          const obj = {
            collectionAddress: data[i].tokenAddress,
            collectionName: erc721.name(),
            collectionSymbol: erc721.symbol(),
            isAvailable: true,
            metadata: { isTokenBoundAccount: true, edition: data[i].tokenId },
            owner: data[i].owner,
            tokenId: data[i].tokenId,
            tokenURI: '',
            tokenBoundAccount: data[i],
          };

          try {
            const tokenURI = await erc721.tokenURI(data[i].tokenId);
            const { data: tokenData } = await axios.get(tokenURI);
            obj.metadata = { ...tokenData, ...obj.metadata };
            obj.tokenURI = tokenURI;
          } catch (error) {
            console.log(error);
          }
          erc6551Accounts.push(obj);
        }
      }

      return erc6551Accounts;
    }

    return [];
  };

  useEffect(() => {
    fetchNFTs();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedNFT && (
        <ListCollateralForm item={selectedNFT} onClose={handleOnClose} type={COLLATERAL_FORM_TYPE.EDIT} />
      )}
      {isOpenERC6551 && <ERC6551Form onClose={handleOnClose} />}
      {selectedTokenBoundAccount && <TokenBoundAccountCard item={selectedTokenBoundAccount} onClose={handleOnClose} />}
      <div className={styles.heading}>
        <span>Your assets</span>
        <button onClick={() => setIsOpenERC6551(!isOpenERC6551)}>Import ERC-6551</button>
      </div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : listNFT.length > 0 ? (
        <div className={styles['list-nfts']}>
          {listNFT.map((item, index) => (
            <Card
              key={index}
              item={item.metadata}
              action={{ text: 'List collateral', handle: setSelectedNFT }}
              handleTokenBoundAccount={() => setSelectedTokenBoundAccount(item)}
            />
          ))}
        </div>
      ) : (
        <div className={styles['no-data']}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
