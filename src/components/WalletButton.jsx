import { shortenAddress, useEthers, useLookupAddress } from "@usedapp/core"
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
    <button
      onClick={handleClick}
      className="bg-site-pink border-none outline-none px-6 py-2 font-poppins font-bold text-lg text-white rounded-3xl leading-[24px] hover:bg-pink-600 transition-all"
    >
      {displayAccountAddress || "Connect Wallet"}
    </button>
  )
}
