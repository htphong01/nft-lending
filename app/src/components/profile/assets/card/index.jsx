/* eslint-disable react/prop-types */
import { useImageLoaded } from "@src/hooks/useImageLoaded";
import styles from "../styles.module.scss";
import Skeleton from "react-loading-skeleton";

export default function Card({ item }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.card}>
      <div className={styles["image-wrap"]}>
        <img
          ref={ref}
          src={item.metadata.image}
          onLoad={onLoad}
          style={{ display: loaded ? "block" : "none" }}
        />
        {!loaded && <Skeleton className={styles.skeleton} />}
        <div className={styles["make-collateral-wrap"]}>
          <button>List collateral</button>
        </div>
      </div>

      <div className={styles.collection}>{item.metadata.collection}</div>
      <div className={styles.name}>{item.metadata.name}</div>
    </div>
  );
}
