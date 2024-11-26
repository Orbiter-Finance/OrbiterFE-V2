import React, { useMemo, useState } from "react"
import { ChevronDownIcon, CircleAlert } from "lucide-react"
import { useAtom, useAtomValue } from "jotai"
import { OrbiterIcon, OrbiterModal, OrbiterSelect, OrbiterShow } from "@orbiter-finance/ui"
import { ITokenItem, useSelectTokens } from "../bridgeInfo/hooks/useSelectTokens.js"
import { selectFromChainAtom, selectTokenAtom } from "../stores/bridge.js"
import { cn } from "../utils/cn.js"
import { useExploreLink } from "../bridgeInfo/hooks/useExploreLink.js"
import useBridgeLogEvent from "../hooks/useBridgeLogEvent.js"
import { decimalNum } from "../utils/decimalNum.js"
import useReadBalance from "../hooks/useReadBalance.js"
import useSelectDisabledTokenUpdateChain from "../hooks/useSelectDisabledTokenUpdateChain.js"


// Token Selection Component
export default function SelectToken({
  onSelectToken,
}: {
  onSelectToken?: (token: ITokenItem) => void
}) {
  const { getExploreTokenLink } = useExploreLink()
  const selectFromChain = useAtomValue(selectFromChainAtom)
  const tokens = useSelectTokens()
  const [selectItem, setSelectItem] = useAtom(selectTokenAtom)
  const [show, setShow] = useState(false)
  const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()
  const { readBalance } = useReadBalance()
  const { selectDisabledTokenUpdateChain } = useSelectDisabledTokenUpdateChain()

  const AvailableTokens = useMemo(() => {
    return tokens.filter((item: ITokenItem) => !item.disabled)
  }, [tokens])

  const otherTokens = useMemo(() => {
    return tokens.filter((item: ITokenItem) => !!item.disabled)
  }, [tokens])

  const onSelectTokenEvent = (token: ITokenItem | any) => {
    onSelectToken && onSelectToken(token)
    setSelectItem(token.itemKey)
    setShow(false)
    bridgeLogEvent(BRIDGE_EVENT.switchToken)
  }
  return (
    <>
      <div
        onClick={() => setShow(true)}
        className={cn(
          "flex justify-center items-center px-3 rounded-full cursor-pointer bg-[var(--o-color-gray-800)] hover:bg-[var(--o-color-gray-700)] py-1.5"
        )}
      >
        <OrbiterIcon iconId={selectItem} type="TOKEN" />
        <label className="px-2 cursor-pointer o-font-500 text-base">
          {selectItem || "Select Token"}
        </label>
        <ChevronDownIcon />
      </div>
      <OrbiterModal
        show={show}
        onShowChange={(open) => setShow(open)}
        headerLabel="Select a Token"
        containerClassName="min-h-96 pb-4 py-4"
      >
        <div className="w-full max-h-full overflow-auto">
          <OrbiterSelect
            onSelectChange={onSelectTokenEvent}
            className="flex-1"
            list={AvailableTokens.map((item: ITokenItem) => {
              const balance = readBalance({ chainId: selectFromChain, symbol: item.symbol })
              return ({
                itemKey: item.symbol,
                itemName: item.symbol,
                label: item.symbol,
                viceLabel: item.name,
                disabled: !!item?.disabled,
                link: getExploreTokenLink({ chainId: selectFromChain, value: item.address }),
                icon: <OrbiterIcon className="w-7 h-7" iconId={item.symbol} type="TOKEN" />,
                active: item.symbol === selectItem,
                activityClassName: "bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl",
                right: balance ? (balance ? decimalNum(balance, 4, ",") : "--") : "",
                className: "px-3 py-2"
              })
            })}
          />
          <OrbiterShow
            when={!!otherTokens.length}
          >
            <div className="my-1.5 text-[var(--o-color-gray-400)]">
              Not supproted
            </div>
            <OrbiterSelect
              onSelectChange={onSelectTokenEvent}
              itemClick={(params) => {
                selectDisabledTokenUpdateChain(params.itemKey, () => {
                  setShow(false)
                })
              }}
              className="flex-1"
              list={otherTokens.map((item: ITokenItem) => ({
                itemKey: item.symbol,
                itemName: item.symbol,
                label: item.symbol,
                viceLabel: item.name,
                disabled: !!item?.disabled,
                link: getExploreTokenLink({ chainId: selectFromChain, value: item.address }),
                icon: <OrbiterIcon className="w-7 h-7" iconId={item.symbol} type="TOKEN" />,
                active: item.symbol === selectItem,
                activityClassName: "bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl",
                right: !!item?.disabled && <>
                  <div className="flex justify-end items-center relative tips-group">
                    <CircleAlert className="w-3.5 h-3.5 cursor-pointer" />
                    <div className="absolute z-[10] right-5 top-1/2 -translate-y-1/2 tips-content hidden justify-center items-center">
                      <div className="bg-[var(--o-color-gray-700)] text-[var(--color-gray-200)] rounded-xl text-sm  w-32 px-2 py-0.5">
                        This token is not supported on this chain.
                      </div>
                    </div>
                  </div>
                </>,
                className: "px-3 py-2"
              }))}
            />
          </OrbiterShow>
        </div>
      </OrbiterModal>
    </>
  )
}
