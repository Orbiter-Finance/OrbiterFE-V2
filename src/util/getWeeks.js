const DAY = 24 * 60 * 60 * 1000

export default function getWeeks(startTime) {
  const now = new Date()
  const end = now.getTime()
  const start = new Date(
    typeof startTime === 'string' ? startTime.replace(/-/g, '/') : startTime
  ).getTime()

  const weeks = []

  for (let d = end; d >= start; ) {
    weeks.push({
      start: new Date(d).getTime() - DAY * 7,
      end: new Date(d).getTime(),
    })
    d = d - DAY * 7
  }

  return weeks
}
