import { useEffect, useState } from "react";
import { getNFTs } from "@src/constants/example-data";
import Card from "./card";
import styles from "./styles.module.scss";

export default function Assets() {
  const [listNFT, setListNFT] = useState([]);

  const fetchNFTs = async () => {
    try {
      const nfts = await getNFTs();
      setListNFT(nfts);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchNFTs();
  }, []);
  return (
    <div className={styles.container}>
      <div className={styles.heading}>Your assets</div>
      {listNFT.length > 0 ? <div className={styles["list-nfts"]}>
        {listNFT.map((item, index) => (
          <Card key={index} item={item} />
        ))}
      </div> : <div className={styles['no-data']}>
          <span>No data</span>
      </div>}
      
    </div>
  );
}
