import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { useNavigate } from 'react-router-dom';
import { getNFTs } from '@src/constants/example-data';
import Card from '@src/components/common/card';
import styles from './styles.module.scss';

export default function Assets() {
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [listNFT, setListNFT] = useState([]);

  const handleMakeOffer = (item) => {
    const contract = item.contract.address;
    const id = item.metadata.edition;
    navigate(`/assets/${contract}/${id}`);
  };

  const fetchNFTs = async () => {
    try {
      const nfts = await getNFTs();
      setListNFT(nfts);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log('error', error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Your assets</div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : listNFT.length > 0 ? (
        <div className={styles['list-nfts']}>
          {listNFT.map((item, index) => (
            <Card key={index} item={item} action={{ text: 'Make offer', handle: handleMakeOffer }} />
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
