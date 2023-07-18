import Web3 from "web3"
import { useState, useEffect } from "react"
import { useConfig } from "@usedapp/core"
import { ROUTER_ADDRESS } from "../config"
import { getFactoryInfo, getRouterInfo } from "../utils"

export function usePools() {
  const { readOnlyChainId, readOnlyUrls } = useConfig()

  const [loading, setLoading] = useState(true)
  const [pools, setPools] = useState({})

  useEffect(() => {
    loadPools(readOnlyUrls[readOnlyChainId])
      .then(pools => {
        setPools(pools)
        setLoading(false)
      })
      .catch(console.error)
  }, [readOnlyChainId, readOnlyUrls])

  return { loading, pools }
}

export const loadPools = async providerURL => {
  const provider = new Web3.providers.HttpProvider(providerURL)
  const web3 = new Web3(provider)

  const routerInfo = await getRouterInfo({
    instance: web3,
    address: ROUTER_ADDRESS
  })

  const { pairsInfo } = await getFactoryInfo({
    instance: web3,
    factoryAddress: routerInfo.factory
  })

  return pairsInfo
}
