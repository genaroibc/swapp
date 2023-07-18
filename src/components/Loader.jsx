import styles from "../styles"
import { ethereumLogo } from "../assets"

export function Loader({ title = "loading" }) {
  return (
    <div className={styles.loader}>
      <img
        src={ethereumLogo}
        alt="ethereum logo"
        className={styles.loaderImg}
      />
      <p className={styles.loaderText}>{title}</p>
    </div>
  )
}
