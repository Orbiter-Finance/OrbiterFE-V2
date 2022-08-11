const baseSize = 10
function setRem() {
  const scale = document.documentElement.clientWidth / 1280
  let rate = 2
  console.log(document.documentElement.clientWidth)
  if (document.documentElement.clientWidth == 1440) {
    rate = 1
  }
  let size = baseSize * Math.min(scale, rate)
  if (size <= 5) {
    size = 1
  }
  document.documentElement.style.setProperty('--font-size', size + 'px')
}
setRem()
window.onresize = function () {
  setRem()
}
