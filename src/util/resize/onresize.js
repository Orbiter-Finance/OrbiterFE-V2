import _this from '../../main'

// set init function
function init() {
  if (_this) {
    const innerWH = {
      innerWidth: document.documentElement.clientWidth,
      innerHeight: document.documentElement.clientHeight,
    }
    _this.$store.commit('setInnerWH', innerWH)
    var ww = innerWH.innerWidth
    if (ww > 375) {
      ww = 375
    }
    document.documentElement.style.fontSize = ww / 37.5 + 'px'

    // We execute the same script as before
    let vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
}

// ms
var ms = 300
var lastClick = Date.now() - ms
init()
var ww = document.documentElement.clientWidth
if (ww > 375) {
  ww = 375
}
document.documentElement.style.fontSize = ww / 37.5 + 'px'
// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01
// Then we set the value in the --vh custom property to the root of the document
document.documentElement.style.setProperty('--vh', `${vh}px`)

window.onresize = function () {
  if (Date.now() - lastClick >= ms) {
    init()
    lastClick = Date.now()
  }
}
