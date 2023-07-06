/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { getOffersByCreator } from '@src/api/offer.api';
import OfferView from '@src/components/common/offer-view';
import Table from './table';
import styles from './styles.module.scss';

export default function Offers() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState();

  const handleViewOffer = (offer) => {
    setSelectedOffer(offer);
  };

  const fetchNFTs = async () => {
    try {
      const { data } = await getOffersByCreator(account.address);
      setOfferList(data);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedOffer && <OfferView item={selectedOffer} onClose={setSelectedOffer} />}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers sent" data={offerList} action={{ text: 'View', handle: handleViewOffer }} />
      )}
    </div>
  );
}
