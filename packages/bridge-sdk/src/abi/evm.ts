const Orbiter_V3_ABI_EVM = [{
  "anonymous": false,
  "inputs": [{ "indexed": true, "internalType": "address", "name": "to", "type": "address" }, {
    "indexed": false,
    "internalType": "uint256",
    "name": "amount",
    "type": "uint256"
  }],
  "name": "Transfer",
  "type": "event"
}, {
  "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }], "name": "transfer", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [{ "internalType": "contract IERC20", "name": "token", "type": "address" }, {
    "internalType": "address",
    "name": "to",
    "type": "address"
  }, { "internalType": "uint256", "name": "value", "type": "uint256" }, {
    "internalType": "bytes",
    "name": "data",
    "type": "bytes"
  }], "name": "transferToken", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [{
    "internalType": "contract IERC20",
    "name": "token",
    "type": "address"
  }, { "internalType": "address[]", "name": "tos", "type": "address[]" }, {
    "internalType": "uint256[]",
    "name": "values",
    "type": "uint256[]"
  }], "name": "transferTokens", "outputs": [], "stateMutability": "payable", "type": "function"
}, {
  "inputs": [
    { "internalType": "address[]", "name": "tos", "type": "address[]" }, {
      "internalType": "uint256[]",
      "name": "values",
      "type": "uint256[]"
    }], "name": "transfers", "outputs": [], "stateMutability": "payable", "type": "function"
}];

const Orbiter_V3_ABI_STARKNET = [
  {
    "members": [
      {
        "name": "low",
        "offset": 0,
        "type": "felt"
      },
      {
        "name": "high",
        "offset": 1,
        "type": "felt"
      }
    ],
    "name": "Uint256",
    "size": 2,
    "type": "struct"
  },
  {
    "data": [
      {
        "name": "to",
        "type": "felt"
      },
      {
        "name": "amount",
        "type": "Uint256"
      },
      {
        "name": "token",
        "type": "felt"
      },
      {
        "name": "ext_len",
        "type": "felt"
      },
      {
        "name": "ext",
        "type": "felt*"
      }
    ],
    "keys": [],
    "name": "Transfer",
    "type": "event"
  },
  {
    "inputs": [
      {
        "name": "_token",
        "type": "felt"
      },
      {
        "name": "_to",
        "type": "felt"
      },
      {
        "name": "_amount",
        "type": "Uint256"
      },
      {
        "name": "_ext_len",
        "type": "felt"
      },
      {
        "name": "_ext",
        "type": "felt*"
      }
    ],
    "name": "transferERC20",
    "outputs": [],
    "type": "function"
  }
]


export {
  Orbiter_V3_ABI_EVM,
  Orbiter_V3_ABI_STARKNET,
}