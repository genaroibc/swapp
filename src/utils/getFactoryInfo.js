import { abis } from "../contracts"
import { getPairsInfo } from "./getPairsInfo"

export async function getFactoryInfo({ factoryAddress, instance }) {
  const factory = new instance.eth.Contract(abis.factory, factoryAddress)

  const factoryInfo = {
    allPairs: [],
    feeTo: await factory.methods.feeTo().call(),
    feeToSetter: await factory.methods.feeToSetter().call(),
    allPairsLength: await factory.methods.allPairsLength().call()
  }

  for (let i = 0; i < factoryInfo.allPairsLength; i++) {
    factoryInfo.allPairs[i] = await factory.methods.allPairs(i).call()
  }

  factoryInfo.pairsInfo = await getPairsInfo({
    pairsAddresses: factoryInfo.allPairs,
    instance
  })

  return factoryInfo
}
