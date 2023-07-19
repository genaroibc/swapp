import { formatUnits, parseUnits } from "ethers/lib/utils"

export function Balance({ tokenBalance }) {
  return (
    <div className="text-left my-4">
      <p className="text-base text-white">
        {tokenBalance && (
          <>
            <span className="font-bold">Balance: </span>
            {formatUnits(tokenBalance ?? parseUnits("0"))}
          </>
        )}
      </p>
    </div>
  )
}
