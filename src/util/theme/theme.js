export function toggleBodyCls() {
  const mode = localStorage.getItem('themeMode')
  if (mode === 'dark') {
    document.body.classList.add('dark-body')
  } else {
    document.body.classList.remove('dark-body')
  }
}
