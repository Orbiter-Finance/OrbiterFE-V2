export class CrossAddress {
  /**
   * @param {string} contractAddress
   */
  constructor(contractAddress) {
    if (!contractAddress) {
      throw new Error('Sorry, miss param [contractAddress]')
    }

    this.contractAddress = contractAddress
  }
}
