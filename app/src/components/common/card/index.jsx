/* eslint-disable react/prop-types */
import { useImageLoaded } from '@src/hooks/useImageLoaded';
import styles from './styles.module.scss';
import Skeleton from 'react-loading-skeleton';

export default function Card({ item, action: { text, handle } }) {
  const [ref, loaded, onLoad] = useImageLoaded();

  return (
    <div className={styles.card}>
      <div className={styles['image-wrap']}>
        <img
          ref={ref}
          src={item.metadata.image}
          style={{ display: loaded ? 'block' : 'none' }}
          onLoad={onLoad}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = 'https://www.chanchao.com.tw/images/default.jpg';
          }}
        />
        {!loaded && <Skeleton className={styles.skeleton} />}
        <div className={styles['make-collateral-wrap']}>
          <button onClick={() => handle(item)}>{text}</button>
        </div>
      </div>

      <div className={styles.collection}>{item.metadata.collection}</div>
      <div className={styles.name}>{item.metadata.name}</div>
    </div>
  );
}
