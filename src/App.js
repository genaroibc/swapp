import React from "react"
import { useEthers } from "@usedapp/core"
import styles from "./styles"
import { Loader, WalletButton } from "./components"
import { Exchange } from "./components/Exchange"
import { uniswapLogo } from "./assets"
import { usePools } from "./hooks"

const App = () => {
  const { account } = useEthers()
  const { loading, pools } = usePools()

  return (
    <main className={styles.container}>
      <div className={styles.innerContainer}>
        <header className={styles.header}>
          <img
            src={uniswapLogo}
            alt="uniswap logo"
            className="object-contain w-16 h-16"
          />
          <WalletButton />
        </header>

        <div className={styles.exchangeContainer}>
          <h1 className={styles.headTitle}>Uniswap 2.0</h1>

          <p className={styles.subTitle}>
            Exchange tokens using the uniswap protocol
          </p>

          <div className={styles.exchangeBoxWrapper}>
            <div className={styles.exchangeBox}>
              <div className="pink_gradient" />
              <section className={styles.exchange}>
                {account ? (
                  loading ? (
                    <Loader title="Loading pools" />
                  ) : (
                    <Exchange pools={pools} />
                  )
                ) : (
                  <Loader title="Please connect your wallet" />
                )}
              </section>
              <div className="blue_gradient" />
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}

export default App
