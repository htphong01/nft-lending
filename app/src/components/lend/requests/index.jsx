/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import ReactLoading from 'react-loading';
import { getOffers } from '@src/api/offer.api';
import { OfferStatus } from '@src/constants/enum';
import OfferView from '@src/components/common/offer-view';
import Table from '@src/components/common/request-table';
import styles from './styles.module.scss';
import { getRequests } from '../../../api/request.api';

export default function Requests() {
  const account = useSelector((state) => state.account);

  const [isLoading, setIsLoading] = useState(true);
  const [offerList, setOfferList] = useState([]);
  const [requests, setRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState([]);
  const [selectedOffer, setSelectedOffer] = useState();

  const handleCancelOffer = () => {};

  const fetchOffers = async () => {
    try {
      console.log('address: ', account.address);
      const { data } = await getOffers({ creator: account.address, status: OfferStatus.OPENING });
      const { data: requests } = await getRequests({ creator: account.address });
      console.log('Requests: ', requests);
      setOfferList(data);
      setRequests(requests);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, [account.address]);

  return (
    <div className={styles.container}>
      {selectedOffer && (
        <OfferView
          item={selectedOffer}
          onClose={setSelectedOffer}
          action={{ text: 'Cancel', handle: handleCancelOffer }}
        />
      )}
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : (
        <Table title="Offers sent" data={requests} action={{ text: 'View', handle: setSelectedRequest }} />
      )}
    </div>
  );
}
