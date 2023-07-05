/* eslint-disable react/prop-types */
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import axios from 'axios';
import styles from './styles.module.scss';
import Skeleton from 'react-loading-skeleton';

export default function Card({ item, action: { text, handle } }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.card}>
      <div className={styles['image-wrap']}>
        <img ref={ref} src={item.image} style={{ display: loaded ? 'block' : 'none' }} onLoad={onLoad} />
        {!loaded && <Skeleton className={styles.skeleton} />}
        <div className={styles['make-collateral-wrap']}>
          <button onClick={() => handle(item)}>{text}</button>
        </div>
      </div>
      <div className={styles.collection}>{item.collection}</div>
      <div className={styles.name}>{item.name}</div>
    </div>
  );
}
