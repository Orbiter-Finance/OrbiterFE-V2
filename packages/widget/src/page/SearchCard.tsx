import { OrbiterIcon, OrbiterModal, OrbiterSelect } from '@orbiter-finance/ui'
import React, { useCallback, useMemo, useState } from 'react'
import { useBridgeInfoContext } from '../bridgeInfo/providers.js'
import { ChevronDownIcon, Search } from 'lucide-react'
import { useOrbiterToast } from '../hooks/useOrbiterToast.js'
import { useSetAtom } from 'jotai'
import { bridgeTransactionAtom } from '../stores/bridge.js'
import { PAGE_TYPE } from '../constant.js'
import { usePageTypeUpdate } from '../hooks/usePageTypeUpdate.js'

export default function SearchCard() {

    const { isMainnet, allChains, orbiterClient } = useBridgeInfoContext()
    const { updatePageModalType } = usePageTypeUpdate()
    const [open, setOpen] = useState(false)
    const [pending, setPending] = useState(false)
    const [enterKey, setEnterKey] = useState("")
    const setBridgeTransaction = useSetAtom(bridgeTransactionAtom)

    const { orbiterTotas } = useOrbiterToast()

    const [hash, setHash] = useState("")

    const [selectChainInfo, setSelectChainInfo] = useState<{ id: string, name: string }>({
        id: isMainnet ? '1' : "11155111",
        name: isMainnet ? 'Ethereum' : "Sepolia"
    })

    const fetchData = useCallback(
        async () => {
            if (pending) {
                orbiterTotas.warn({
                    title: "There is a query pending"
                })
                return
            }
            if (orbiterClient && hash) {
                setPending(true)
                try {
                    const result = await orbiterClient.getTransactionStatus(hash, selectChainInfo.id)
                    if (result) {
                        updatePageModalType(PAGE_TYPE.CONFIRM)
                        setBridgeTransaction({
                            fromAddress: result.sender,
                            srcChain: result.chainId,
                            tgtChain: result.targetChain,
                            srcToken: result.symbol,
                            tgtToken: result.targetSymbol,
                            sendAmount: result.amount,
                            receiveAmount: result.targetAmount,
                            srcTx: result.hash,
                            targetTx: result.targetId,
                            tgtAddress: "",
                            status: String(result.opStatus),
                            points: (result as any).points,
                            timeStamp: result.timestamp
                        })
                    } else {
                        orbiterTotas.warn({
                            title: "Please check your enter network and hash."
                        })
                    }
                } catch (error) {
                    orbiterTotas.error({
                        title: String((error as any)?.data?.message || (error as any)?.message || "Network Error")
                    })
                } finally {
                    setPending(false)
                }

            } else {
                orbiterTotas.warn({
                    title: "Please Enter Hash"
                })
            }
        },
        [orbiterClient, selectChainInfo, hash, orbiterTotas, pending],
    )


    const viewList = useMemo(() => {
        let list = allChains
        if (!!enterKey) {
            list = allChains.filter((item) => {
                return item.name.toLocaleLowerCase().includes(enterKey.toLocaleLowerCase()) ||
                    item.id.toLocaleLowerCase().includes(enterKey.toLocaleLowerCase())
            })
        }
        return list
    }, [enterKey, allChains])


    return (
        <div className='w-full max-h-56 sm:max-h-[30rem] sm:h-[30rem] py-4 px-3 bg-[var(--o-color-gray-800)] rounded-md'>
            <div className='w-full text-[var(--o-color-gray-50)] text-2xl o-font-500 text-center'>
                Your Transaction Details
            </div>

            <div className='mt-4 w-full rounded-full border border-[var(--o-color-brand-600)] bg-[var(--o-color-gray-900)] flex justify-between items-center p-1'>
                <div className='flex justify-center items-center'>
                    <div
                        onClick={(event) => {
                            event.stopPropagation()
                            setOpen(true)
                        }}
                        className='p-2 rounded-full flex justify-center items-center border border-[var(--o-color-select-border)] bg-[var(--o-color-gray-800)]'>
                        <OrbiterIcon type="CHAIN" iconId={selectChainInfo.id} />
                        <div className='mx-2 o-font-500'>{selectChainInfo.name}</div>
                        <ChevronDownIcon className='w-6 h-6' />
                    </div>
                </div>
                <input className='flex-1 mx-2' placeholder='Please enter Tx Hash'
                    onChange={(event) => {
                        const val = event.target.value.trim()
                        setHash(val)
                    }}
                />
                <div className='w-10 h-10 rounded-full cursor-pointer bg-[var(--o-color-brand-500)] flex justify-center items-center'
                    onClick={(event) => {
                        event.stopPropagation()
                        fetchData()
                    }}
                >
                    <Search className='w-6 h-6' stroke='var(--o-color-gray-50)' />
                </div>
            </div>
            <div className='mt-4'>
                To confirm that your Transaction Hash was generated from Orbiter,
                <div>you can:</div>
                <div>Make sure that this Transaction Hash was initiated at Orbiter official website</div>
                <div>The last four digits of your Tx value contain an ID code starts with 90XX</div>
                <div>Your transaction amount  is supported by Orbiter.</div>
            </div>
            <OrbiterModal
                show={open}
                headerLabel={"Select a Chain"}
                containerClassName="bg-[var(--o-color-gray-800)] min-h-96"
                onShowChange={(show) => {
                    setOpen(show)
                }}
            >
                <div className="flex justify-start items-center rounded-xl bg-[var(--o-color-gray-900)] border border-[var(--o-color-select-border)] w-full py-2.5 px-3 mt-2">
                    <Search className='w-6 h-6' stroke="var(--o-color-gray-400)" />
                    <input style={{ userSelect: "all" }} className="flex-1 ml-2" placeholder="Search Network" value={enterKey} onChange={(event) => {
                        const str = event.target.value
                        setEnterKey(str)
                    }} />
                </div>
                <div className="w-full mt-3 max-h-full overflow-auto">
                    <OrbiterSelect
                        onSelectChange={(data) => {
                            setSelectChainInfo({
                                id: data.itemKey,
                                name: data.itemName
                            })
                            setOpen(false)
                        }}
                        list={viewList.map((item) => ({
                            itemKey: item.id,
                            itemName: item.name,
                            label: item.name,
                            disabled: !!item?.disabled,
                            active: item.id === selectChainInfo.id,
                            activityClassName: "bg-[var(--o-color-gray-900)] border border-[var(--o-color-brand-500)] rounded-xl",
                            icon: <OrbiterIcon iconId={item.id} type="CHAIN" />,
                        }))}
                    />
                </div>

            </OrbiterModal>
        </div>
    )
}
