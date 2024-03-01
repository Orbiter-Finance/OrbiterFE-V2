export default function getQueryString(name) {
  const url = new URL(window.location.href)
  let str = url.searchParams.get(name) || ''
  if (!str) {
    const [a, b] = window.location.href.split('#')
    if (b) {
      const [c, d] = b.split('?')
      const f = d?.slice(0).split('&') || []
      const h = {}
      f.forEach((item) => {
        const [i, j] = item?.slice(0).split('=')
        if (i) {
          h[i] = j
        }
      })
      str = h[name]
    }
  }
  return str
}
