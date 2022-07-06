export const isLocal = () => !process.env.NODE_ENV
export const isDev = () => process.env.NODE_ENV === 'development'
export const isProd = () => process.env.NODE_ENV === 'production'

export const getEnv = (key) => {
  if (key) return process.env[key]
  return process.env
}
