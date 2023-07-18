import { useEffect, useRef, useState } from "react"
import { chevronDown } from "../../assets"
import styles from "../../styles"
import { useOnClickOutside } from "../../utils"

export function AmountIn({
  value,
  onChange,
  currencyValue,
  onSelect,
  currencies,
  isSwapping
}) {
  const [showList, setShowList] = useState(false)
  const [selectedCurrency, setSelectedCurrency] = useState("select")

  const ref = useRef()
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
        placeholder="0.0"
        value={value}
        disabled={isSwapping}
        onChange={event =>
          typeof onChange === "function" && onChange(event.target.value)
        }
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
                  className={`${styles.currencyListItem} ${
                    selectedCurrency === tokenName ? "bg-site-dim2" : ""
                  } cursor-pointer`}
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
