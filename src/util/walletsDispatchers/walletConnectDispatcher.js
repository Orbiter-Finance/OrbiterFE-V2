import WalletConnect from "@walletconnect/client";
import QRCodeModule from "@walletconnect/qrcode-modal";
import { toRefs } from "../../composition";

import { userDeniedMessage, showMessage } from "../constants/web3/getWeb3"
import { updateGlobalSelectWalletConf } from "./walletsCoreData";
import { globalSelectWalletConf } from "./walletsCoreData";
import { WALLETCONNECT } from "./constants";
import { 
    modifyLocalLoginInfo, 
    withPerformInterruptWallet
} from "./utils";
import { localWeb3 } from "../constants/contract/localWeb3";

let connector = null; // when walletconnect connect success, connector will be assigned connector instance

// this hof helps the following functions to throw errors
// avoid duplicate code
export const withErrorCatcher = (fn) => {
    return (error, ...args) => {
        if (error) throw error;
        return fn(...args);
    }
}

// transfer data after connect success into a valid data structure
// there r different processing between the initial connect and the repeated connect 
const performWalletConnectAccountInfo = (payload = {}, connected = false) => {
    if (connected) {
        const { _accounts = [], _chainId = "", _peerId = "", _peerMeta = {} } = payload;
        return {
            walletAddress: _accounts[0] || "",
            chainId: _chainId,
            peerId: _peerId,
            peerMeta: _peerMeta

        }
    }
    const { params = [] } = payload;
    const [ payloadObj = {} ] = params;
    const { accounts = [], chainId = "", peerId = "", peerMeta = {} } = payloadObj;
    const [ walletAddress = "" ] = accounts;
    return {
        walletAddress,
        chainId,
        peerId,
        peerMeta
    }
}

const onConnectSuccessCallback = withErrorCatcher((payload, connected = false) => {
    // this console is necessary
    console.log(`%c WalletConnect connect success`, "color: #fff; background: green", payload);
    const walletInfo = performWalletConnectAccountInfo(payload, connected);
    updateGlobalSelectWalletConf(WALLETCONNECT, walletInfo, true);
    // if connect successful, set the local login info
    modifyLocalLoginInfo({
        walletType: WALLETCONNECT,
        loginSuccess: true,
        walletPayload: walletInfo
    });
});

const onDisconnectCallback = withErrorCatcher(payload => {
    console.log(`%c WalletConnect disconnected`, "color: #fff; background: red", payload);
    if (!connector) {
        userDeniedMessage(); // first in
    } else {
        // this only happens when the user disconnects on the phone manually
        walletConnectDispatcherOnDisconnect(false);
    }
});

const onSessionUpdateCallback = withErrorCatcher(payload => {
    console.log(`%c WalletConnect session updated`, "color: #fff; background: orange", payload);
})

const subscribeWalletEvents = () => {
    if (!connector) return;
    connector.on("connect", onConnectSuccessCallback);
    connector.on("disconnect", onDisconnectCallback);
    // if wallet data changed, such as chainId? account info? session_update event will be invoked
    connector.on("session_update", onSessionUpdateCallback);
}

// wake up the wallet connect modal by invoke this method
export const walletConnectDispatcherOnInit = async () => {
    connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModule
    })

    if (connector.connected) {
        // if it's already connected, invoke onConnectSuccessCallback for the data init
        onConnectSuccessCallback(null, connector, true);
    } else {
        // if there is no connection, createSession will be invoked for pop up a qrcode scan box
        await connector.createSession();
    }

    subscribeWalletEvents();
}

// disconnect the walletconnect manually
export const walletConnectDispatcherOnDisconnect = withPerformInterruptWallet((shouldKill = true) => {
    shouldKill && connector.killSession();
});

export const loginStatusCheckerOfWalletConnect = () => {
    const { walletType: walletTypeRef, loginSuccess: loginSuccessRef } = toRefs(globalSelectWalletConf);
    return walletTypeRef.value === WALLETCONNECT && loginSuccessRef.value === true;
}

export const walletConnectDispatcherOnSignature = async (from, selectMakerInfo, value, fromChainID, onTransferSucceed) => {
    const _web3 = localWeb3(fromChainID);    
    const gaslimit = await _web3.eth.estimateGas({
        from,
        to: selectMakerInfo.makerAddress,
        value,
      });
    const nonce = await _web3.eth.getTransactionCount("0x6C1DddE80D5a81E6b1E18E2385c450c7c9Ded7c0");
    connector.sendTransaction({
        from,
        to: selectMakerInfo.makerAddress,
        gasLimit: gaslimit,
        value,
        nonce
    }).then(result => {
        onTransferSucceed(
            from,
            selectMakerInfo,
            value,
            fromChainID,
            result
          )
    }).catch(err => {
        console.log("err", err);
    })
}

export const walletConnectDispatcherOnAddChain = () => {
    showMessage("You must Change Networks", "error");
}