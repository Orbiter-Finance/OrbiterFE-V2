const DAY = 24 * 60 * 60 * 1000
const HALF_YEAR = DAY * 182

export default function getLastHalfYearWeeks() {
  const now = new Date()
  const end = new Date().getTime()
  const start = new Date(now - HALF_YEAR).getTime()

  const weeks = []

  for (let d = start; d < end; ) {
    if (new Date(d).getDay() === now.getDay()) {
      weeks.push({
        start: new Date(d).getTime(),
        end: new Date(d).getTime() + DAY * 7,
      })
    }
    d = d + DAY * 7
  }

  return weeks
}
