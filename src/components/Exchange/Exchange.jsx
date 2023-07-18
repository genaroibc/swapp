import { useEffect, useState } from "react"
import { Contract } from "@ethersproject/contracts"
import { abis } from "../../contracts"
import {
  ERC20,
  useContractFunction,
  useTokenAllowance,
  useEthers,
  useTokenBalance
} from "@usedapp/core"
import { ethers } from "ethers"
import { parseUnits } from "ethers/lib/utils"
import {
  getAvailableTokens,
  getCounterpartTokens,
  findPoolByTokens,
  isOperationPending,
  getFailureMessage,
  getSuccessMessage
} from "../../utils"

import { ROUTER_ADDRESS } from "../../config"
import { AmountIn, AmountOut, Balance } from "."
import styles from "../../styles"

export function Exchange({ pools }) {
  const { account } = useEthers()
  const [fromValue, setFromValue] = useState("0")
  const [fromToken, setFromToken] = useState(pools[0].token0Address)
  const [toToken, setToToken] = useState("")
  const [resetState, setResetState] = useState(false)

  const fromValueBN = parseUnits(fromValue)
  const availableTokens = getAvailableTokens(pools)
  const counterpartTokens = getCounterpartTokens(pools, fromToken)
  const pairAddress = findPoolByTokens(pools, fromToken, toToken)?.address ?? ""

  const routerContract = new Contract(ROUTER_ADDRESS, abis.router02)
  const fromTokenContract = new Contract(fromToken, ERC20.abi)
  const fromTokenBalance = useTokenBalance(fromToken, account)
  const toTokenBalance = useTokenBalance(toToken, account)
  const tokenAllowance =
    useTokenAllowance(fromToken, account, ROUTER_ADDRESS) || parseUnits("0")
  const isApprovalNeeded = fromValueBN.gt(tokenAllowance)
  const isFromValueGreaterThanZero = fromValueBN.gt(parseUnits("0"))
  const hasEnoughBalance = fromValueBN.lte(fromTokenBalance ?? parseUnits("0"))

  const { state: swapApproveState, send: swapApproveSend } =
    useContractFunction(fromTokenContract, "approve", {
      transactionName: "onApproveRequested",
      gasLimitBufferPercentage: 10
    })

  const { state: swapExecuteState, send: swapExecuteSend } =
    useContractFunction(routerContract, "swapExactTokensForTokens", {
      transactionName: "swapExactTokensForTokens",
      gasLimitBufferPercentage: 10
    })

  const isApproving = isOperationPending(swapApproveState)
  const isSwapping = isOperationPending(swapExecuteState)
  const canApprove = !isApproving && isApprovalNeeded
  const canSwap =
    !isApprovalNeeded &&
    !isSwapping &&
    isFromValueGreaterThanZero &&
    hasEnoughBalance

  const successMessage = getSuccessMessage(swapApproveState, swapExecuteState)
  const failureMessage = getFailureMessage(swapApproveState, swapExecuteState)

  const onApproveRequested = async () => {
    swapApproveSend(ROUTER_ADDRESS, ethers.constants.MaxUint256)
  }

  const onSwapRequested = async () => {
    swapExecuteSend(
      fromValueBN,
      0,
      [fromToken, toToken],
      account,
      Math.floor(Date.now() / 1000) + 60 * 20 // 20 minutes from the current Unix time
    ).then(() => {
      setFromValue("0")
    })
  }

  const onFromValueChange = value => {
    const trimmedValue = value.trim()

    try {
      if (trimmedValue) {
        parseUnits(trimmedValue)

        setFromValue(trimmedValue)
      }
    } catch (error) {
      console.error(error)
    }
  }

  const onFromTokenChange = value => {
    setFromToken(value)
  }

  const onToTokenChange = value => {
    setToToken(value)
  }

  useEffect(() => {
    if (failureMessage || successMessage) {
      setTimeout(() => {
        setResetState(true)
        setFromValue("0")
        setToToken("")
      }, 5000)
    }
  }, [failureMessage, successMessage])

  return (
    <section className="flex flex-col w-full items-center">
      <div className="mb-8">
        <AmountIn
          value={fromValue}
          onChange={onFromValueChange}
          onSelect={onFromTokenChange}
          currencyValue={fromToken}
          currencies={availableTokens}
          isSwapping={isSwapping && hasEnoughBalance}
        />

        <Balance tokenBalance={fromTokenBalance} />
      </div>

      <div className="mb-8 w-full">
        <AmountOut
          fromToken={fromToken}
          toToken={toToken}
          amountIn={fromValueBN}
          pairContract={pairAddress}
          currencyValue={toToken}
          onSelect={onToTokenChange}
          currencies={counterpartTokens}
        />

        <Balance tokenBalance={toTokenBalance} />
      </div>

      {isApprovalNeeded && !isSwapping ? (
        <button
          disabled={!canApprove}
          onClick={onSwapRequested}
          className={`${
            canApprove
              ? "bg-site-pink text-white"
              : "bg-site-dim2 text-site-dim2"
          } ${styles.actionButton}`}
        >
          {isApproving ? "approving" : "approve"}
        </button>
      ) : (
        <button
          disabled={!canSwap}
          onClick={onApproveRequested}
          className={`${
            canSwap ? "bg-site-pink text-white" : "bg-site-dim2 text-site-dim2"
          } ${styles.actionButton}`}
        >
          {isSwapping
            ? "swapping..."
            : hasEnoughBalance
            ? "swap"
            : "insufficient balance"}
        </button>
      )}

      {failureMessage && !resetState ? (
        <p className={styles.message}>{failureMessage}</p>
      ) : successMessage ? (
        <p className={styles.message}>{successMessage}</p>
      ) : null}
    </section>
  )
}
