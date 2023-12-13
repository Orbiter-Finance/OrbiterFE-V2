/**
 * current UTC time stamp
 * @returns number
 */
export default function getUTCTime() {
  let d1 = new Date()
  let d2 = new Date(
    d1.getUTCFullYear(),
    d1.getUTCMonth(),
    d1.getUTCDate(),
    d1.getUTCHours(),
    d1.getUTCMinutes(),
    d1.getUTCSeconds()
  )
  return Date.parse(d2)
}
