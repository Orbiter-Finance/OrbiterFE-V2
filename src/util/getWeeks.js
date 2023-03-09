const DAY = 24 * 60 * 60 * 1000
const unixTime = (timestamp) => timestamp - (timestamp % 86400000)
export default function getWeeks(startTime, endTime) {
  const end = new Date(
    typeof endTime === 'string' ? endTime.replace(/-/g, '/') : endTime
  ).getTime()
  const start = new Date(
    typeof startTime === 'string' ? startTime.replace(/-/g, '/') : startTime
  ).getTime()

  const weeks = []

  for (let d = end; d >= start; ) {
    weeks.push({
      start: unixTime(new Date(d).getTime()) - DAY * 6,
      end: unixTime(new Date(d).getTime()),
    })
    d = d - DAY * 7
  }

  return weeks
}
