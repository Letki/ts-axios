import { AxiosRequestConfig, AxiosStatic } from './types'
import Axios from './core/Axios'
import { extend } from './helpers/util'
import defaults from './default'
import mergeConfig from './core/mergeConfig'

function createInstance(config: AxiosRequestConfig): AxiosStatic {
  const context = new Axios(config)
  // 这一步的目的是为了 让axios也是个函数可以直接调用 如 axios({}) 因为构造函数不能返回一个方法并且拥有其他属性
  // 1. instance 是个函数
  const instance = Axios.prototype.request.bind(context)
  // 然后将context上的属性拷贝到instance上, 使instance也拥有其他方法属性
  extend(instance, context)
  // 将 instance 返回, 这个就是唯一的一个axios 实例
  return instance as AxiosStatic
}

const axios = createInstance(defaults)
axios.create = function create(config) {
  return createInstance(mergeConfig(defaults, config))
}

export default axios
