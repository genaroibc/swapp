import React from "react"
import { useEthers } from "@usedapp/core"
import { Loader, WalletButton } from "./components"
import { Exchange } from "./components/Exchange"
import { uniswapLogo } from "./assets"
import { usePools } from "./hooks"

const App = () => {
  const { account } = useEthers()
  const { loading, pools } = usePools()

  return (
    <main className="max-w-7xl mx-auto bg-slate-900 min-h-screen pb-12">
      <header className="flex items-center gap-4 justify-between w-full p-4">
        <img
          src={uniswapLogo}
          alt="uniswap logo"
          className="object-contain w-16 h-16"
        />
        <WalletButton />
      </header>

      <div className="text-center">
        <h1 className="font-black text-white text-5xl">Swapp</h1>

        <section className="mx-auto max-w-lg my-8 bg-slate-950 min-h-[400px] p-4 rounded-md">
          {account ? (
            loading ? (
              <Loader title="Loading pools..." />
            ) : (
              <Exchange pools={pools} />
            )
          ) : (
            <Loader title="Connect your wallet" />
          )}
        </section>
      </div>
    </main>
  )
}

export default App
