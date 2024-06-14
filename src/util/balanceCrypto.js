import crypto from 'crypto'

function encryptedData(data, salt, iv, passphrase) {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(passphrase, Buffer.from(salt, 'hex'), 32)
  const cipher = crypto.createCipheriv(algorithm, key, Buffer.from(iv, 'hex'))

  let encryptedData = cipher.update(data, 'utf8', 'hex')
  encryptedData += cipher.final('hex')

  return encryptedData
}

function decryptData(encryptedData, salt, iv, passphrase) {
  const algorithm = 'aes-256-cbc'
  const key = crypto.scryptSync(passphrase, Buffer.from(salt, 'hex'), 32)
  const decipher = crypto.createDecipheriv(
    algorithm,
    key,
    Buffer.from(iv, 'hex')
  )
  let decryptedData = decipher.update(encryptedData, 'hex', 'utf8')
  decryptedData += decipher.final('utf8')
  return decryptedData
}

const orbiterCryptoTool = {
  encryptedData,
  decryptData,
}

export default orbiterCryptoTool
