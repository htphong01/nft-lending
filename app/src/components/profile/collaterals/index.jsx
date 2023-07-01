import { useEffect, useState } from "react";
import { getNFTs } from "@src/constants/example-data";
import Card from "@src/components/common/card";
import ListCollateralForm from "@src/components/common/list-collateral-form";
import { COLLATERAL_FORM_TYPE } from "@src/constants";
import styles from "./styles.module.scss";

export default function Assets() {
  const [listNFT, setListNFT] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState();

  const fetchNFTs = async () => {
    try {
      const nfts = await getNFTs();
      setListNFT(nfts);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    // fetchNFTs();
  }, []);

  return (
    <div className={styles.container}>
      {selectedNFT && (
        <ListCollateralForm
          item={selectedNFT}
          onClose={setSelectedNFT}
          type={COLLATERAL_FORM_TYPE.VIEW}
        />
      )}
      <div className={styles.heading}>Your assets</div>
      {listNFT.length > 0 ? (
        <div className={styles["list-nfts"]}>
          {listNFT.map((item, index) => (
            <Card
              key={index}
              item={item}
              action={{ text: "View collateral", handle: setSelectedNFT }}
            />
          ))}
        </div>
      ) : (
        <div className={styles["no-data"]}>
          <span>No data</span>
        </div>
      )}
    </div>
  );
}
