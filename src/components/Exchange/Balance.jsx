import { formatUnits } from "ethers/lib/utils"
import styles from "../../styles"

export function Balance({ tokenBalance }) {
  return (
    <div className={styles.balance}>
      <p className={styles.balanceText}>
        {tokenBalance && (
          <>
            <span className={styles.balanceBold}>Balance: </span>
            {formatUnits(tokenBalance)}
          </>
        )}
      </p>
    </div>
  )
}
