export default function getMonthStartAndEnd(timestamp) {
  const time = new Date(timestamp)
  const year = time.getFullYear()
  const month = parseInt(time.getMonth() + 1)

  const start = new Date(
    `${year}-${month}-01 00:00:00`.replace(/-/g, '/')
  ).getTime()
  const end = new Date(
    `${month == 12 ? year + 1 : year}-${
      (month == 12 ? 0 : month) + 1
    }-01 00:00:00`.replace(/-/g, '/')
  ).getTime()

  return {
    start,
    end,
  }
}
