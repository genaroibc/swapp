import { useState, useEffect, useRef } from "react"
import { formatUnits } from "ethers/lib/utils"

import { chevronDown } from "../../assets"
import { useAmountsOut, useOnClickOutside } from "../../utils"

export function AmountOut({
  fromToken,
  toToken,
  amountIn,
  pairContract,
  currencyValue,
  onSelect,
  currencies
}) {
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
    <div className="flex items-center justify-between gap-4 relative">
      <input
        type="number"
        placeholder="0.0"
        value={formatUnits(amountOut)}
        disabled
        className="p-4 w-full bg-slate-900 text-white font-black text-3xl rounded-md"
      />

      <div className="absolute right-8 top-1/2 -translate-y-1/2">
        <div
          className="relative"
          onClick={() => setShowList(showList => !showList)}
        >
          <button className="text-white flex items-center gap-1 font-bold bg-slate-950 py-2 px-4 rounded-xl min-w-max flex-1">
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
            <ul
              ref={ref}
              className="absolute z-10 right-0 bg-slate-950 border-[1px] border-gray-900 w-full mt-2 rounded-lg min-w-[170px] overflow-hidden"
            >
              {Object.entries(currencies).map(([token, tokenName]) => (
                <li
                  key={token}
                  className={`font-medium text-base text-white px-5 py-3 hover:bg-slate-800 cursor-pointer ${
                    selectedCurrency === tokenName ? "bg-slate-800" : ""
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
    </div>
  )
}
