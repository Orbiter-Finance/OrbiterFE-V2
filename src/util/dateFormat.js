const m = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Spt',
  'Oct',
  'Nov',
  'Dec',
]
const d = ['st', 'nd', 'rd', 'th']

export default function formatDate(time, fmt = 'yyyy-MM-dd hh:mm:ss') {
  const date = new Date(
    typeof time === 'string' ? time.replace(/-/g, '/') : time
  )

  const o = {
    'M+': date.getMonth() + 1, // 月份
    'd+': date.getDate(), // 日
    'h+': date.getHours(), // 小时
    'm+': date.getMinutes(), // 分
    's+': date.getSeconds(), // 秒
    'q+': Math.floor((date.getMonth() + 3) / 3), // 季度
    S: date.getMilliseconds(), // 毫秒
  }

  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      `${date.getFullYear()}`.substring(4 - RegExp.$1.length)
    )
  }

  Object.keys(o).forEach((k) => {
    const v = o[k]
    if (new RegExp(`(${k})`).test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1
          ? v.toString()
          : `00${v}`.substring(`${v}`.length)
      )
    }
  })

  return fmt
}

export function formatDayDate(time) {
  const date = new Date(
    typeof time === 'string' ? time.replace(/-/g, '/') : time
  )

  const dn = date.getDate()
  let dns
  if (dn % 10 < 1 || dn % 10 > 3) {
    dns = d[3]
  } else {
    dns = d[(dn % 10) - 1]
    if (dn == 11 || dn == 12) {
      dns = d[3]
    }
  }
  return `${m[date.getMonth()]} ${dn + dns} ${date.getFullYear()}`
}
