import { AxiosRequestConfig, AxiosPromise, AxiosResponse } from '../types'
import xhr from './xhr'
import { buildURL } from '../helpers/url'
import { flattenHeaders } from '../helpers/header'
import transform from './transform'

export default function dispatchRequest(config: AxiosRequestConfig): AxiosPromise {
  // 格式化请求
  processConfig(config)
  // 返回Promise 对象
  return xhr(config).then(res => {
    // 尝试json化
    res.data = transform(res.data, res.headers, res.config.transformResponse)
    return res
  })
}
function processConfig(config: AxiosRequestConfig): void {
  config.url = transformURL(config) // url和params 拼接
  config.data = transform(config.data, config.headers, config.transformRequest)
  // 此时headers 还有杂质未清除, 并且要将common共同的头, 和方法特有头拉出来放到同一级
  config.headers = flattenHeaders(config.headers, config.method!)
}
function transformURL(config: AxiosRequestConfig): string {
  const { url, params } = config
  return buildURL(url!, params)
}
