const baseSize = 10
function setRem() {
  const scale = document.documentElement.clientWidth / 1280
  let size = baseSize * Math.min(scale, 1)
  if (size <= 5) {
    size = 1
  }
  document.documentElement.style.setProperty('--font-size', size + 'px')
}
setRem()
window.onresize = function () {
  setRem()
}
