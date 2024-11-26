export const TESTNET_CollectInfoDefault = {
    code: 0,
    result: {
        sourceChains: [
            {
                chainId: '84532',
                makerAddress: '0x227d76AB1cEa2eDFc9A62833aF1743259c1f055f',
                maxPrice: '0.002',
                minPrice: '0.0000001',
                tokenAddress: '0x0000000000000000000000000000000000000000',
                symbol: 'ETH',
                decimal: 18,
            },
            {
                chainId: '534351',
                makerAddress: '0x227d76AB1cEa2eDFc9A62833aF1743259c1f055f',
                maxPrice: '0.002',
                minPrice: '0.0000001',
                tokenAddress: '0x0000000000000000000000000000000000000000',
                symbol: 'ETH',
                decimal: 18,
            },
            {
                chainId: '59141',
                makerAddress: '0x227d76AB1cEa2eDFc9A62833aF1743259c1f055f',
                maxPrice: '0.002',
                minPrice: '0.0000001',
                tokenAddress: '0x0000000000000000000000000000000000000000',
                symbol: 'ETH',
                decimal: 18,
            },
        ],
        targetChains: [
            {
                chainId: '84532',
                withholdingFee: 0,
                tradeFee: 0,
                point: 5,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 0.3],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
            {
                chainId: '11155111',
                withholdingFee: 0,
                tradeFee: 2,
                point: 5,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 2,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 0.3],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
        ],
        collectValue: {
            toCollect: '0',
            userToMaker: '0',
            makerToUser: '0',
        },
    },
}
export const MAINNET_CollectInfoDefault = {
    code: 0,
    result: {
        sourceChains: [
            {
                chainId: '1',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '42161',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '10',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '8453',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '59144',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '534352',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '167000',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '81457',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '324',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: 'zksync',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '42170',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '5000',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '7777777',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '34443',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '1135',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '255',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '169',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '252',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '690',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '137',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '1101',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '56',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '204',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '60808',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '7560',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '48900',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '10241024',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '810180',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '1625',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '200901',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '122',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '70700',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '480',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
            {
                chainId: '7000',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                maxPrice: '0.002',
                minPrice: '0.00001',
            },
        ],
        targetChains: [
            {
                chainId: '42161',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                withholdingFee: 0.001,
                tradeFee: 1,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 100],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
            {
                chainId: '10',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                withholdingFee: 0.001,
                tradeFee: 1,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 100],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
            {
                chainId: '8453',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                withholdingFee: 0.001,
                tradeFee: 1,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 100],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
            {
                chainId: '59144',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                withholdingFee: 0.001,
                tradeFee: 1,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 100],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
            {
                chainId: '56',
                makerAddress: '0xab0c8fBEC583F20c97f9fda6a2AF647B94c8e54D',
                withholdingFee: 0.001,
                tradeFee: 1,
                tieredFee: [
                    {
                        range: [0.00001, 0.012],
                        tradeFee: 0,
                        withholdingFee: 0.001,
                    },
                    {
                        range: [0.012, 100],
                        tradeFee: 1,
                        withholdingFee: 0.001,
                    },
                ],
            },
        ],
        collectValue: {
            toCollect: '0',
            userToMaker: '0',
            makerToUser: '0',
        },
    },
}

export const ERC20_ABI = [
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Approval',
        type: 'event',
    },
    {
        anonymous: false,
        inputs: [
            {
                indexed: true,
                internalType: 'address',
                name: 'from',
                type: 'address',
            },
            {
                indexed: true,
                internalType: 'address',
                name: 'to',
                type: 'address',
            },
            {
                indexed: false,
                internalType: 'uint256',
                name: 'value',
                type: 'uint256',
            },
        ],
        name: 'Transfer',
        type: 'event',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'owner',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
        ],
        name: 'allowance',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'spender',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'approve',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'account',
                type: 'address',
            },
        ],
        name: 'balanceOf',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'decimals',
        outputs: [
            {
                internalType: 'uint8',
                name: '',
                type: 'uint8',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'name',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'symbol',
        outputs: [
            {
                internalType: 'string',
                name: '',
                type: 'string',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [],
        name: 'totalSupply',
        outputs: [
            {
                internalType: 'uint256',
                name: '',
                type: 'uint256',
            },
        ],
        stateMutability: 'view',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transfer',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
    {
        inputs: [
            {
                internalType: 'address',
                name: 'sender',
                type: 'address',
            },
            {
                internalType: 'address',
                name: 'recipient',
                type: 'address',
            },
            {
                internalType: 'uint256',
                name: 'amount',
                type: 'uint256',
            },
        ],
        name: 'transferFrom',
        outputs: [
            {
                internalType: 'bool',
                name: '',
                type: 'bool',
            },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
    },
]
