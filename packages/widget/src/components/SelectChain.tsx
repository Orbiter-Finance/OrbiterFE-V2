import React, { useMemo, useState } from "react"
import { ChevronDownIcon, CircleAlert, Search } from "lucide-react"
import { useAtom, useAtomValue } from "jotai"
import { OrbiterIcon, OrbiterModal, OrbiterSelect, OrbiterShow, OrbiterTag, TagType } from "@orbiter-finance/ui"
import { ChainConfigItemType, useSelectChains } from "../bridgeInfo/hooks/useSelectChains.js"
import { useOrbiterGetChainsConfig } from "../bridgeInfo/hooks/useOrbiterGetChainsConfig.js"
import { bridgeBalanceDataGroupAtom, selectFromChainAtom, selectToChainAtom, selectTokenAtom } from "../stores/bridge.js"
import { cn } from "../utils/cn.js"
import useBridgeLogEvent from "../hooks/useBridgeLogEvent.js"
import useSwitchChainFillAddress from "../hooks/useSwitchChainFillAddress.js"
import { decimalNum } from "../utils/decimalNum.js"
import { NoDataPng } from "../assets/assets.js"
import useReadBalance from "../hooks/useReadBalance.js"

// Chain Selection Component

const tabList = ["All", "Ethereum & L2", "BTC L2"]

export default function SelectChain({ isTo }: { isTo?: boolean }) {
  const { refreshTime } = useAtomValue(bridgeBalanceDataGroupAtom)
  const { getChainsConfig } = useOrbiterGetChainsConfig()
  const chainsList = useSelectChains(!!isTo) // Get chains list based on the "isTo" flag
  const [selectItem, setSelectItem] = useAtom(
    !isTo ? selectFromChainAtom : selectToChainAtom
  ) // Manage selected chain state
  const { readBalance } = useReadBalance()
  const selectToken = useAtomValue(selectTokenAtom)
  const [show, setShow] = useState(false) // Modal show/hide state
  const [enterKey, setEnterKey] = useState("") // Modal show/hide state
  const { bridgeLogEvent, BRIDGE_EVENT } = useBridgeLogEvent()
  const [tabKey, setTabKey] = useState("All")
  const { switchChainFillAddress } = useSwitchChainFillAddress()

  const viewList = useMemo(() => {
    let list = chainsList
    if (!!enterKey) {
      list = chainsList.filter((item) => {
        return item.name.toLocaleLowerCase().includes(enterKey.toLocaleLowerCase()) ||
          item.id.toLocaleLowerCase().includes(enterKey.toLocaleLowerCase())
      })
    }

    return list.filter((item) => {
      return tabKey === tabList[0] || item.classify.includes(tabKey)
    })
  }, [enterKey, chainsList, tabKey])

  const AvailableChains = useMemo(() => {
    return viewList.filter((item: ChainConfigItemType) => !!item.recommend)
  }, [viewList])

  const otherChains = useMemo(() => {
    return viewList.filter((item: ChainConfigItemType) => !item.recommend)
  }, [viewList])

  const onSelectChainEvent = (chain: any) => {
    setSelectItem(chain.itemKey)
    setShow(false)
    bridgeLogEvent(BRIDGE_EVENT.switchBridgeChain)
    switchChainFillAddress(chain.itemKey)
  }

  return (
    <>
      <div
        onClick={() => setShow(true)}
        className={cn(
          "flex justify-center items-center px-3 rounded-full cursor-pointer bg-[var(--o-color-gray-900)] hover:bg-[var(--o-color-gray-800)] py-2 o-font-500 border border-[var(--o-color-select-border)]",
          !selectItem && isTo ? "bg-[var(--o-color-brand-500)] hover:bg-[var(--o-color-brand-400)]" : ""
        )}
      >
        <OrbiterShow
          when={!!selectItem || !isTo}
        >
          <OrbiterIcon iconId={selectItem} type="CHAIN" />
        </OrbiterShow>
        <label className="px-2 cursor-pointer whitespace-nowrap text-base">
          {getChainsConfig(selectItem)?.name || "Select Chain"}
        </label>
        <ChevronDownIcon />
      </div>

      {/* Modal for chain selection */}
      <OrbiterModal
        show={show}
        onShowChange={(open) => {
          if (!open) {
            setEnterKey("")
          }
          setShow(open)
        }}
        headerLabel="Select a Chain"
        containerClassName="bg-[var(--o-color-gray-800)] min-h-96 py-4"
      >
        <div className="mt-3 flex justify-start items-center rounded-xl bg-[var(--o-color-gray-900)] border border-[var(--o-color-select-border)] w-full py-2.5 px-3">
          <Search stroke="var(--o-color-gray-400)" />
          <input style={{ userSelect: "all" }} className="flex-1 ml-2" placeholder="Search Network" value={enterKey} onChange={(event) => {
            const str = event.target.value
            setEnterKey(str)
          }} />
        </div>

        <div className="w-full flex justify-start items-center mt-3 mb-1.5">
          {
            tabList.map((item) => {
              const isActive = item === tabKey
              return <div key={item} className="flex justify-start items-center mr-2.5">
                <div onClick={(event) => {
                  event.stopPropagation()
                  if (item !== tabKey) {
                    setTabKey(item)
                  }
                }} className={
                  cn("px-4 h-7 text-sm border cursor-pointer flex justify-center items-center rounded-full", isActive ? "o-font-500 border-[var(--o-color-brand-800)] bg-[var(--o-color-brand-900)] text-[var(--o-color-brand-500)]" : "o-font-400 text-[var(--o-color-gray-400)] bg-[var(--o-color-gray-900)] border-[var(--o-color-select-border)]")
                }>{item}</div>
              </div>
            })
          }
        </div>

        <div className="flex-1 overflow-auto" key={refreshTime}>
          <OrbiterShow
            when={!!viewList?.length}
            fallback={
              <div className="w-full h-full flex justify-center items-center">
                <div className="w-full">
                  <div className="w-full flex justify-center items-center"><img src={NoDataPng} className='w-40 h-40' /></div>
                </div>
              </div>
            }
          >
            <OrbiterShow
              when={!!AvailableChains?.length}
            >
              <div className="text-[var(--o-color-gray-400)]">
                Popular
              </div>
              <OrbiterSelect
                onSelectChange={(data) => {
                  onSelectChainEvent(data)
                }}
                className="mt-2"
                list={AvailableChains.map((item) => {
                  const balance = readBalance({ chainId: item.id, symbol: selectToken })
                  return ({
                    itemKey: item.id,
                    itemName: item.name,
                    label: item.name,
                    disabled: !!item?.disabled,
                    active: item.id === selectItem,
                    tags: item?.tags ? <>
                      {
                        item.tags.map((option, idx) => <OrbiterTag key={idx} tag={option as TagType} className="mr-1" />)
                      }
                    </> : null,
                    activityClassName: "bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl",
                    icon: <OrbiterIcon iconId={item.id} type="CHAIN" />,
                    right: !item?.disabled ? (balance ? (balance ? `${decimalNum(balance, 6, ",")} ${selectToken}` : "--") : "--") : <CircleAlert className="w-3.5 h-3.5" />
                  })
                })}
              />
            </OrbiterShow>
            <OrbiterShow
              when={!!otherChains?.length}
            >
              <div className="mt-1.5 text-[var(--o-color-gray-400)]">
                Networks
              </div>
              <OrbiterSelect
                onSelectChange={(data) => {
                  onSelectChainEvent(data)
                }}
                className="mt-2"
                list={otherChains.map((item) => {
                  const balance = readBalance({ chainId: item.id, symbol: selectToken })
                  return ({
                    itemKey: item.id,
                    itemName: item.name,
                    label: item.name,
                    disabled: !!item?.disabled,
                    active: item.id === selectItem,
                    tags: item?.tags ? <>
                      {
                        item.tags.map((option, idx) => <OrbiterTag key={idx} tag={option as TagType} className="mr-1" />)
                      }
                    </> : null,
                    activityClassName: "bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl",
                    icon: <OrbiterIcon iconId={item.id} type="CHAIN" />,
                    right: !item?.disabled ? (balance ? (balance ? `${decimalNum(balance, 6, ",")} ${selectToken}` : "--") : "--") : <CircleAlert className="w-3.5 h-3.5" />

                  })
                })}
              />
            </OrbiterShow>
          </OrbiterShow>

        </div>

      </OrbiterModal>
    </>
  )
}