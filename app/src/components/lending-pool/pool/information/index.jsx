import styles from "../styles.module.scss";

export default function Information({ title, value, icon }) {
  return (
    <div className={`${styles.item} ${styles.information}`}>
      <div className={styles.content}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </div>
      <img src={icon} />
    </div>
  );
}
