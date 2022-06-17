import WalletConnect from "@walletconnect/browser";
import QRCodeModule from "@walletconnect/qrcode-modal";

// this hof helps the following functions to throw errors
// avoid duplicate code
export const withErrorCatcher = (fn) => {
    return (error, payload) => {
        if (error) throw error;
        return fn(payload);
    }
}

// wake up the wallet connect modal by invoke this method
export const connectWalletConnect = () => {
    const connector = new WalletConnect({
        bridge: "https://bridge.walletconnect.org",
        qrcodeModal: QRCodeModule
    })

    if (!connector.connected) {
        connector.createSession();
    }

    connector.on("connect", withErrorCatcher(payload => {
        // this console is necessary
        console.log(`%c WalletConnect connect success ${payload}`, "color: #fff; background: green");
    }))

    connector.on("disconnect", withErrorCatcher(payload => {
        console.log(`%c WalletConnect disconnected ${payload}`, "color: #fff; background: red");
    }))
}