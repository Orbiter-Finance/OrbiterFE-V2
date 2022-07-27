export default function arrayNonRepeatfy(arr) {
  const map = new Map()
  const array = new Array()
  for (let i = 0; i < arr.length; i++) {
    const { start, end } = arr[i]
    if (!map.has(start + end)) {
      map.set(start + end, false)
      array.push(arr[i])
    }
  }
  return array
}
