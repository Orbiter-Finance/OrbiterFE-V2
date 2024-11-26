import React from 'react';
import { StarknetWallet } from '../hlepers/starknet-wallet/ui';
import SuiWallet from '../hlepers/sui-wallet/ui'

export const WalletConnectModal = React.memo(() => {
    return (
        <>
        <StarknetWallet />
        <SuiWallet />
        </>
    );
})
