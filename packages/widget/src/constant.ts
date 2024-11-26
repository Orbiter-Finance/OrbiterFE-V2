export enum PAGE_TYPE {
    BRIDGE = "BRIDGE",
    HISTORY = "HISTORY",
    CONFIRM = "CONFIRM",

    HISTORY_MODAL = "HISTORY_MODAL",
    CONFIRM_MODAL = "CONFIRM_MODAL",
}

export enum TRANSACTION_STATUS {
    FROM_OKAY = 0,
    FROM_CHECK = 96,
    TO_FAILED = 97,
    TO_CHECK = 98,
    TO_OKAY = 99,
}

export enum BRIDGE_EVENT {
    connectWallet = "bridge_connectWallet",
    connectWalletError = "bridge_connectWallettError",
    disconnectWallet = "bridge_disconnectWallet",
    disconnectWalletError = "bridge_disconnectWalletError",
    switchBridgeChain = "bridge_switchBridgeChain",
    switchWalletChain = "bridge_switchWalletChain",
    switchToken = "bridge_switchToken",
    sendTransaction = "bridge_sendTransaction",
    sendTransactionError = "bridge_sendTransactionError",
    confirmTransaction = "bridge_confirmTransaction",
    bridgeAgain = "bridge_bridgeAgain",
    switchBridgePage = "bridge_switchBridgePage",
}