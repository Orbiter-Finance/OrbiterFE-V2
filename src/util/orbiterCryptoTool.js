const crypto = globalThis.crypto
const { subtle } = globalThis.crypto

async function aesEncrypt(plainData) {
  const key = await generateAndExportAESKey()
  const iv = crypto.getRandomValues(new Uint8Array(16))

  const ec = new TextEncoder()
  const buf = await subtle.encrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    key,
    ec.encode(plainData)
  )

  var dataU8Arr = new Uint8Array(buf)

  return {
    key: (await subtle.exportKey('jwk', key)).k,
    iv: iv.toString(),
    data: dataU8Arr.toString(),
  }
}

async function aesDecrypt(cipherDataStr, keyStr, ivStr) {
  const keyData = {
    key_ops: ['encrypt', 'decrypt'],
    ext: true,
    kty: 'oct',
    k: keyStr,
    alg: 'A128CBC',
  }
  const key = await importAESKey(keyData)

  const iv = new Uint8Array(ivStr.split(','))
  const cipherData = new Uint8Array(cipherDataStr.split(','))

  const dec = new TextDecoder()
  const plainData = await subtle.decrypt(
    {
      name: 'AES-CBC',
      iv,
    },
    key,
    cipherData
  )

  return dec.decode(plainData)
}

async function generateAndExportAESKey(length = 128) {
  const key = await subtle.generateKey(
    {
      name: 'AES-CBC',
      length,
    },
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

async function importAESKey(keyData, length = 128) {
  const key = await subtle.importKey(
    'jwk',
    keyData,
    {
      name: 'AES-CBC',
      length,
    },
    true,
    ['encrypt', 'decrypt']
  )

  return key
}

const orbiterCryptoTool = {
  aesEncrypt,
  aesDecrypt,
  generateAndExportAESKey,
  importAESKey,
}

export default orbiterCryptoTool
