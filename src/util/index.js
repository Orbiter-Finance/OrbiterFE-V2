export * from './chain2id'
export * from './env'

//copy success
export function onCopySuccess() { this.$notify({ title: 'copy success', type: 'success', duration: 2000 }) }
//copy error
export function onCopyError() { this.$notify.error({ title: 'copy faild', duration: 2000 }) }
