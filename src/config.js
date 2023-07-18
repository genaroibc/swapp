import { Goerli } from "@usedapp/core"

export const ROUTER_ADDRESS = process.env.REACT_APP_ROUTER_ADDRESS
export const GOERLI_RPC_URL = process.env.REACT_APP_GOERLI_RPC_URL

export const DAPP_CONFIG = {
  readOnlyChainId: Goerli.chainId,
  readOnlyUrls: {
    [Goerli.chainId]: GOERLI_RPC_URL
  }
}
