import {
  AxiosRequestConfig,
  AxiosPromise,
  Method,
  ResolvedFn,
  RejectedFn,
  AxiosResponse
} from '../types'
import dispatchRequest from './dispatchRequest'
import InterceptorManager from './InterceptorManager'
import mergeConfig from './mergeConfig'

interface Intercetor {
  request: InterceptorManager<AxiosRequestConfig>
  response: InterceptorManager<AxiosResponse>
}
interface PromiseChain<T> {
  resolved: ResolvedFn<T> | ((config: AxiosRequestConfig) => AxiosPromise)
  rejected?: RejectedFn
}
export default class Axios {
  defaults: AxiosRequestConfig
  intercetor: Intercetor
  constructor(initConfig: AxiosRequestConfig) {
    this.defaults = initConfig
    this.intercetor = {
      request: new InterceptorManager<AxiosRequestConfig>(),
      response: new InterceptorManager<AxiosResponse>()
    }
  }
  request(url: any, config?: any): AxiosPromise {
    if (typeof url === 'string') {
      if (!config) {
        config = {}
      }
      // 将URl配置塞回去
      config.url = url
    } else {
      // 如果只有一个参数, 则为config完整的参数, url代表的就是 config
      config = url
    }
    // 将默认配置和自定义配置合并
    config = mergeConfig(this.defaults, config)
    // 链式调用顺序
    const chain: PromiseChain<any>[] = [
      {
        // 默认执行的一个, 一定会执行的一个
        resolved: dispatchRequest,
        rejected: undefined
      }
    ]
    this.intercetor.request.forEach(intercetor => {
      // request的所有放在前面
      chain.unshift(intercetor)
    })
    this.intercetor.response.forEach(intercetor => {
      // response的拦截器放在后面依次执行
      chain.push(intercetor)
    })
    // 开始链式 此时的headers包含很多杂质
    let promise = Promise.resolve(config)
    while (chain.length) {
      const { resolved, rejected } = chain.shift()!
      promise = promise.then(resolved, rejected)
    }
    return promise
  }

  get(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // 本质就是调用request方法,将config 与url method合并
    return this._requestMethodWithoutData('get', url, config)
  }
  delete(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // 本质就是调用request方法,将config 与url method合并
    return this._requestMethodWithoutData('delete', url, config)
  }
  head(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // 本质就是调用request方法,将config 与url method合并
    return this._requestMethodWithoutData('head', url, config)
  }
  options(url: string, config?: AxiosRequestConfig): AxiosPromise {
    // 本质就是调用request方法,将config 与url method合并
    return this._requestMethodWithoutData('options', url, config)
  }
  post(url: string, data?: any, config?: AxiosRequestConfig) {
    return this._requestMethodWithData('post', url, data, config)
  }
  put(url: string, data?: any, config?: AxiosRequestConfig) {
    return this._requestMethodWithData('put', url, data, config)
  }
  patch(url: string, data?: any, config?: AxiosRequestConfig) {
    return this._requestMethodWithData('patch', url, data, config)
  }

  _requestMethodWithoutData(
    method: Method,
    url: string,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url
      })
    )
  }
  _requestMethodWithData(
    method: Method,
    url: string,
    data?: any,
    config?: AxiosRequestConfig
  ): AxiosPromise {
    return this.request(
      Object.assign(config || {}, {
        method,
        url,
        data
      })
    )
  }
}
