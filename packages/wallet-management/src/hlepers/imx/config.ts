

const ImmutableXMainnetConfig = {
    apiUri: "https://api.x.immutable.com/v1",
    linkUri: "https://link.x.immutable.com",
    starkContractAddress: '0x5FDCCA53617f4d2b9134B29090C87D01058e27e9',
    registrationContractAddress: '0x72a06bf2a1CE5e39cBA06c0CAb824960B587d64c',
}

const ImmutableXTestnetConfig = {
    starkContractAddress: '0x7917eDb51ecD6CdB3F9854c3cc593F33de10c623',
    registrationContractAddress: '0x1C97Ada273C9A52253f463042f29117090Cd7D83',
    apiUri: "https://api.sandbox.x.immutable.com/v1",
    linkUri: "https://link.sandbox.x.immutable.com"
}

export {
    ImmutableXMainnetConfig,
    ImmutableXTestnetConfig,
}