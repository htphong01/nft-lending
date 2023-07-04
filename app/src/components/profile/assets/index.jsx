import { useEffect, useState } from 'react';
import ReactLoading from 'react-loading';
import { getNFTs } from '@src/constants/example-data';
import Card from '@src/components/common/card';
import ListCollateralForm from '@src/components/common/list-collateral-form';
import { COLLATERAL_FORM_TYPE } from '@src/constants';
import styles from './styles.module.scss';

export default function Assets() {
  const [isLoading, setIsLoading] = useState(true);
  const [listNFT, setListNFT] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState();

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
      {selectedNFT && (
        <ListCollateralForm item={selectedNFT} onClose={setSelectedNFT} type={COLLATERAL_FORM_TYPE.EDIT} />
      )}
      <div className={styles.heading}>Your assets</div>
      {isLoading ? (
        <div className="react-loading-item">
          <ReactLoading type="bars" color="#fff" height={100} width={120} />
        </div>
      ) : listNFT.length > 0 ? (
        <div className={styles['list-nfts']}>
          {listNFT.map((item, index) => (
            <Card key={index} item={item} action={{ text: 'List collateral', handle: setSelectedNFT }} />
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
