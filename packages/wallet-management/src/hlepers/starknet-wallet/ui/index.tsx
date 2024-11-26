import { useConnect } from '@starknet-react/core';
import React from 'react';
import { useStarknet } from '../../../hooks/useStarknet';
import { OrbiterModal } from '@orbiter-finance/ui';
import { useWalletConnectContext } from '../../../providers/WalletConnectProvider';
import { useWalletConfigContext } from 'src/providers/WalletConfigProvider'

export function StarknetWallet() {

    const { config } = useWalletConfigContext()
    const { walletType, setWalletType } = useWalletConnectContext()

    const { connectors, connectAsync } = useConnect();
    const { type } = useStarknet();

    return (

        <OrbiterModal
            show={type === walletType}
            onShowChange={(open: boolean) => {
                if (!open) {
                    setWalletType("");
                }
            }}
            headerLabel={"Connect Starknet Wallet"}
            containerClassName='bg-[var(--o-color-gray-800)] border border-[var(--o-color-gray-600)] max-h-96'
        >
            <div className='w-full flex justify-start items-center flex-wrap mt-2'>
                {
                    connectors.map((item) => {
                        return <div
                            key={item.name}
                            onClick={async (event) => {
                                event.stopPropagation();
                                try {
                                    const res = await connectAsync(
                                        {
                                            connector: item
                                        }
                                    );
                                    setWalletType("");
                                } catch (error) {
                                    config?.totas?.error?.({
                                        title: String((error as any)?.data?.message || (error as any)?.message)
                                    })
                                }
                            }} className='flex justify-start items-center w-40 mr-4 mb-3 h-12 p-4 bg-[var(--o-color-gray-900)] rounded-lg cursor-pointer'>
                            <img src={item.icon?.dark || ""} width={24} height={24} className='w-6 h-6 mr-2' alt={item.name} />
                            {item.name}
                        </div>;
                    })
                }
            </div>
        </OrbiterModal>

    );
}
