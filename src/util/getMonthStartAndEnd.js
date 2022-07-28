export default function getMonthStartAndEnd(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  const month = parseInt(time.getMonth() + 1)

  const start = new Date(
    `${year}-${month}-01 00:00:00`.replace(/-/g, '/')
  ).getTime()

  const endYear = month == 12 ? year + 1 : year
  const endMonth = (month == 12 ? 0 : month) + 1
  const end = new Date(
    `${endYear}-${endMonth}-01 00:00:00`.replace(/-/g, '/')
  ).getTime()

  return {
    start,
    end,
  }
}
