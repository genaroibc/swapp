import { abis } from "../contracts"

export async function getPairsInfo({ pairsAddresses, instance }) {
  const pairsInfo = []
  const pairABI = abis.pair
  const tokenABI = abis.erc20.abi

  for (let i = 0; i < pairsAddresses.length; ++i) {
    const pairAddress = pairsAddresses[i]
    const pair = new instance.eth.Contract(pairABI, pairAddress)

    const token0Address = await pair.methods.token0().call()
    const token1Address = await pair.methods.token1().call()

    const token0Contract = new instance.eth.Contract(tokenABI, token0Address)
    const token1Contract = new instance.eth.Contract(tokenABI, token1Address)

    const token0Name = await token0Contract.methods.name().call()
    const token1Name = await token1Contract.methods.name().call()

    pairsInfo.push({
      address: pairAddress,
      token0Address,
      token1Address,
      token0Name,
      token1Name
    })
  }

  return pairsInfo
}
