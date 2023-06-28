import { Link } from "react-router-dom";
import styles from "../styles.module.scss";
import { HEADER_MENU } from "@src/constants";

export default function Menu() {
  return (
    <div className={styles.menu}>
      <ul className={styles["menu-list"]}>
        {HEADER_MENU.map((menu, index) =>
          menu.items ? (
            <li className={styles["menu-item"]} key={index}>
              <Link to="#" className={styles["menu-item-link"]}>
                {menu.title}
              </Link>
              <ul className={styles["sub-menu"]}>
                {menu.items.map((item, i) => <li className={styles["sub-menu-item"]} key={i}>
                  <Link to={item.link} className={styles["sub-menu-item-link"]}>
                    {item.title}
                  </Link>
                </li>)}
              </ul>
            </li>
          ) : (
            <li className={styles["menu-item"]} key={index}>
              <Link to={menu.link} className={styles["menu-item-link"]}>
                {menu.title}
              </Link>
            </li>
          )
        )}
      </ul>
    </div>
  );
}
