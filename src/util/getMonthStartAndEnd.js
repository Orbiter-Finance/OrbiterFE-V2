export default function getMonthStartAndEnd(timestamp) {
  const time = new Date(timestamp)
  let year = time.getFullYear()
  let month = parseInt(time.getMonth() + 1)

  const start = new Date(year + '-' + month + '-01 00:00:00').getTime()
  if (month == 12) {
    month = 0
    year += 1
  }
  const end = new Date(year + '-' + (month + 1) + '-01 00:00:00').getTime()

  return {
    start,
    end,
  }
}
