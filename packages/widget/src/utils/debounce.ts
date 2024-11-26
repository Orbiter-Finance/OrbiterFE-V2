let weakMap = new WeakMap()
/**
 *
 * @param {Array} args 
 */
export function debounce(...args: any[]) {
	let [fn, delay = 600, ...ars] = args
	let timer = weakMap.get(fn)
	timer && clearTimeout(timer)
	timer = setTimeout(() => {
		fn(...ars || [])
		weakMap.delete(fn)
	}, delay)

	weakMap.set(fn, timer)
}
