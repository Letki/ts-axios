import { isPlainObject } from './util'

// 在发出请求时, 将纯object对对象格式化为json字符串格式
export function transformRequest(data: any): any {
  if (isPlainObject(data)) {
    return JSON.stringify(data)
  }
  return data
}

// 自动将返回的data若为字符串则尝试json化
export function transformResponse(data: any): any {
  if (typeof data === 'string') {
    try {
      data = JSON.parse(data)
    } catch (e) {
      // nothing
    }
  }
  return data
}
