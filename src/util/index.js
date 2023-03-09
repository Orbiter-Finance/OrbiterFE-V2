// import { isMobile } from '../composition/useMobile'

export * from './env'

// copy success
export function onCopySuccess() {
  this.$notify({ title: 'copy success', type: 'success', duration: 2000 })
}
// copy error
export function onCopyError() {
  this.$notify.error({ title: 'copy faild', duration: 2000 })
}

export function toggleBodyCls() {
  const mode = localStorage.getItem('themeMode')
  if (mode === 'dark') {
    document.body.classList.add('dark-body')
  } else {
    document.body.classList.remove('dark-body')
  }
}

export function formatDateShort(date) {
  return formatDate(date)?.slice(5, -3)
}

export function formatDate(date) {
  const dt = new Date(date)
  return `${dt.getFullYear()}-${padZero(dt.getMonth() + 1)}-${padZero(
    dt.getDate()
  )} ${padZero(dt.getHours())}:${padZero(dt.getMinutes())}:${padZero(
    dt.getSeconds()
  )}`
}

function padZero(tar) {
  if (+tar < 10) return `0${tar}`
  return tar
}
