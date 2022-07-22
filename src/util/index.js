// import { isMobile } from '../composition/useMobile'

export * from './chain2id'
export * from './env'

//copy success
export function onCopySuccess() { this.$notify({ title: 'copy success', type: 'success', duration: 2000 }) }
//copy error
export function onCopyError() { this.$notify.error({ title: 'copy faild', duration: 2000 }) }

export function toggleBodyCls() {
  const mode = localStorage.getItem('themeMode')
  if (mode === 'dark') {
    document.body.classList.add("dark-body")
  } else {
    document.body.classList.remove("dark-body")
  }
}

/**
 * deprecate! use 
 *  .el-notification__title {
 *   word-break: break-all;
 *  }
 * instead in global.css
 */
export function notifyLg(msg, type = 'success', duration = 300000) {
  this.$notify[type]({ title: msg, duration})
  this.$nextTick(() => {
    const smsg = msg.split(/\s+/)
    let max = 25
    for(let i = 0; i < smsg.length; i++) {
      if (smsg[i] && smsg[i].length > max) {
        max = smsg[i].length
      }
    }
    if (max > 25) {
      const doms = document.querySelectorAll('.el-notification')
      Array.from(doms || []).forEach(dom => {
        const width = 330 + (max - 25) * (160/16) + 30
        // !isMobile.value && (dom.style.width = `${width}px`)
      })
    }
  })
}
