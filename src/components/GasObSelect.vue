<template>
  <div ref="ctx" class="ob-select-box" @click="showSelectDialog">
    <slot class="prfix" name="prefix">
      <template v-if="!!selectedItem">
        <svg-icon
          class="select-item-icon"
          :iconName="selectedItem.icon"
        ></svg-icon>
      </template>
    </slot>
    <span class="selected-label">{{
      (dataList.find((v) => v.value == selectedItem.value) || {}).label || ''
    }}</span>
    <SvgIconThemed />
    <div
      ref="dialog"
      class="dialog"
      :style="{ display: dialogVisible ? 'block' : 'none' }"
    >
      <div
        v-for="item in dataList"
        @click="selectItem(item)"
        :key="item.value"
        :class="[
          'select-item',
          { disabled: !item.isSelect },
          { selected: item.value == selectedItem.value },
        ]"
      >
        <div class="select-item-group">
          <div class="select-item-symbol">
            <template v-if="item.icon">
              <svg-icon
                class="select-item-icon"
                :iconName="item.icon"
              ></svg-icon>
            </template>
            <span>{{ item.label }}</span>
          </div>
          <div class="select-item-amount">{{ item.amount }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import transferCalculate from '../util/transfer/transferCalculate'

import {
  isMobile,
  web3State,
  transferDataState,
  gasTokenInfo,
  updateGasTokenInfo,
} from '../composition/hooks'
import { compatibleGlobalWalletConf } from '../composition/walletsResponsiveData'
import { SvgIconThemed } from './'
import config, { CHAIN_ID } from '../config'
import { decimalNum } from '../util/decimalNum'
import { Web3Provider, Contract } from 'zksync-web3'
import { PAYMASTER_ABI } from '../util/constants/contract/contract'
import { ethers } from 'ethers'
import { PAYMASTER_ADDRESS } from '../util/zksyncEraGasToken'
import { Coin_ABI } from '../util/constants/contract/contract'
import util from '../util/util'

const chain = config.chain

export default {
  name: 'GasObSelect',
  components: { SvgIconThemed },
  props: {},
  data() {
    return {
      dialogVisible: false,
      amount: {},
      minAmountFee: {},
    }
  },
  computed: {
    currentWalletAddress() {
      return compatibleGlobalWalletConf.value.walletPayload.walletAddress || web3State.coinbase
    },
    dataList() {
      const zksync2Token = chain.filter(
        (item) => item.chainId === CHAIN_ID.zksync2
      )[0]

      const zksync2TokenList = zksync2Token
        ? [zksync2Token.nativeCurrency, ...zksync2Token.tokens]
        : []

      let list = []

      if (transferDataState.fromChainID === CHAIN_ID.zksync2) {
        list = zksync2TokenList.concat([{
          symbol: "HOLD",
          address: "0xed4040fD47629e7c8FBB7DA76bb50B3e7695F0f2",
          decimals: 18
        }])
      }

      list = list.map((item) => ({
        amount: 0,
        icon: item.symbol,
        label: item.symbol,
        value: item.symbol,
        iconType: 'img',
        decimals: item.decimals,
        address: item.address,
        amount: this.amount[item.symbol],
        minAmountFee: this.minAmountFee[item.symbol],
        isSelect:
          (ethers.utils
            .parseEther(this.minAmountFee[item.symbol] || '0')
            .gt('0') ||
            item.symbol === 'ETH') &&
          ethers.utils
            .parseEther(this.amount[item.symbol] || '0')
            .gte(
              ethers.utils.parseEther(this.minAmountFee[item.symbol] || '0')
            ),
      }))
      return list
    },
    gasTokenInfoValue() {
      return gasTokenInfo.info
    },
    selectedItem() {
      const value = this.gasTokenInfoValue?.value || ''
      return (
        this.dataList.filter((item) => item.value === (value || 'ETH'))[0] ||
        this.dataList[0]
      )
    },
    isMobile() {
      return isMobile.value
    },
  },
  methods: {
    async getMinAmount(gasTokenAddress) {
      const address = this.currentWalletAddress
      const { selectMakerConfig } = transferDataState
      const tValue = transferCalculate.getTransferTValue()
      const coinAddress = selectMakerConfig.fromChain.tokenAddress

      const toAddress = selectMakerConfig.recipient
      const provider = new Web3Provider(
        compatibleGlobalWalletConf.value.walletPayload.provider
      )
      const gasPrice = await provider.getGasPrice()
      const nonce = await provider.getTransactionCount(address, 'latest')

      const tokenContract = new Contract(coinAddress, Coin_ABI, provider)
      const { data } = await tokenContract.populateTransaction.transfer(
        toAddress,
        tValue.tAmount
      )

      const populateTransaction = {
        from: address,
        nonce,
        data,
        value: ethers.utils.parseEther('0'),
        to: coinAddress,
      }

      const gasLimit = await provider.estimateGas({
        ...populateTransaction,
        from: address,
      })
      const ethFee = gasLimit.mul(gasPrice)

      const paymasterContract = new Contract(
        PAYMASTER_ADDRESS,
        PAYMASTER_ABI,
        provider
      )
      const [, minAmount] = await paymasterContract.getTokenFee(
        gasTokenAddress,
        ethFee
      )
      return ethers.utils.parseUnits('2', 'wei').mul(minAmount)
    },
    showSelectDialog() {
      Promise.all(
        this.dataList.map((item) =>
          transferCalculate.getTransferBalance(
            transferDataState.fromChainID,
            item.address,
            item.symbol,
            this.currentWalletAddress
          )
        )
      ).then((res) => {
        let obj = {}
        this.dataList.forEach((item, index) => {
          obj = {
            ...obj,
            [item.value]: decimalNum(res[index] / 10 ** item.decimals, 8),
          }
        })

        this.amount = obj
      })

      let obj = {}
      this.dataList.forEach((item) => {
        const value = item.value === 'ETH' ? "0" : "0.01"

        obj = {
          ...obj,
          [item.value]: value,
        }
      })

      this.minAmountFee = obj

      this.dialogVisible = !this.dialogVisible
    },
    selectItem(item) {
      if (
        ethers.utils.parseEther(item.amount || '0').gt('0') &&
        (item.value === 'ETH' ||
          ethers.utils.parseEther(item.minAmountFee || '0').gt('0')) &&
        ethers.utils
          .parseEther(item.amount || '0')
          .gte(ethers.utils.parseEther(item.minAmountFee))
      ) {
        updateGasTokenInfo(item)
        this.value = item.value
        setTimeout(() => {
          this.dialogVisible = false
        }, 0)
      }
    },
    handlerDialogOutsideClick(e) {
      if (this.dialogVisible) {
        const dialog = this.$refs.dialog
        const ctx = this.$refs.ctx
        let cur = e.target
        let hasFind = false
        while (cur && !hasFind) {
          if (cur === dialog || cur === ctx) {
            hasFind = true
          }
          cur = cur.parentElement
        }
        !hasFind && (this.dialogVisible = false)
      }
    },
  },
  watch: {
    currentWalletAddress() {
      this.dialogVisible = false
      this.amount = {}
      this.minAmountFee = {}
      updateGasTokenInfo({})
    },
  },
  mounted() {
    document.addEventListener('click', this.handlerDialogOutsideClick)
  },
  unmounted() {
    document.removeEventListener('click', this.handlerDialogOutsideClick)
  },
}
</script>

<style scoped lang="scss">
.ob-select-box {
  border-radius: 12px;
  padding: 6px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: relative;
  z-index: 2;
  .prefix,
  .suffix,
  .select-item-icon {
    width: 20px;
    height: 20px;
  }
  .selected-label {
    margin: 0 4px;
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
  }
  .dialog {
    position: absolute;
    right: 0;
    top: 40px;
    border-radius: 12px;
    min-width: 200px;
    padding: 10px 0;
    z-index: 100;
    .select-item {
      height: 40px;
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: 0 12px;
      font-weight: 700;
      font-size: 16px;
      line-height: 24px;

      .select-item-group {
        width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .select-item-symbol {
          flex: 1;
          display: flex;
          justify-content: start;
          align-items: center;
        }
        .select-item-amount {
          font-size: 12px;
          font-weight: 400;
          color: #adadad;
          line-height: 17px;
        }
      }
      .select-item-icon {
        margin-right: 4px;
      }
    }

    .select-item.disabled {
      cursor: not-allowed;
    }
  }
}
</style>
