import { useEffect, useId, useRef, useState } from "react"
import { chevronDown } from "../../assets"
import styles from "../../styles"
import { useOnClickOutside, useAmountsOut } from "../../utils"
import { formatUnits } from "ethers/lib/utils"

export function AmountOut({
  fromToken,
  toToken,
  amountIn,
  pairContract,
  currencyValue,
  onSelect,
  currencies
}) {
  const amountInputId = useId()

  const [showList, setShowList] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("select")

  const ref = useRef()

  const amountOut =
    useAmountsOut(pairContract, amountIn, fromToken, toToken) ?? 0

  useOnClickOutside(ref, () => setShowList(false))

  useEffect(() => {
    if (Object.keys(currencies).includes(currencyValue))
      return setSelectedCurrency(currencies[currencyValue])

    setSelectedCurrency("select")
  }, [currencies, currencyValue])

  return (
    <div className={styles.amountContainer}>
      <input
        type="number"
        name={amountInputId}
        id={amountInputId}
        placeholder="0.0"
        value={formatUnits(amountOut)}
        disabled
        className={styles.amountInput}
      />

      <div
        className="relative"
        onClick={() => setShowList(showList => !showList)}
      >
        <button className={styles.currencyButton}>
          {selectedCurrency}

          <img
            src={chevronDown}
            alt="chevron down"
            className={`w-4 h-4 object-contain ml-2 ${
              showList ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        {showList && (
          <ul ref={ref} className={styles.currencyList}>
            {Object.entries(currencies)
              .map()
              .map(([token, tokenName]) => (
                <li
                  key={token}
                  className={styles.currencyListItem}
                  onClick={() => {
                    if (typeof onSelect === "function") {
                      onSelect(token)
                    }

                    setSelectedCurrency(tokenName)
                    setShowList(false)
                  }}
                >
                  {tokenName}
                </li>
              ))}
          </ul>
        )}
      </div>
    </div>
  )
}
