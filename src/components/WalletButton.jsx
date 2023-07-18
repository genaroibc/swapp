import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core"
import styles from "../styles"
import { useEffect, useState } from "react"

export function WalletButton() {
  const [displayAccountAddress, setDisplayAccountAddress] = useState("")

  const { ens } = useLookupAddress()
  const { account, activateBrowserWallet, deactivate } = useEthers()

  const handleClick = () => {
    if (!account) return activateBrowserWallet()

    deactivate()
  }

  useEffect(() => {
    if (ens) return setDisplayAccountAddress(ens)

    if (account) return setDisplayAccountAddress(shortenAddress(account))

    setDisplayAccountAddress("")
  }, [account, ens, setDisplayAccountAddress])

  return (
    <button onClick={handleClick} className={styles.walletButton}>
      {displayAccountAddress ?? "Connect Wallet"}
    </button>
  )
}
