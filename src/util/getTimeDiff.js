export default function getTimeDiff(timestamp) {
  if (timestamp === undefined) {
    return undefined
  }

  const now = Date.parse(new Date()) / 1000
  const limit = now - timestamp

  if (limit < 60) {
    return 'just now'
  } else if (limit >= 60 && limit < 3600) {
    return `${Math.floor(limit / 60)}m ago`
  } else if (limit >= 3600 && limit < 86400) {
    return `${Math.floor(limit / 3600)}h ago`
  } else if (limit >= 86400 && limit < 2592000) {
    return `${Math.floor(limit / 86400)}d ago`
  }
  return `${Math.floor(limit / 2592000)}mon ago`
}
