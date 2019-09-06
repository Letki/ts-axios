import { isDate, isPlainObject } from './util'

// 将中文编码, 但排除部分字符不编码
function encode(val: string): string {
  return encodeURIComponent(val)
    .replace(/%40/g, '@')
    .replace(/%3A/gi, ':')
    .replace(/%24/g, '$')
    .replace(/%2C/gi, ',')
    .replace(/%20/g, '+')
    .replace(/%5B/gi, '[')
    .replace(/%5D/gi, ']')
}

export function buildURL(url: string, params?: any): string {
  if (!params) {
    return url
  }
  const parts: string[] = []
  Object.keys(params).forEach(key => {
    const val = params[key]
    if (val === null || val === 'undefined') {
      return
    }
    let values = []
    if (Array.isArray(val)) {
      values = val
      key += '[]'
    } else {
      values = [val] // 不是数组 设置为数组
    }
    values.forEach(val => {
      if (isDate(val)) {
        val = val.toISOString()
      } else if (isPlainObject(val)) {
        val = JSON.stringify(val)
      }
      parts.push(`${encode(key)}=${encode(val)}`)
    })
  })
  let serialzedParams = parts.join('&')
  if (serialzedParams) {
    const marIndex = url.indexOf('#')
    // 若有hash地址, 则将hash后面的都去掉
    if (marIndex !== -1) {
      url = url.slice(0, marIndex)
    }
    // 判断url上是否已带有参数,进行拼接
    url += (url.indexOf('?') === -1 ? '?' : '&') + serialzedParams
  }
  return url
}
