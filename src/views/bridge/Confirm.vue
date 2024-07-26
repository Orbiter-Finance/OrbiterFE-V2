<template>
    <div class="confirm-box">
        <CommBoxHeader
            :back="closerButton"
            :style="isMobile ? '' : 'margin-bottom:30px;'"
            >Confirm</CommBoxHeader
        >
        <div
            v-for="item in confirmData"
            :key="item.title"
            class="confirm-item"
            :style="{ marginBottom: '22px' }"
        >
            <div class="confirm-item-top-group">
                <div class="item-left">
                    <SvgIconThemed :icon="item.icon" />
                    <span class="left-txt">{{ item.title }}</span>
                    <o-tooltip placement="topLeft">
                        <template v-slot:titleDesc>
                            <span class="o-tip">{{ item.notice }}</span>
                        </template>
                        <HelpIcon v-if="item.notice" size="sm" />
                    </o-tooltip>
                </div>
                <div class="item-right">
                    <div v-if="item.isCom" >
                        <GasObSelect></GasObSelect>
                    </div>
                    <div>
                        <span v-if="item.desc" :class="`${item.lineThrough ? 'fee' : ''} ${item.tieredFee || item.discount ? 'text-decoration-line-through' : ''}`">{{ item.desc }}</span>
                        <div v-if="item.tieredFee" class="n-withholding-fee">
                            <div >{{ item.nWithholdingFee }} <span class="tiered-fee-max">(↓{{ item.tieredFee }}%)</span></div>
                        </div>
                    </div>
                    <span :style="`text-decoration: line-through;${!isMobile ? 'margin-left: 5px' : ''}`" v-if="item.lineThrough">
                        <span v-if="isMobile"><br /></span>
                        {{ item.lineThrough }}
                    </span>
                </div>
            </div>
            <div
                v-if="item.descInfo && item.descInfo.length > 0"
                class="descBottom"
            >
                <div
                    v-for="(desc, index) in item.descInfo"
                    :key="desc.no"
                    style="margin-bottom: 1rem"
                >
                    <span
                        style="
                            width: 40px;
                            display: -moz-inline-box;
                            display: inline-block;
                        "
                    >
                        {{ index === 0 ? 'Send' : '' }}
                    </span>
                    <o-tooltip v-if="desc.fromTip" placement="topLeft">
                        <template v-slot:titleDesc>
                            <span class="o-tip">{{ desc.fromTip }}</span>
                        </template>
                        <span
                            style="
                                margin-left: 0.7rem;
                                margin-right: 0.7rem;
                                color: #df2e2d;
                                width: 100px;
                                display: -moz-inline-box;
                                display: inline-block;
                                text-align: center;
                                white-space: nowrap;
                            "
                        >
                            {{ desc.from }}
                        </span>
                    </o-tooltip>
                    <span
                        v-else
                        style="
                            margin-left: 0.7rem;
                            margin-right: 0.7rem;
                            color: #df2e2d;
                            width: 100px;
                            display: -moz-inline-box;
                            display: inline-block;
                            text-align: center;
                            white-space: nowrap;
                        "
                    >
                        {{ desc.from }}
                    </span>
                    To
                    <o-tooltip placement="topLeft">
                        <template v-slot:titleDesc>
                            <span class="o-tip">{{ desc.toTip }}</span>
                        </template>
                        <span
                            style="
                                margin-left: 0.7rem;
                                color: #df2e2d;
                                width: 90px;
                                display: -moz-inline-box;
                                display: inline-block;
                                text-align: center;
                            "
                        >
                            {{ desc.to }}
                        </span>
                    </o-tooltip>
                    <span style="margin-left: 0.3rem; vertical-align: -25%">
                        <SvgIconThemed :icon="desc.icon" />
                    </span>
                </div>
            </div>
            <div
                v-if="item.haveSep"
                style="
                    border-bottom: 2px dashed rgba(0, 0, 0, 0.2);
                    height: 43px;
                "
            ></div>
        </div>
        <div
            v-if="isStarkNetChain"
            style="
                padding: 0 30px;
                display: flex;
                text-align: left;
                padding-top: 8px;
            "
        >
            <SvgIconThemed style="margin-right: 10px" icon="info" />
            <span style="color: #df2e2d; flex: 1"
                >Starknet is still in alpha version, the transaction on it maybe
                will be done in 1~2 hours. Orbiter keeps your funds safe.</span
            >
        </div>
        <div
            style="
                padding: 0 30px;
                display: flex;
                text-align: left;
                padding-top: 8px;
            "
        >
            <SvgIconThemed style="margin-right: 10px" icon="info" />
            <span style="color: #df2e2d; flex: 1"
                >Please do not modify the transaction or remove the last four
                digits on the transfer amount in your wallet as this will cause
                the transaction to fail.</span
            >
        </div>

        <CommBtn @click="RealTransfer" class="select-wallet-dialog">
            <span
                v-if="!transferLoading"
                class="wbold s16"
                style="letter-spacing: 0.1rem"
                >CONFIRM AND SEND</span
            >
            <CommLoading
                v-else
                style="margin: auto"
                loadingColor="white"
                width="2rem"
                height="2rem"
            />
        </CommBtn>
    </div>
</template>

<script>
import {
    SvgIconThemed,
    CommBoxHeader,
    CommBtn,
    HelpIcon,
    GasObSelect
} from '../../components'
import BigNumber from 'bignumber.js'
import getProceeding from '../../util/proceeding/getProceeding'
import axios from 'axios';
import {
    getTransferContract,
    getTransferGasLimit,
} from '../../util/constants/contract/getContract.js'
import transferCalculate from '../../util/transfer/transferCalculate'
import orbiterCore from '../../orbiterCore'
import util from '../../util/util'
import Middle from '../../util/middle/middle'
import { utils } from 'zksync'
import { submitSignedTransactionsBatch } from 'zksync/build/wallet'
import Web3 from 'web3'
import { WALLETCONNECT, TOKEN_POCKET_APP } from '../../util/walletsDispatchers/constants'
import { sendTransfer, sendTransferV3 } from '../../util/constants/starknet/helper';
import { getZkSyncProvider } from '../../util/zksync/zkysnc_helper'
import loopring from '../../core/actions/loopring'
import { IMXHelper } from '../../util/immutablex/imx_helper'
import { ERC20TokenType, ETHTokenType } from '@imtbl/imx-sdk'
import { CrossAddress } from '../../util/cross_address'
import { DydxHelper } from '../../util/dydx/dydx_helper'
import zkspace from '../../core/actions/zkspace'
import config from '../../core/utils/config'
import * as ethers from 'ethers'
import * as zksync2 from 'zksync-web3'
import * as zksync from 'zksync'
import walletDispatchers, {
    METAMASK
} from '../../util/walletsDispatchers/index'
import {
    walletIsLogin,
    compatibleGlobalWalletConf,
} from '../../composition/walletsResponsiveData'
import { isMobile, transferDataState, web3State, gasTokenInfo, updateGasTokenInfo, setSelectWalletDialogVisible, setConnectWalletGroupKey } from '../../composition/hooks'
import { Coin_ABI, Orbiter_V3_ABI_EVM, Orbiter_OPOOL_ABI } from '../../util/constants/contract/contract.js'
import { providers } from 'ethers'
import { XVMSwap } from '../../util/constants/contract/xvm'
import { exchangeToCoin } from '../../util/coinbase'
import { CHAIN_ID } from "../../config";
import { isBrowserApp, isProd } from "../../util";
import { zksyncEraGasTokenETH, zksyncEraGasTokenERC20, zksyncEraGasTokenContract } from "../../util/zksyncEraGasToken";
import solanaHelper from '../../util/solana/solana_helper';
import tonHelper from '../../util/ton/ton_helper';
import fuelsHelper from '../../util/fuels/fuels_helper';
import orbiterHelper from '../../util/orbiter_helper';

const {
    walletDispatchersOnSignature,
    walletDispatchersOnSwitchChain,
    walletConnectSendTransaction,
} = walletDispatchers

export default {
    name: 'Confirm',
    components: { SvgIconThemed, CommBoxHeader, CommBtn, HelpIcon, GasObSelect },
    data() {
        return {
            transferLoading: false,
            expectValue: '',
        }
    },
    computed: {
        currentWalletAddress() {
            return compatibleGlobalWalletConf.value.walletPayload.walletAddress  || web3State.coinbase
        },
        isMobile() {
            return isMobile.value
        },
        isStarkNetChain() {
            const { fromChainID, toChainID } = transferDataState
            return (
                orbiterHelper.isStarknetChain({chainId: fromChainID})||
                orbiterHelper.isStarknetChain({chainId: toChainID})
            )
        },
        isSolanaChain() {
            const { fromChainID, toChainID } = transferDataState
            return (
                orbiterHelper.isSolanaChain({chainId: fromChainID})||
                orbiterHelper.isSolanaChain({chainId: toChainID})
            )
        },
        isTonChain() {
            const { fromChainID, toChainID } = transferDataState
            return (
                orbiterHelper.isTonChain({chainId: fromChainID})||
                orbiterHelper.isTonChain({chainId: toChainID})
            )
        },
        currentFromChainID() {
            const { fromChainID } = transferDataState
            return fromChainID
        },
        gasTokenInfoValue()  { 
            return gasTokenInfo.info
        },
        confirmData() {
            const { selectMakerConfig, transferValue, fromChainID } = transferDataState

            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)

            const bridgeType1 = Number(selectMakerConfig?.bridgeType) === 1

            let symbol = chainInfo?.nativeCurrency?.symbol
             symbol = bridgeType1 ? symbol : selectMakerConfig.fromChain.symbol

             let getTradingFee = transferCalculate
                .getTradingFee()
                .toString()

                // 0.000120000000009022 to 0.000120...09022
            let realTransferAmount = transferCalculate
                .realTransferAmount()
                .toString()
            realTransferAmount = realTransferAmount.replace(
                /(.*?0)0{4,}(0.*?)/,
                '$1...$2'
            )

            realTransferAmount = bridgeType1 ? transferValue : realTransferAmount

            const originWithholdingFee = +(selectMakerConfig.originWithholdingFee || 0);
            const withholdingFee = +(selectMakerConfig.tradingFee || 0);

            const tieredFeeMax = transferCalculate.max()

            let discount = transferCalculate
                .discount()
                .toString()

            let nWithholdingFee = ethers.utils.formatEther(
                ethers.utils.parseEther(withholdingFee+"").sub(
                    ethers.utils.parseEther(discount)
                )
            )

            if(
                orbiterHelper.isTonChain({chainId: fromChainID}) || 
                orbiterHelper.isStarknetChain({chainId: fromChainID}) || 
                orbiterHelper.isSolanaChain({chainId: fromChainID})
            ) {
                realTransferAmount = ethers.utils.formatEther(
                    ethers.utils.parseEther(transferValue || "0").add(ethers.utils.parseEther(withholdingFee ? String(withholdingFee) : "0"))
                    )
            }
            
            const isGasTokenChain = (this.currentFromChainID === CHAIN_ID.zksync2)
            const comm = [
                {
                    icon: 'withholding',
                    title: 'Withholding Fee',
                    notice: 'The ‘Maker’ charges the ‘Sender’ a fixed fee to cover the fluctuating gas fees that incur when sending funds to the destination network.',
                    desc:
                        selectMakerConfig.tradingFee +
                        ' ' +
                        symbol,
                    tieredFee: tieredFeeMax,
                    nWithholdingFee: nWithholdingFee + ' ' +
                        selectMakerConfig.fromChain.symbol,
                    lineThrough: withholdingFee<originWithholdingFee?originWithholdingFee + ' ' + selectMakerConfig.fromChain.symbol : '',
                },
                {
                    icon: 'security',
                    title: 'Identification Code',
                    notice: 'In Orbiter, each transaction has a four digit identification code. The identification code can be seen at the end of the total amount being transferred as a way to identify the transaction. The identification code will be the evidence in the case that the ‘Maker’ does not send the assets to the target network. This will act as an evidence to claim your funds from the margin contract.',
                    desc: transferCalculate.safeCode(),
                    haveSep: true,
                },
                {
                    icon: 'send',
                    title: 'Total Send',
                    notice: 'Total amount sent by the ‘Sender’ including the withholding fee.',
                    desc:
                        realTransferAmount +
                        ' ' +
                        selectMakerConfig.fromChain.symbol + (bridgeType1 ? " + " +  withholdingFee +
                        ' ' +
                        symbol : ""),
                    textBold: true,
                },
                {
                    icon: 'received',
                    title: 'Received',
                    desc: this.expectValue,
                    ...(bridgeType1 ? {notice: "Token burning results in a less number of tokens received"} : {}),
                    textBold: true,
                },
                ...(isGasTokenChain ? [{
                    icon: 'gas',
                    title: 'Select Gas Token',
                    notice: 'Select Gas Token',
                    desc: "",
                    isCom: true,
                    textBold: true,
                }] : []),
                {
                    icon: 'exchange',
                    title: 'Maker Routes',
                    notice: 'After the ‘Sender’ submits the transaction, the assets are transferred to the ‘Maker’s’ address who will provide the liquidity. Orbiter’s contract will ensure the safety of the assets and will make sure that the ‘Sender’ receives the assets to the target network.',
                    descInfo: this.$store.state.confirmData.routeDescInfo,
                },
            ]
            return [...comm]
        },
        isCrossAddress() {
            const { isCrossAddress } = transferDataState
            return isCrossAddress
        },
        crossAddressReceipt() {
            const { crossAddressReceipt, toChainID } = transferDataState

            const isCheck = orbiterHelper.checkAddress({chainId: toChainID, address: crossAddressReceipt})

            if(this.isCrossAddress && isCheck) {
                return crossAddressReceipt
            } else {
                return ""
            }
        }

    },
    methods: {
        openConnectModal() {
            const { toChainID } = transferDataState
            orbiterHelper.openConnectModal({chainId: toChainID})
        },
        async toCrossAddressReceipt() {
            const { toChainID } = transferDataState
            if(this.isCrossAddress) {
              if(!!this.crossAddressReceipt || !!orbiterHelper.checkAddress({address: this.crossAddressReceipt, chainId: toChainID})) {
                return this.crossAddressReceipt
              } 
            }
            let address = ""
            if( orbiterHelper.isFuelChain({chainId: toChainID})) {
              address = fuelsHelper.fuelsAccount()
            } else  if( orbiterHelper.isTonChain({chainId: toChainID}) ) {
              address = tonHelper.account()
            } else  if(orbiterHelper.isSolanaChain({chainId: toChainID})) {
              address = solanaHelper.solanaAddress()
            } else  if(orbiterHelper.isStarknetChain({chainId: toChainID})) {
              address = this.starkAddress
            } else {
              address = this.currentWalletAddress
            }
            if(!orbiterHelper.checkAddress({chainId: toChainID, address: address})) {
              this.openConnectModal()
              return ""
            } else {
                return address
            }
        },
        async loopringWalletTransfer(rAmountValue) {
            const { selectMakerConfig, fromChainID } = transferDataState

            const from = compatibleGlobalWalletConf.value.walletPayload.walletAddress || web3State.coinbase
            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)

            const contractGroup = chainInfo?.contract || {}

            try {

            const contractList = Object.keys(contractGroup).map((key)=> {
                return ({
                    name: contractGroup[key],
                    address: key 
                })
            })

            const contractAddress = contractList?.filter((item)=> item?.name?.toLocaleLowerCase() === "OrbiterRouterV3"?.toLocaleLowerCase())[0]?.address

            if(!contractAddress) {
                this.$notify.error({
                    title: 'Not Contract, ChainId: ' + fromChainID ,
                    duration: 3000,
                })
                return
            }
            let transferHash = ""

            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            const recipient = selectMakerConfig.recipient

            const provider = new ethers.providers.Web3Provider(
                compatibleGlobalWalletConf.value.walletPayload.provider || window?.ethereum
            )
            const signer = provider.getSigner()
            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }
            const str = `t=${toAddress}`
            const transferContract = new ethers.Contract(
                    contractAddress,
                    Orbiter_V3_ABI_EVM,
                    signer
                )
                if (util.isEthTokenAddress(fromChainID, tokenAddress)) {
                    // When tokenAddress is eth
                    const res = await transferContract.transfer(
                        recipient,
                        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str)),
                        {
                            value: rAmountValue
                        })
                    transferHash = res?.hash

                } else {
                    const tokenContact = new ethers.Contract(tokenAddress, Coin_ABI, signer)

                    const allowance = await tokenContact.allowance(from, contractAddress)
                    if(!allowance.gte(rAmountValue.toString())) {
                        const approveRes = await tokenContact.approve(contractAddress, rAmountValue.toString())
                        const result = await approveRes.wait()
                    }

                    const res = await transferContract.transferToken(
                        tokenAddress,
                        recipient,
                        rAmountValue,
                        "0x"
                    )

                    transferHash = res?.hash
                }

                if (transferHash) {
                    this.onTransferSucceed(from, rAmountValue, fromChainID, transferHash)
                }
                this.transferLoading = false
            } catch (err) {
                console.error('loopringWalletTransfer error', err);
                this.transferLoading = false
                this.$notify.error({
                    title: err?.data?.message || err.message,
                    duration: 3000,
                })
            }


        },
        async BridgeType1Transfer() {
            const { selectMakerConfig, fromChainID, transferValue } = transferDataState
            const safeCode =  transferCalculate.safeCode()

            const from = compatibleGlobalWalletConf.value.walletPayload.walletAddress || web3State.coinbase

            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)
            const withholdingFee =  selectMakerConfig.tradingFee

            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            const recipient = selectMakerConfig.recipient

            const contractGroup = chainInfo?.contract || {}

            const contractList = Object.keys(contractGroup).map((key)=> {
                return ({
                    name: contractGroup[key],
                    address: key 
                })
            })

            const contractAddress = contractList?.filter((item)=> item?.name?.toLocaleLowerCase() === "OPool"?.toLocaleLowerCase())[0]?.address

            const toAddress = await this.toCrossAddressReceipt()
            const str = `c=${safeCode}&t=${toAddress}`

            if(!toAddress) {
                this.openConnectModal()
                return 
            }
            try {
                const provider = new ethers.providers.Web3Provider(
                    compatibleGlobalWalletConf.value.walletPayload.provider
                )


                const signer = provider.getSigner()

                const amount = new BigNumber(transferValue)
                .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
                const amountValue = amount.toFixed()

                const tokenContract = new ethers.Contract(
                    tokenAddress,
                    Coin_ABI,
                    signer
                )

                const allowance = await tokenContract.allowance(from, contractAddress)

                if(allowance.lt(amountValue)) {
                    const approveRes = await tokenContract.approve(contractAddress, amountValue)
                    await approveRes.wait()

                }

                const transferContract = new ethers.Contract(
                    contractAddress,
                    Orbiter_OPOOL_ABI,
                    signer
                )

                const res = await transferContract.inbox(
                        recipient,
                        tokenAddress,
                        amountValue,
                        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str)),
                        {
                            value: ethers.utils.parseUnits(String(withholdingFee), chainInfo.nativeCurrency.decimals)
                        })
                if (res.hash) {

                    this.onTransferSucceed(from, amountValue, fromChainID, res.hash)
                }

            } catch (err) {
                console.error('BridgeType1Transfer error', err);
                this.$notify.error({
                    title: err?.data?.message || err.message,
                    duration: 3000,
                })
                this.transferLoading = false
            }
        },
        async transferToNotEvm() {
            const { selectMakerConfig, fromChainID, transferValue, toChainID, fromCurrency } =
                transferDataState

            if (!walletIsLogin.value) {
                return
            }
            const from = compatibleGlobalWalletConf.value.walletPayload.walletAddress || web3State.coinbase

            let toAddress = await this.toCrossAddressReceipt()
            let isConnected = false
            if(!toAddress) {
                this.openConnectModal()
                return 
            }

            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)

            const contractGroup = chainInfo?.contract || {}

            const contractList = Object.keys(contractGroup).map((key)=> {
                return ({
                    name: contractGroup[key],
                    address: key 
                })
            })

            const contractAddress = contractList?.filter((item)=> item?.name?.toLocaleLowerCase() === "OrbiterRouterV3"?.toLocaleLowerCase())[0]?.address

            if(!contractAddress) {
                this.$notify.error({
                    title: 'Not Contract, ChainId: ' + fromChainID ,
                    duration: 3000,
                })
                return
            }

            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            const recipient = selectMakerConfig.recipient

            const safeCode =  transferCalculate.safeCode()

            const str = `t=${toAddress}`

            try {
                let transferHash = ''

                const provider = new ethers.providers.Web3Provider(
                    compatibleGlobalWalletConf.value.walletPayload.provider || window?.ethereum
                )

                const signer = provider.getSigner()

                const rAmount = new BigNumber(transferValue)
                .plus(new BigNumber(selectMakerConfig.tradingFee))
                .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
                .plus(new BigNumber(safeCode))
                const rAmountValue = rAmount.toFixed()

                const transferContract = new ethers.Contract(
                    contractAddress,
                    Orbiter_V3_ABI_EVM,
                    signer
                )

                if (util.isEthTokenAddress(fromChainID, tokenAddress)) {
                    // When tokenAddress is eth
                    const res = await transferContract.transfer(
                        recipient,
                        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str)),
                        {
                            value: rAmountValue
                        })
                    transferHash = res?.hash

                } else {
                    const tokenContact = new ethers.Contract(tokenAddress, Coin_ABI, signer)

                    const allowance = await tokenContact.allowance(from, contractAddress)
                    if(!allowance.gte(rAmount.toString())) {
                        const approveRes = await tokenContact.approve(contractAddress, rAmount.toString())
                        const result = await approveRes.wait()
                    }

                    const res = await transferContract.transferToken(
                        tokenAddress,
                        recipient,
                        rAmountValue,
                        ethers.utils.hexlify(ethers.utils.toUtf8Bytes(str))
                    )

                    transferHash = res?.hash
                }

                if (transferHash) {
                    this.onTransferSucceed(from, rAmount, fromChainID, transferHash, toChainID)
                }

            } catch (err) {
                console.error('transferToNotEvm error', err);
                this.$notify.error({
                    title: err?.data?.message || err.message,
                    duration: 3000,
                })
            }
        },
        async transferToStarkNet(value) {
            const { selectMakerConfig, fromChainID, transferExt } =
                transferDataState

            if (!walletIsLogin.value) {
                return
            }
            const { fromAddress } = transferExt
            const contractAddress = selectMakerConfig.fromChain.tokenAddress
            const recipient = selectMakerConfig.recipient
            const amount = ethers.BigNumber.from(value)
            
            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }

            const ext = {
              type: '0x03',
              value: toAddress
            }

            if (!ext?.value || util.starknetHashFormat(ext.value).length !== 66 || util.starknetHashFormat(ext.value) === "0x0000000000000000000000000000000000000000000000000000000000000000") {
                this.$notify.error({
                    title: 'please connect correct starknet wallet address',
                    duration: 3000,
                });
                return;
            }
            const error = util.getAccountAddressError(toAddress, true);
            if (error) {
                this.$notify.error({
                    title: error,
                    duration: 3000,
                });
                return;
            }
            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)
            if (!chainInfo.contracts || !chainInfo.contracts.length) {
                this.$notify.error({
                    title: 'Contract not supported temporarily',
                    duration: 3000,
                })
                return
            }

            let crossContractAddress = chainInfo.contracts[0]
            crossContractAddress = crossContractAddress?.address || crossContractAddress
            try {
                let transferHash = ''
                if (
                    compatibleGlobalWalletConf.value.walletType == WALLETCONNECT
                ) {
                    const web3 = await util.stableWeb3(fromChainID)
                    const provider = new ethers.providers.Web3Provider(
                        web3.currentProvider
                    )
                    const crossAddress = new CrossAddress(
                        provider,
                        fromChainID,
                        provider.getSigner(fromAddress),
                        crossContractAddress
                    )
                    if (util.isEthTokenAddress(fromChainID, contractAddress)) {
                        transferHash =
                             await crossAddress.wallConnTransfer(
                                recipient,
                                amount,
                                ext
                            )
                    } else {
                        transferHash =
                            await crossAddress.walletConnTransferERC20(
                                contractAddress,
                                recipient,
                                amount,
                                ext
                            )
                    }
                    if (transferHash) {
                        this.onTransferSucceed(
                            fromAddress,
                            amount,
                            fromChainID,
                            transferHash
                        )
                    }
                    return
                }
                const provider = new ethers.providers.Web3Provider(
                    compatibleGlobalWalletConf.value.walletPayload.provider
                )
                const crossAddress = new CrossAddress(
                    provider,
                    fromChainID,
                    provider.getSigner(fromAddress),
                    crossContractAddress
                )
                if (util.isEthTokenAddress(fromChainID, contractAddress)) {
                    transferHash = (
                        await crossAddress.transfer(recipient, amount, ext)
                    ).hash
                } else {
                    transferHash = (
                        await crossAddress.transferERC20(
                            contractAddress,
                            recipient,
                            amount,
                            ext
                        )
                    ).hash
                }
                if (transferHash) {
                    this.onTransferSucceed(
                        fromAddress,
                        amount,
                        fromChainID,
                        transferHash
                    )
                }
                return
            } catch (err) {
                console.error('transferToStarkNet error', err);
                this.$notify.error({
                    title: err?.data?.message || err.message,
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async zkspaceTransfer() {
            const { selectMakerConfig, fromChainID } = transferDataState
            try {
                const provider = new ethers.providers.Web3Provider(
                    compatibleGlobalWalletConf.value.walletPayload.provider
                )
                const walletAccount =
                    compatibleGlobalWalletConf.value.walletPayload.walletAddress
                const signer = provider.getSigner()
                const privateKey = await zkspace.getL1SigAndPriVateKey(signer)

                const tValue = transferCalculate.getTransferTValue()
                if (!tValue.state) {
                    this.$notify.error({
                        title: tValue.error,
                        duration: 3000,
                    })
                    this.transferLoading = false
                    return
                }
                const transferValue =
                    zksync.utils.closestPackableTransactionAmount(
                        tValue.tAmount
                    )

                const accountInfo = await zkspace.getAccountInfo(
                    fromChainID,
                    privateKey,
                    signer,
                    walletAccount
                )
                const feeTokenId = 0
                const zksNetWorkID =
                    fromChainID === CHAIN_ID.zkspace_test
                        ? 129
                        : 13

                const fee = await zkspace.getZKSpaceTransferGasFee(
                    fromChainID,
                    walletAccount
                )

                const transferFee = zksync.utils.closestPackableTransactionFee(
                    ethers.utils.parseUnits(fee.toString(), 18)
                )

                const zksTokenInfos =
                    fromChainID === CHAIN_ID.zkspace
                        ? this.$store.state.zksTokenList.mainnet
                        : this.$store.state.zksTokenList.rinkeby
                const tokenAddress = selectMakerConfig.toChain.tokenAddress
                const tokenInfo = zksTokenInfos.find(
                    (item) => item.address === tokenAddress
                )
                const { pubKey, l2SignatureOne } = zkspace.getL2SigOneAndPK(
                    privateKey,
                    accountInfo,
                    walletAccount,
                    tokenInfo ? tokenInfo.id : 0,
                    transferValue,
                    feeTokenId,
                    transferFee,
                    zksNetWorkID
                )

                const l2SignatureTwo = await zkspace.getL2SigTwoAndPK(
                    signer,
                    accountInfo,
                    transferValue,
                    fee,
                    zksNetWorkID,
                    tokenInfo
                )
                const req = {
                    signature: {
                        type: 'EthereumSignature',
                        signature: l2SignatureTwo,
                    },
                    fastProcessing: false,
                    tx: {
                        type: 'Transfer',
                        accountId: accountInfo.id,
                        from: walletAccount,
                        to: selectMakerConfig.recipient,
                        token: tokenInfo ? tokenInfo.id : 0,
                        amount: transferValue.toString(),
                        feeToken: feeTokenId,
                        fee: transferFee.toString(),
                        chainId: zksNetWorkID,
                        nonce: accountInfo.nonce,
                        signature: {
                            pubKey,
                            signature: l2SignatureOne,
                        },
                    },
                }

                const transferResult = await zkspace.sendTransfer(
                    fromChainID,
                    req
                )
                const txHash = transferResult.data?.data.replace(
                    'sync-tx:',
                    '0x'
                )

                const firstResult = await this.getFristResult(
                    fromChainID,
                    txHash
                )

                this.onTransferSucceed(
                    walletAccount,
                    tValue.tAmount.toString(),
                    fromChainID,
                    firstResult.data.tx_hash
                )
                this.transferLoading = false
            } catch (error) {
                this.transferLoading = false
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
                console.warn('zkspaceTransfer =', error.message)
            }
        },
        async getFristResult(fromChainID, txHash) {
            const firstResult = await zkspace.getZKSpaceTransactionData(
                fromChainID,
                txHash
            )
            if (
                firstResult.success &&
                !firstResult.data.fail_reason &&
                !firstResult.data.success &&
                !firstResult.data.amount
            ) {
                await util.sleep(300)
                return await this.getFristResult(fromChainID, txHash)
            } else if (
                firstResult.success &&
                !firstResult.data.fail_reason &&
                firstResult.data.success &&
                firstResult.data.amount
            ) {
                return firstResult
            } else {
                throw new Error('zks sendResult is error')
            }
        },
        async zk2Transfer() {
            const { selectMakerConfig, fromChainID } = transferDataState
            if (selectMakerConfig.fromChain.symbol !== 'ETH') {
                throw new Error('Tokens are not supported at this time');
            }
            // const isTokenLiquid = await zksync2Provider.isTokenLiquid(
            //     tokenAddress
            // )
            // if (!isTokenLiquid) {
            //     // throw new Error('the token can not be used for fee')
            // }
            const tValue = transferCalculate.getTransferTValue()
            if (!tValue.state) {
                this.$notify.error({
                    title: tValue.error,
                    duration: 3000,
                })
                this.transferLoading = false
                return
            }
            // const provider = new zksync2.Web3Provider(
            //     compatibleGlobalWalletConf.value.walletPayload.provider
            // )
            // const signer = provider.getSigner()
            // // const toAddress = '0xEFc6089224068b20197156A91D50132b2A47b908'
            // const toAddress = selectMakerConfig.recipient
            // // const amountToSend = '100000000000000'
            // const amountToSend = tValue.tAmount
            // const params = {
            //     from: compatibleGlobalWalletConf.value.walletPayload
            //         .walletAddress,
            //     txType: 0x71,
            //     customData: {
            //         feeToken: '',
            //     },
            //     to: '',
            //     value: ethers.BigNumber.from(0),
            //     data: '0x',
            // }
            // const isMainCoin =
            //     tokenAddress.toLowerCase() ===
            //     '0x000000000000000000000000000000000000800a'
            // if (!isMainCoin) {
            //     const web3 = new Web3()
            //     const tokenContract = new web3.eth.Contract(
            //         Coin_ABI,
            //         tokenAddress
            //     )
            //     params.data = tokenContract.methods
            //         .transfer(toAddress, web3.utils.toHex(amountToSend))
            //         .encodeABI()
            //     params.to = tokenAddress
            //     params.customData.feeToken = tokenAddress
            // } else {
            //     params.value = ethers.BigNumber.from(amountToSend)
            //     params.to = toAddress
            //     params.customData.feeToken =
            //         '0x0000000000000000000000000000000000000000'
            // }
            // const transferResult = await signer.sendTransaction(params)
            const provider = new zksync2.Web3Provider(compatibleGlobalWalletConf.value.walletPayload.provider);
            const signer = provider.getSigner();
            const amount = (new BigNumber(tValue.tAmount).dividedBy(10 ** 18)).toString();
            const transferResult = await signer.transfer({
                to: selectMakerConfig.recipient,
                amount: ethers.utils.parseEther(amount),
            });
            if (transferResult.hash) {
                this.onTransferSucceed(
                    web3State.coinbase,
                    tValue.tAmount,
                    fromChainID,
                    transferResult.hash
                );
            }
            this.transferLoading = false
        },
        async zkTransfer() {
            const { selectMakerConfig, fromChainID } = transferDataState
            const web3Provider = new Web3(
                compatibleGlobalWalletConf.value.walletPayload.provider
            )
            const walletAccount =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            const ethWallet = new ethers.providers.Web3Provider(
                web3Provider.currentProvider
            )
            const syncProvider = await getZkSyncProvider(fromChainID)
            try {
                const syncWallet = await zksync.Wallet.fromEthSigner(
                    ethWallet.getSigner(walletAccount),
                    syncProvider
                )
                const tValue = transferCalculate.getTransferTValue()
                if (!tValue.state) {
                    this.$notify.error({
                        title: tValue.error,
                        duration: 3000,
                    })
                    this.transferLoading = false
                    return
                }
                const amount = zksync.utils.closestPackableTransactionAmount(
                    tValue.tAmount
                )
                const transferFee = await syncProvider.getTransactionFee(
                    'Transfer',
                    syncWallet.address() || '',
                    tokenAddress
                )
                if (!(await syncWallet.isSigningKeySet())) {
                    const nonce = await syncWallet.getNonce('committed')
                    const batchBuilder = syncWallet.batchBuilder(nonce)
                    if (
                        syncWallet.ethSignerType?.verificationMethod ===
                        'ERC-1271'
                    ) {
                        const isOnchainAuthSigningKeySet =
                            await syncWallet.isOnchainAuthSigningKeySet()
                        if (!isOnchainAuthSigningKeySet) {
                            const onchainAuthTransaction =
                                await syncWallet.onchainAuthSigningKey()
                            await onchainAuthTransaction?.wait()
                        }
                    }
                    const newPubKeyHash = await syncWallet.signer.pubKeyHash()
                    const accountID = await syncWallet.getAccountId()
                    if (typeof accountID !== 'number') {
                        throw new TypeError(
                            'It is required to have a history of balances on the account to activate it.'
                        )
                    }
                    const changePubKeyMessage =
                        utils.getChangePubkeyLegacyMessage(
                            newPubKeyHash,
                            nonce,
                            accountID
                        )
                    const ethSignature = (
                        await syncWallet.getEthMessageSignature(
                            changePubKeyMessage
                        )
                    ).signature
                    const keyFee = await syncProvider.getTransactionFee(
                        {
                            ChangePubKey: { onchainPubkeyAuth: false },
                        },
                        syncWallet.address() || '',
                        tokenAddress
                    )

                    const changePubKeyTx =
                        await syncWallet.signer.signSyncChangePubKey({
                            accountId: accountID,
                            account: syncWallet.address(),
                            newPkHash: newPubKeyHash,
                            nonce,
                            ethSignature,
                            validFrom: 0,
                            validUntil: utils.MAX_TIMESTAMP,
                            fee: keyFee.totalFee,
                            feeTokenId:
                                syncWallet.provider.tokenSet.resolveTokenId(
                                    tokenAddress
                                ),
                        })
                    batchBuilder.addChangePubKey({
                        tx: changePubKeyTx,
                        // @ts-ignore
                        alreadySigned: true,
                    })
                    batchBuilder.addTransfer({
                        to: selectMakerConfig.recipient,
                        token: tokenAddress,
                        amount,
                        fee: transferFee.totalFee,
                    })
                    const batchTransactionData = await batchBuilder.build()
                    const transactions = await submitSignedTransactionsBatch(
                        syncWallet.provider,
                        batchTransactionData.txs,
                        [batchTransactionData.signature]
                    )
                    let transaction
                    for (const tx of transactions) {
                        if (tx.txData.tx.type !== 'ChangePubKey') {
                            transaction = tx
                            break
                        }
                    }
                    const transferReceipt = await transaction.awaitReceipt()
                    if (
                        transferReceipt.success &&
                        !transferReceipt.failReason
                    ) {
                        this.onTransferSucceed(
                            walletAccount,
                            amount.toString(),
                            fromChainID,
                            transaction.txHash
                        )
                    }
                    this.transferLoading = false
                } else {
                    try {
                        const transfer = await syncWallet.syncTransfer({
                            to: selectMakerConfig.recipient,
                            token: tokenAddress,
                            amount,
                        })
                        const transferReceipt = await transfer.awaitReceipt()
                        if (
                            transferReceipt.success &&
                            !transferReceipt.failReason
                        ) {
                            this.onTransferSucceed(
                                walletAccount,
                                amount.toString(),
                                fromChainID,
                                transfer.txHash
                            )
                        }
                        this.transferLoading = false
                    } catch (error) {
                        console.warn('inError =', error.message)
                        this.transferLoading = false
                        this.$notify.error({
                            title: error.message,
                            duration: 3000,
                        })
                    }
                }
            } catch (error) {
                console.warn('outError =', error.message)
                this.transferLoading = false
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
            }
        },
        async loopringTransfer() {
            const {
                selectMakerConfig,
                fromChainID,
                toChainID,
                fromCurrency
            } = transferDataState
            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            try {
                const tValue = transferCalculate.getTransferTValue()
                if (!tValue.state) {
                    this.$notify.error({
                        title: tValue.error,
                        duration: 3000,
                    })
                    this.transferLoading = false
                    return
                }
                const chainInfo = util.getV3ChainInfoByChainId(toChainID);
                if (!chainInfo) {
                    return;
                }
                const p_text = 9000 + Number(chainInfo.internalId) + '';
                const amount = tValue.tAmount
                const toAddress = await this.toCrossAddressReceipt()
                if(!toAddress) {
                    this.openConnectModal()
                    return 
                }
                let memo = `${p_text}_${toAddress}`

                if (memo.length > 128) {
                    this.$notify.error({
                        title: 'The sending address is too long',
                        duration: 3000,
                    })
                    this.transferLoading = false
                    return
                }
                try {
                    const {tokenId} = await loopring.getLpTokenInfoOnce(fromChainID, tokenAddress)
                    const response = await loopring.sendTransfer(
                        compatibleGlobalWalletConf.value.walletPayload
                            .walletAddress,
                        fromChainID,
                        selectMakerConfig.recipient,
                        0,
                        tokenAddress,
                        amount,
                        memo
                    )
                    if (response.hash && response.status === 'processing') {
                        this.onTransferSucceed(
                            compatibleGlobalWalletConf.value.walletPayload
                                .walletAddress,
                            amount,
                            fromChainID,
                            response.hash
                        )
                    }
                    this.transferLoading = false
                } catch (error) {
                    this.transferLoading = false
                    if (error.message === 'account is not activated') {
                        // const notify =
                        this.$notify({
                            type: 'error',
                            message:
                                '<div style="text-align:left;font-size: 1.4rem; color: black">This Loopring account is not yet activated, please activate it before transferring.</div>',
                            dangerouslyUseHTMLString: true,
                            duration: 8000,
                        })
                    } else if (error.message === 'User account is frozen') {
                        const notify = this.$notify({
                            type: 'error',
                            message:
                                '<div style="text-align:left;font-size: 1.4rem; color: black">Your Loopring account is frozen, please check your Loopring account status on Loopring website. Get more details <span style="color:blue;text-decoration: underline"> here </span>.</div>',
                            dangerouslyUseHTMLString: true,
                            duration: 8000,
                        })
                        notify.$el.querySelector('span').onclick = () => {
                            notify.close()
                            window.open(
                                'https://docs.loopring.io/en/basics/key_mgmt.html?h=frozen',
                                '_blank'
                            )
                        }
                    } else {
                        this.$notify.error({
                            title: error.message,
                            duration: 3000,
                        })
                    }
                }
            } catch (error) {
                console.warn('outError =', error.message)
                this.transferLoading = false
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
            }
        },
        async ethTransfer(value) {
            const { selectMakerConfig, fromChainID } = transferDataState
            const selectChainID = selectMakerConfig?.fromChain?.chainId
            const from =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
            const matchSignatureDispatcher =
                walletDispatchersOnSignature[
                    compatibleGlobalWalletConf.value.walletType
                ]
            if (matchSignatureDispatcher) {
                matchSignatureDispatcher(
                    from,
                    selectMakerConfig,
                    value,
                    fromChainID,
                    this.onTransferSucceed
                )
                return
            }

            if (!walletIsLogin.value) {
                this.transferLoading = false
                return
            }

            try {

                const provider =
                    compatibleGlobalWalletConf.value.walletPayload.provider
                const web3 = new Web3(provider || window.ethereum ||  window.coin98?.provider)

                let gasLimit = await getTransferGasLimit(
                    fromChainID,
                    selectMakerConfig,
                    from,
                    selectMakerConfig.recipient,
                    value,
                    provider
                )
                if (fromChainID === 2 && !!Number(gasLimit) && gasLimit < 21000) {
                    gasLimit = 21000
                }
                const eprovider = new providers.Web3Provider(
                    web3.currentProvider
                )
                const signer = eprovider.getSigner()
                try {
                    const windowChain = +(window?.ethereum?.chainId)
                    if(windowChain) {
                        if(Number(selectChainID) !== windowChain) {
                            this.$notify.warning({
                                title: "The current wallet connection network is inconsistent with the sending transaction network",
                                duration: 3000,
                            })
                        }
                    }
                } catch (error) {
                    this.$notify.warning({
                        title: error?.message ? String(error?.message) : String(error),
                        duration: 3000,
                    })
                }
                signer
                  .sendTransaction({
                        from,
                        to: selectMakerConfig.recipient,
                        value,
                        ...(Number(gasLimit) ? {gasLimit} : {}),
                    })
                    .then((res) => {
                        // event 
                        try {
                            this.$gtag.event('click', {
                            'event_category': 'Transfer',
                            'event_label': selectMakerConfig.recipient.toLocaleLowerCase(),
                            'userAddress':from.toLocaleLowerCase(), 
                            'hash': res.hash, 
                            })
                        }catch(error) {

                        }
     
                        this.transferLoading = false
                        this.onTransferSucceed(
                            from,
                            value,
                            fromChainID,
                            res.hash
                        )
                    })
                    .catch((err) => {
                        this.transferLoading = false
                        this.$notify.error({
                            title: err.message,
                            duration: 3000,
                        })
                    })
            } catch (error) {
                console.error(error)
            }
        },
        async solanaTransfer(value) {
            const { selectMakerConfig, fromChainID, toChainID, transferValue } =
                transferDataState

                const isConnected = await solanaHelper.isConnect()
                let from = solanaHelper.solanaAddress()

            if (!isConnected || !from) {
                setSelectWalletDialogVisible(true)
                setConnectWalletGroupKey("SOLANA")
                this.transferLoading = false
                return
            }

            // const evmAddress = compatibleGlobalWalletConf.value.walletPayload.walletAddress

            // let targetAddress = evmAddress

            const safeCode =  transferCalculate.safeCode()

            const { starkNetAddress, starkChain } = web3State.starkNet

            const rAmount = new BigNumber(transferValue)
              .plus(new BigNumber(selectMakerConfig.tradingFee))
              .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
            const rAmountValue = rAmount.toFixed()

            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }

            try {
                const tokenAddress = selectMakerConfig.fromChain.tokenAddress

                const hash = await solanaHelper.transfer({
                    from: from,
                    to: selectMakerConfig.recipient,
                    tokenAddress,
                    targetAddress: toAddress,
                    amount: rAmountValue,
                    safeCode
                })
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer',
                    'event_label': selectMakerConfig.recipient,
                    'userAddress': from, 
                    'hash': hash 
                    })
                }catch(error) {
                  console.error('click error', error);
                }
     
                if (hash) {
                    this.onTransferSucceed(from, value, fromChainID, hash)
                }
            } catch (error) {
              console.error('transfer error', error);
                this.$notify.error({
                    title: error.message || String(error),
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async tonTransfer(value) {
            const { selectMakerConfig, fromChainID, toChainID, transferValue } =
                transferDataState

                const isConnected = await tonHelper.isConnected()
                let from = await tonHelper.account()

            if (!isConnected || !from) {
                await tonHelper.connect()
                this.transferLoading = false
                return
            }

            const safeCode =  transferCalculate.safeCode()

            const { starkNetAddress, starkChain } = web3State.starkNet

            const rAmount = new BigNumber(transferValue)
              .plus(new BigNumber(selectMakerConfig.tradingFee))
              .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
            const rAmountValue = rAmount.toFixed()

            // const evmAddress = compatibleGlobalWalletConf.value.walletPayload.walletAddress

            // let targetAddress = evmAddress

            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }
            
           
            try {
                const tokenAddress = selectMakerConfig.fromChain.tokenAddress

                const hash = await tonHelper.transfer({
                    from,
                    to: selectMakerConfig.recipient,
                    tokenAddress,
                    targetAddress: toAddress,
                    amount: rAmountValue,
                    safeCode
                })
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer',
                    'event_label': selectMakerConfig.recipient,
                    'userAddress': from, 
                    'hash': hash 
                    })
                }catch(error) {
                  console.error('click error', error);
                }
     
                if (hash) {
                    this.onTransferSucceed(from, value, fromChainID, hash)
                }
            } catch (error) {
              console.error('transfer error', error);
                this.$notify.error({
                    title: error.message || String(error),
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async fuelTransfer(value) {
            console.log("value", value)
            const { selectMakerConfig, fromChainID, toChainID, transferValue } =
                transferDataState

                const isConnected = fuelsHelper.isConnected()
                let from = fuelsHelper.fuelsAccount()

            if (!isConnected || !from) {
                await fuelsHelper.connect()
                this.transferLoading = false
                return
            }

            const safeCode = transferCalculate.safeCode()

            const { starkNetAddress, starkChain } = web3State.starkNet

            const rAmount = new BigNumber(transferValue)
              .plus(new BigNumber(selectMakerConfig.tradingFee))
              .multipliedBy(new BigNumber(10 ** selectMakerConfig.fromChain.decimals))
            const rAmountValue = rAmount.toFixed()

            const evmAddress = compatibleGlobalWalletConf.value.walletPayload.walletAddress

            let targetAddress = evmAddress
            
            if (
                orbiterHelper.isStarknetChain({chainId: toChainID})
            ) {

                targetAddress = starkNetAddress

                if (!starkChain || (isProd() && starkChain === 'unlogin')) {
                    util.showMessage('please connect Starknet Wallet', 'error')
                    this.transferLoading = false
                    return
                }

                if (!starkNetAddress) {
                    setSelectWalletDialogVisible(true)
                    setConnectWalletGroupKey("STARKNET")
                    this.transferLoading = false
                    return;
                }
            }

            if( orbiterHelper.isTonChain({chainId: toChainID})) {
                targetAddress = tonHelper.account()
                const isConnected = await tonHelper.isConnected()

                if(!targetAddress || !isConnected) {
                    await tonHelper.connect()
                    return
                }
            }

            if (
                orbiterHelper.isSolanaChain({chainId: toChainID})
            ) {

                const solanaAddress = solanaHelper.solanaAddress()
                const isConnect = solanaHelper.isConnect()

                targetAddress = solanaAddress

                if (!solanaAddress || !isConnect) {
                    setSelectWalletDialogVisible(true)
                    setConnectWalletGroupKey("SOLANA")
                    this.transferLoading = false
                    return;
                }
            }
            try {
                const tokenAddress = selectMakerConfig.fromChain.tokenAddress

                const hash = await fuelsHelper.transfer({
                    from,
                    to: selectMakerConfig.recipient,
                    tokenAddress,
                    targetAddress,
                    amount: rAmountValue,
                    safeCode,
                    chainId:fromChainID
                })
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer',
                    'event_label': selectMakerConfig.recipient,
                    'userAddress': from, 
                    'hash': hash 
                    })
                }catch(error) {
                  console.error('click error', error);
                }
     
                if (hash) {
                    this.onTransferSucceed(from, value, fromChainID, hash)
                }
            } catch (error) {
              console.error('transfer error', error);
                this.$notify.error({
                    title: error.message || String(error),
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async starknetTransfer(value) {
            const { selectMakerConfig, fromChainID, toChainID, fromCurrency, transferValue } =
                transferDataState
            // let from = '';
            let tokenAddress = selectMakerConfig.fromChain.tokenAddress

            if (
                orbiterHelper.isStarknetChain({chainId: fromChainID}) || 
                orbiterHelper.isStarknetChain({chainId: toChainID})
            ) {
                let { starkChain } = web3State.starkNet
                starkChain = +starkChain ? +starkChain : starkChain
                if (!starkChain || (isProd() && starkChain === 'unlogin')) {
                    util.showMessage('please connect Starknet Wallet', 'error')
                    this.transferLoading = false
                    return
                }
                if (
                    (fromChainID === CHAIN_ID.starknet || toChainID === CHAIN_ID.starknet) &&
                    (starkChain === CHAIN_ID.starknet_test || starkChain === 'localhost')
                ) {
                    util.showMessage(
                        'please switch Starknet Wallet to mainnet',
                        'error'
                    )
                    this.transferLoading = false
                    return
                }
                if (
                    (fromChainID === CHAIN_ID.starknet_test || toChainID === CHAIN_ID.starknet_test) &&
                    (starkChain === CHAIN_ID.starknet || starkChain === 'localhost')
                ) {
                    util.showMessage(
                        'please switch Starknet Wallet to testNet',
                        'error'
                    )
                    this.transferLoading = false
                    return
                }
            }

            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }
            

            if(orbiterHelper.isSolanaChain({chainId :toChainID}) || orbiterHelper.isTonChain({chainId: toChainID}) || orbiterHelper.isFuelChain({chainId: toChainID})){

                const hash = await sendTransferV3({
                    targetAddress: toAddress,
                    tokenAddress,
                    makerAddress: selectMakerConfig.recipient,
                    amount: new BigNumber(value),
                    chainID: fromChainID,
                })
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer',
                    'event_label': selectMakerConfig.recipient.toLocaleLowerCase(),
                    'userAddress':toAddress, 
                    'hash': hash 
                    })
                }catch(error) {
                  console.error('click error', error);
                }
     
                if (hash) {
                    this.onTransferSucceed(toAddress, value, fromChainID, hash)
                }
                this.transferLoading = false
                return
            }
            if (!walletIsLogin.value) {
                this.transferLoading = false
                return
            }
            // from =
            //     compatibleGlobalWalletConf.value.walletPayload.walletAddress
            // if (isBrowserApp()) {
            //     from = transferDataState.crossAddressReceipt;
            // }
            // if (!from || !(new RegExp(/^0x[a-fA-F0-9]{40}$/)).test(from) || from === "0x0000000000000000000000000000000000000000") {
            //     util.showMessage('please connect correct evm wallet address', 'error');
            //     this.transferLoading = false
            //     return;
            // }
            if (selectMakerConfig.recipient.length < 60) {
                util.showMessage('The StarkNet network transaction maintenance, please try again later', 'error');
                this.transferLoading = false
                return;
            }
            
            try {
                const hash = await sendTransfer(
                    toAddress,
                    tokenAddress,
                    selectMakerConfig.recipient,
                    new BigNumber(value),
                    fromChainID
                )
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer',
                    'event_label': selectMakerConfig.recipient.toLocaleLowerCase(),
                    'userAddress':toAddress.toLocaleLowerCase(), 
                    'hash': hash 
                    })
                }catch(error) {
                  console.error('click error', error);
                }
     
                if (hash) {
                    this.onTransferSucceed(toAddress, value, fromChainID, hash)
                }
            } catch (error) {
              console.error('transfer error', error);
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
            
        },
        async imxTransfer(value) {
            const { selectMakerConfig, fromChainID } = transferDataState
            if (!walletIsLogin.value) {
                this.transferLoading = false
                return
            }
            const from =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
            try {
                const contractAddress = selectMakerConfig.fromChain.tokenAddress

                const imxHelper = new IMXHelper(fromChainID)
                const imxClient = await imxHelper.getImmutableXClient(
                    from,
                    true
                )

                let tokenInfo = {
                    type: ETHTokenType.ETH,
                    data: {
                        decimals: selectMakerConfig.fromChain.decimals,
                    },
                }
                if (!util.isEthTokenAddress(fromChainID, contractAddress)) {
                    tokenInfo = {
                        type: ERC20TokenType.ERC20,
                        data: {
                            symbol: selectMakerConfig.fromChain.symbol,
                            decimals: selectMakerConfig.fromChain.decimals,
                            tokenAddress: contractAddress,
                        },
                    }
                }
                const resp = await imxClient.transfer({
                    sender: from,
                    token: tokenInfo,
                    quantity: ethers.BigNumber.from(value),
                    receiver: selectMakerConfig.recipient,
                })

                this.onTransferSucceed(
                    from,
                    value,
                    fromChainID,
                    resp.transfer_id
                )
            } catch (error) {
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async dydxTransfer(value) {
            const { selectMakerConfig, fromChainID } = transferDataState
            if (!walletIsLogin.value) {
                this.transferLoading = false
                return
            }
            const from =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress
            try {
                const dydxHelper = new DydxHelper(
                    fromChainID,
                    new Web3(
                        compatibleGlobalWalletConf.value.walletPayload.provider
                    ),
                    'MetaMask'
                )
                const dydxMakerInfo = dydxHelper.getMakerInfo(
                    selectMakerConfig.recipient
                )
                const dydxClient = await dydxHelper.getDydxClient(
                    from,
                    false,
                    true
                )
                const dydxAccount = await dydxHelper.getAccount(from)

                const params = {
                    clientId: dydxHelper.generateClientId(from),
                    amount: new BigNumber(value).dividedBy(10 ** 6).toString(), // Only usdc now!
                    expiration: new Date(
                        new Date().getTime() + 86400000 * 30
                    ).toISOString(),
                    receiverAccountId: dydxHelper.getAccountId(
                        selectMakerConfig.recipient
                    ),
                    receiverPublicKey: dydxMakerInfo.starkKey,
                    receiverPositionId: String(dydxMakerInfo.positionId),
                }
                const resp = await dydxClient.private.createTransfer(
                    params,
                    dydxAccount.positionId
                )

                this.onTransferSucceed(
                    from,
                    value,
                    fromChainID,
                    resp.transfer.id
                )
            } catch (error) {
                console.error(error)
                this.$notify.error({
                    title: error.message,
                    duration: 3000,
                })
            } finally {
                this.transferLoading = false
            }
        },
        async handleXVMContract() {
            const {
                fromChainID,
                selectMakerConfig,
            } = transferDataState
            const account =
                compatibleGlobalWalletConf.value.walletPayload.walletAddress

            if (!walletIsLogin.value) {
                return
            }

            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }

            const amount = util.getRealTransferValue()
            const matchSignatureDispatcher =
                walletDispatchersOnSignature[
                    compatibleGlobalWalletConf.value.walletType
                ]
            if (matchSignatureDispatcher) {
                matchSignatureDispatcher(
                    account,
                    selectMakerConfig,
                    amount,
                    fromChainID,
                    this.onTransferSucceed
                )
                return
            }

            const chainInfo = util.getV3ChainInfoByChainId(fromChainID)
            const contractAddress = chainInfo.xvmList[0]
            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            // approve
            if (!util.isEthTokenAddress(fromChainID, tokenAddress)) {
                if (
                    compatibleGlobalWalletConf.value.walletType ===
                    WALLETCONNECT
                ) {
                    const web3 = await util.stableWeb3(fromChainID)
                    const provider = new ethers.providers.Web3Provider(
                        web3.currentProvider
                    )
                    const crossAddress = new CrossAddress(
                        provider,
                        fromChainID,
                        provider.getSigner(account)
                    )
                    await crossAddress.contractApprove(
                        tokenAddress,
                        contractAddress,
                        ethers.BigNumber.from(amount)
                    )
                } else {
                    const provider = new ethers.providers.Web3Provider(
                        compatibleGlobalWalletConf.value.walletPayload.provider
                    )
                    const crossAddress = new CrossAddress(provider, fromChainID)
                    await crossAddress.contractApprove(
                        tokenAddress,
                        contractAddress,
                        ethers.BigNumber.from(amount)
                    )
                }
            }

            try {
                const provider =
                    compatibleGlobalWalletConf.value.walletPayload.provider
                const { transactionHash } = await XVMSwap(
                    provider,
                    contractAddress,
                    account,
                    selectMakerConfig.recipient,
                    amount,
                    toAddress
                )
                try {
                    this.$gtag.event('click', {
                    'event_category': 'Transfer-XVM',
                    'event_label': selectMakerConfig.recipient.toLocaleLowerCase(),
                    'userAddress':account.toLocaleLowerCase(), 
                    'hash': transactionHash
                    })
                }catch(error) {

                }

                if (transactionHash) {
                    this.onTransferSucceed(
                        account,
                        amount,
                        fromChainID,
                        transactionHash
                    )
                }
            } catch (e) {
                console.error(e)
                this.$notify.error({
                    title: e.message,
                    duration: 3000,
                })
            }
        },
        async zksync2GasToken () {
            
            const account =
                    compatibleGlobalWalletConf.value.walletPayload.walletAddress
            const { fromChainID, selectMakerConfig, toChainID } = transferDataState
            const tokenAddress = selectMakerConfig.fromChain.tokenAddress
            const to = selectMakerConfig.recipient
            const tValue = transferCalculate.getTransferTValue()                                 

            const toAddress = await this.toCrossAddressReceipt()
            if(!toAddress) {
                this.openConnectModal()
                return 
            }

            try {
                if(toAddress) {
                    await zksyncEraGasTokenContract({account, fromChainID, to, amount: tValue.tAmount, tokenAddress, onTransferSucceed: this.onTransferSucceed, toAddress })
                }else if (util.isEthTokenAddress(fromChainID, tokenAddress)) {
                // When tokenAddress is eth
                    await zksyncEraGasTokenETH({account, fromChainID, to, amount: tValue.tAmount,onTransferSucceed: this.onTransferSucceed})
                }  else {
                    await zksyncEraGasTokenERC20({account, fromChainID, to, amount: tValue.tAmount, tokenAddress, onTransferSucceed: this.onTransferSucceed})
                }
                updateGasTokenInfo({})
            } catch (error) {
                
                this.$notify.error({
                    title: error?.data?.message || error?.message || "ERROR",
                    duration: 3000,
                })
            }
            this.transferLoading = false
        },
        async RealTransfer() {
            if (!walletIsLogin.value) {
                Middle.$emit('connectWallet', true)
                return
            }
            if (!await util.isLegalAddress()) {
                this.$notify.error({
                    title: `Contract address is not supported, please use EVM address.`,
                    duration: 3000,
                });
                return;
            }
            const { fromChainID, toChainID, selectMakerConfig, isCrossAddress } =
                transferDataState

            const bridgeType1 = Number(selectMakerConfig?.bridgeType) === 1

            if (!orbiterHelper.isNotEVMChain({chainId: fromChainID})) {
                if (
                    compatibleGlobalWalletConf.value.walletPayload.networkId.toString() !==
                    util.getMetaMaskNetworkId(fromChainID).toString()
                ) {
                    // if (
                    //     [METAMASK, WALLETCONNECT, TOKEN_POCKET_APP].includes(compatibleGlobalWalletConf.value.walletType)
                    // ) {
                        try {
                            if (
                                !(await util.ensureWalletNetwork(fromChainID))
                            ) {
                                return
                            }
                        } catch (err) {
                            try {
                                const matchAddChainDispatcher =
                                    walletDispatchersOnSwitchChain[
                                        compatibleGlobalWalletConf.value.walletType
                                    ]
                                if (matchAddChainDispatcher) {
                                    matchAddChainDispatcher(
                                        compatibleGlobalWalletConf.value.walletPayload
                                        .provider
                                    )
                                    return
                                }
                            } catch (error) {
                                util.showMessage(err.message, 'error')
                                return
                            }
                        }
                    // } else {
                        
                    // }
                }
            }

            // Only one
            if (this.transferLoading) {
                return
            }

            this.transferLoading = true

            if (fromChainID === CHAIN_ID.zksync || fromChainID === CHAIN_ID.zksync_test) {
                this.zkTransfer()
            } else if (fromChainID === CHAIN_ID.loopring || fromChainID === CHAIN_ID.loopring_test) {
                this.loopringTransfer()
            } else if (fromChainID === CHAIN_ID.zkspace || fromChainID === CHAIN_ID.zkspace_test) {
                this.zkspaceTransfer()
            } else {
                const tokenAddress = selectMakerConfig.fromChain.tokenAddress
                const to = selectMakerConfig.recipient
                const tValue = transferCalculate.getTransferTValue()
                if (!tValue.state) {
                    this.$notify.error({
                        title: tValue.error,
                        duration: 3000,
                    })
                    this.transferLoading = false
                    return
                }

                if(bridgeType1) {
                    this.BridgeType1Transfer()
                    return 
                }

                if (orbiterHelper.isSolanaChain({chainId: fromChainID})) {
                    this.solanaTransfer(tValue.tAmount)
                    return 
                }

                if (orbiterHelper.isFuelChain({chainId: fromChainID})) {
                    this.fuelTransfer(tValue.tAmount)
                    return 
                }

                if (orbiterHelper.isTonChain({chainId: fromChainID})) {
                    this.tonTransfer(tValue.tAmount)
                    return 
                }

                const account =
                    compatibleGlobalWalletConf.value.walletPayload.walletAddress

                if (orbiterHelper.isStarknetChain({chainId: fromChainID})) {
                    this.starknetTransfer(tValue.tAmount)
                    return
                }

                if ((fromChainID === CHAIN_ID.zksync2) &&  this.gasTokenInfoValue.value && (this.gasTokenInfoValue.value !== "ETH")) {
                    this.zksync2GasToken()
                    return
                }

                if (orbiterHelper.isNotEVMChain({chainId: toChainID})) {
                    await this.transferToNotEvm()
                    this.transferLoading = false
                    return
                }

                if (orbiterHelper.isStarknetChain({chainId: toChainID})) {
                    this.transferToStarkNet(tValue.tAmount)
                    return
                }

                if (fromChainID === CHAIN_ID.imx || fromChainID === CHAIN_ID.imx_test) {
                    this.imxTransfer(tValue.tAmount)
                    return
                }

                if (fromChainID === CHAIN_ID.dydx || fromChainID === CHAIN_ID.dydx_test) {
                    this.dydxTransfer(tValue.tAmount)
                    return
                }
                
                //EVM AA address
                if(window.ethereum?.isLoopring) {
                    this.loopringWalletTransfer(tValue.tAmount)
                    return
                }

                // EVM contract
                if (util.isExecuteXVMContract()) {
                    this.transferLoading = true
                    await this.handleXVMContract()
                    this.transferLoading = false
                    return
                }

                 // EVM V3 contract
                 if (isCrossAddress) {
                    this.transferLoading = true
                    await this.transferToSolanaOrTon()
                    this.transferLoading = false
                    return
                }

                if (util.isEthTokenAddress(fromChainID, tokenAddress)) {
                    // When tokenAddress is eth
                    this.ethTransfer(tValue.tAmount)
                } else {
                    // When tokenAddress is erc20
                    if (
                        compatibleGlobalWalletConf.value.walletType ===
                        WALLETCONNECT
                    ) {
                        const web3 = new Web3()
                        const tokenContract = new web3.eth.Contract(
                            Coin_ABI,
                            tokenAddress
                        )
                        const tokenTransferData = await tokenContract.methods
                            .transfer(to, web3.utils.toHex(tValue.tAmount))
                            .encodeABI()
                        return walletConnectSendTransaction(
                            fromChainID,
                            account,
                            tokenAddress,
                            0,
                            tokenTransferData
                        ).then((hash) => {
                            this.onTransferSucceed(
                                account,
                                tValue.tAmount,
                                fromChainID,
                                hash
                            )
                        })
                    }
                    const transferContract = getTransferContract(
                        fromChainID,
                        tokenAddress
                    )
                    if (!transferContract) {
                        this.$notify.error({
                            title: 'Failed to obtain contract information, please refresh and try again',
                            duration: 3000,
                        })
                        return
                    }

                    let gasLimit = await getTransferGasLimit(
                        fromChainID,
                        selectMakerConfig,
                        account,
                        to,
                        tValue.tAmount
                    )
                    if (String(fromChainID) === "42161" && !!Number(gasLimit) && gasLimit < 21000) {
                        gasLimit = 21000
                    }
                    const objOption = { from: account, ...(Number(gasLimit) ? {gas: gasLimit} : {}) }

                    const selectChainID = selectMakerConfig?.fromChain?.chainId
                    try {
                        const windowChain = +(window?.ethereum?.chainId)
                        if(windowChain) {
                            if(Number(selectChainID) !== windowChain) {
                                this.$notify.warning({
                                    title: "The current wallet connection network is inconsistent with the sending transaction network",
                                    duration: 3000,
                                })
                            }
                        }
                    } catch (error) {
                        this.$notify.warning({
                            title: error?.message ? String(error?.message) : String(error),
                            duration: 3000,
                        })
                    }
                    transferContract.methods
                        .transfer(to, tValue.tAmount)
                        .send(objOption, (error, transactionHash) => {
                            this.transferLoading = false
                            if (!error) {
                                this.onTransferSucceed(
                                    account,
                                    tValue.tAmount,
                                    fromChainID,
                                    transactionHash
                                )
                            this.transferLoading = false

                        } else {
                                this.$notify.error({
                                    title: error.message,
                                    duration: 3000,
                                })
                            }
                        })
                }
            }

            this.transferLoading = false

        },
        onTransferSucceed(from, amount, fromChainID, transactionHash, toChainID) {
            const { selectMakerConfig } = transferDataState
            const { path, query } = this.$route;
            if (process.env['VUE_APP_SDK_URL']) {
                try {
                    axios.post(`${process.env['VUE_APP_SDK_URL']}/dealer/report/tx`, {
                        chainId:fromChainID,
                        hash: transactionHash,
                        channel: (query.dealerId || '').toLocaleLowerCase(),
                        description: JSON.stringify({value: amount, from})
                    })
                }catch(error) {

                }
            }
           
            getProceeding.UserTransferReady(
                from,
                selectMakerConfig.recipient,
                amount,
                fromChainID,
                transactionHash,
                !!selectMakerConfig.ebcId,
                toChainID
            )

            // Immutablex's identifier is not a hash
            let title = transactionHash
            if (fromChainID === CHAIN_ID.imx || fromChainID === CHAIN_ID.imx_test) {
                title = 'TransferId: ' + title
            }
            this.$notify.success({
                title,
                duration: 3000,
            })
            this.$emit('stateChanged', '3')
        },
        closerButton() {
            this.$emit('stateChanged', '1')
        },
    },
    async mounted() {
        const { selectMakerConfig, transferValue } = transferDataState
        const { fromChain, toChain } = selectMakerConfig
        
        if (selectMakerConfig.ebcId && transferDataState.ebcValue) {
            this.expectValue = `${ transferDataState.ebcValue } ${ selectMakerConfig.fromChain.symbol }`;
            return;
        }
        // st

        const slippage = selectMakerConfig.slippage;
        const bridgeType = selectMakerConfig.bridgeType

        const amount = orbiterCore.getToAmountFromUserAmount(
            new BigNumber(transferValue).plus(
                new BigNumber(selectMakerConfig.tradingFee)
            ),
            selectMakerConfig,
            false
        )

        //xvm
        if (util.isExecuteXVMContract()) {
            const fromCurrency = fromChain.symbol
            const toCurrency = toChain.symbol
            if (fromCurrency !== toCurrency) {
                const decimal =  toChain.decimals === 8 ? 6 : toChain.decimals === 18 ? 5 : 3
                const highValue = (
                    await exchangeToCoin(amount, fromCurrency, toCurrency)
                ).toFixed(decimal)
                const lowerValue = new BigNumber(highValue)
                    .multipliedBy(1 - slippage / 10000)
                    .toFixed(decimal)
                this.expectValue = `${lowerValue} ~ ${highValue} ${toCurrency}`
            } else {
                this.expectValue = `${amount} ${toCurrency}`
            }
        } else if (Number(bridgeType) === 1) {
            const toValue = amount.multipliedBy(1 - slippage / 10000);
            this.expectValue = `${toValue} ${selectMakerConfig.fromChain.symbol}`

        } else {
            this.expectValue = `${amount} ${selectMakerConfig.fromChain.symbol}`
        }
    },
}
</script>

<style scoped lang="scss">
.app {
    .confirm-box {
        width: 480px;
        padding-bottom: 20px;
        .confirm-item {
            margin: 22px 0 0;
        }
    }
    .select-wallet-dialog {
        width: 420px;
    }
}
.fee {
    font-weight: 700;
    color: #df2e2d;
}
.dark-theme {
    .fee {
        color: #eeeeee;
    }
}
.text-decoration-line-through {
    font-style: oblique 40deg;
    text-decoration: line-through;
}
.app-mobile {
    .confirm-box {
        width: 100%;
        // height: calc(100% - );
        height: 100%;
        padding: 0 20px;
        .confirm-item {
            margin: 12px 0 0;
        }
    }
    .select-wallet-dialog {
        width: 100%;
    }
}
.confirm-box {
    font-family: 'Inter Regular';
    border-radius: 20px;
    font-weight: 400;
    font-size: 14px;
    line-height: 20px;
    .confirm-item {
        padding: 0 30px;
        .confirm-item-top-group {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        .item-left {
            display: flex;
            align-items: center;
            .left-txt {
                margin: 0 10px 0 8px;
            }
        }
        .item-right {
            flex: 1;
            display: flex;
            justify-content: flex-end;
            align-content: center;
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            text-align: right;
            .textBold {
                font-weight: 600;
            }

            .n-withholding-fee {
                margin-top: -8px;

                .tiered-fee-max {
                    margin-top: -8px;
                    font-size: 12px;
                    color: #df2e2d;
                    font-weight: 700;
                }
                .tiered-fee-discount {
                    margin-top: -8px;
                    font-size: 12px;
                    color: #3183ff;
                    font-weight: 700;
                }
            }

            
        }

        .descBottom {
            max-height: 9.2rem;
            // overflow-y: scroll;
            text-align: center;
            clear: both;
            padding-top: 20px;
        }
    }
    .select-wallet-dialog {
        font-family: 'Inter Bold';
        margin-top: 20px;
        height: 50px;
        line-height: 34px;
        background: linear-gradient(90.46deg, #eb382d 4.07%, #bc3035 98.55%);
    }
}
.o-tip {
    padding-right: 15px;
}
</style>
