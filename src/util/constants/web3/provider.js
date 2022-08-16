import { ethers } from 'ethers'
function getDefaultProvider() {
    const provider = new ethers.providers.Web3Provider(window.ethereum, 'any')
    return provider
}

export { getDefaultProvider }