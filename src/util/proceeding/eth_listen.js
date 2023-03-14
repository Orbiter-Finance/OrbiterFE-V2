import axios from 'axios'

const ETHLISTEN_TRANSFER_DURATION = 5 * 1000

export class EthListen {
  constructor(api, address, blockProvider = undefined) {
    this.api = api
    this.address = address
    this.blockProvider = blockProvider

    this.transferReceivedHashs = {}
    this.transferConfirmationedHashs = {}
  }

  setTransferBreaker(transferBreaker) {
    this.transferBreaker = transferBreaker
    return this
  }

  transfer(filter, callbacks = undefined, confirmationsTotal = 3) {
    const checkFilter = (from, to) => {
      if (!filter) {
        return true
      }

      if (filter.from && filter.from.toUpperCase() != from.toUpperCase()) {
        return false
      }

      if (filter.to && filter.to.toUpperCase() != to.toUpperCase()) {
        return false
      }
      return true
    }

    let isFirstTicker = true
    const timer = setInterval(() => ticker(), ETHLISTEN_TRANSFER_DURATION)
    const ticker = async () => {
      try {
        if (this.transferBreaker && this.transferBreaker() === false) {
          clearInterval(timer)
          return
        }

        let startblock = ''
        if (this.blockProvider) {
          startblock = await this.blockProvider(isFirstTicker)
          isFirstTicker = false
        }

        const resp = await axios.get(this.api.endPoint, {
          params: {
            apiKey: this.api.key,
            module: 'account',
            action: 'txlist',
            address: this.address,
            page: 1,
            offset: 100,
            startblock,
            endblock: 'latest',
            sort: 'asc',
          },
          timeout: 16000,
        })
        const { data } = resp
        if (data.status != '1' || !data.result || data.result.length <= 0) {
          return
        }

        for (const item of data.result) {
          if (!checkFilter(item.from, item.to)) {
            continue
          }
          if (this.transferReceivedHashs[item.hash] === undefined) {
            this.transferReceivedHashs[item.hash] = true
            callbacks && callbacks.onReceived && callbacks.onReceived(item)
          }

          if (confirmationsTotal > 0) {
            if (
              this.transferConfirmationedHashs[item.hash] === undefined &&
              item.confirmations >= confirmationsTotal
            ) {
              this.transferConfirmationedHashs[item.hash] = true
              callbacks &&
                callbacks.onConfirmation &&
                callbacks.onConfirmation(item)
            }
          }
        }
      } catch (error) {
        console.error(error)
      }
    }
    ticker()
  }
}
