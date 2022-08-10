export default {
  /**
   *
   * @param {*} number Number to format
   * @param {*} tokenName Token Name
   * @returns
   */
  number_format(number, tokenName) {
    const decimals = tokenName === 'ETH' ? 3 : 2,
      dec_point = '.',
      thousands_sep = ','
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number,
      prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
      sep = typeof thousands_sep === 'undefined' ? ',' : thousands_sep,
      dec = typeof dec_point === 'undefined' ? '.' : dec_point,
      s = '',
      toFixedFix = function (n, prec) {
        var k = Math.pow(10, prec)
        return '' + Math.ceil(n * k) / k
      }

    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    var re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }

    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
}
