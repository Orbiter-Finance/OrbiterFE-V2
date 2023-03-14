import { store } from '../../store'
import { setMobileOrNot } from '../../composition/hooks'
import { toggleBodyCls } from '../'

// set init function
export function init() {
  const innerWH = {
    innerWidth: document.documentElement.clientWidth,
    innerHeight: document.documentElement.clientHeight,
  }
  store.commit('setInnerWH', innerWH)
  let ww = innerWH.innerWidth
  setMobileOrNot(ww < 820)
  if (ww > 375) {
    ww = 375
  }

  document.documentElement.style.fontSize = ww / 37.5 + 'px'

  // We execute the same script as before
  const vh = window.innerHeight * 0.01
  document.documentElement.style.setProperty('--vh', `${vh}px`)

  toggleBodyCls()
}

// ms
const ms = 300
let lastClick = Date.now() - ms

window.onresize = function () {
  if (Date.now() - lastClick >= ms) {
    init()
    lastClick = Date.now()
  }
}
