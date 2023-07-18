import { abis } from "../contracts"

export async function getRouterInfo({ address, instance }) {
  const router = new instance.eth.Contract(abis.router02, address)

  return {
    factory: await router.methods.factory().call()
  }
}
