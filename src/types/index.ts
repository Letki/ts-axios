export type Method =
  | 'get'
  | 'GET'
  | 'delete'
  | 'DELETE'
  | 'head'
  | 'HEAD'
  | 'options'
  | 'OPTIONS'
  | 'POST'
  | 'post'
  | 'put'
  | 'PUT'
  | 'PATCH'
  | 'patch'

// axios 请求参数配置接口
export interface AxiosRequestConfig {
  url?: string // 请求url
  method?: Method // 请求方法
  data?: any // 请求数据 post, 放在body 中
  params?: any // 请求参数 get请求
  headers?: any // 请求头数据
  responseType?: XMLHttpRequestResponseType // 请求返回类型 "" | "arraybuffer" | "blob" | "document" | "json" | "text";
  timeout?: number // 超时时间
  [propName: string]: any
  transformRequest?: AxiosTransformer | AxiosTransformer[]
  transformResponse?: AxiosTransformer | AxiosTransformer[]
  cancelToken?: CancelToken
}

// axios 请求返回参数接口
export interface AxiosResponse<T = any> {
  data: T // 返回数据
  status: number // 状态码
  statusText: string // 状态短语
  headers: any // 返回头信息
  config: AxiosRequestConfig // 请求参数配置
  request: any // 请求对象
}

export interface AxiosPromise<T = any> extends Promise<AxiosResponse<T>> {
  // 这里的泛型 确定了resolve的参数类型
}

export interface AxiosError extends Error {
  isAxiosError: boolean // 是否错误
  config: AxiosRequestConfig // 请求参数配置
  code?: string | null // 状态码 可选
  request?: any // 请求对象  可选, 因为可能请求未发出就报错
  response?: AxiosResponse // 返回对象 可选, 因为可能没有
}

export interface Axios {
  intercetor: {
    request: AxiosInterceptorManager<AxiosRequestConfig>
    response: AxiosInterceptorManager<AxiosResponse>
  }
  defaults: AxiosRequestConfig
  request<T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  get<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  delete<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  head<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  options<T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
  post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
  patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): AxiosPromise<T>
}

// 混合类型接口
export interface AxiosInstance extends Axios {
  // 这里指代这种类型的变量自己也是一个函数, 还有其他Axios接口里的属性方法
  <T = any>(config: AxiosRequestConfig): AxiosPromise<T>
  <T = any>(url: string, config?: AxiosRequestConfig): AxiosPromise<T>
}

export interface AxiosStatic extends AxiosInstance {
  create(config?: AxiosRequestConfig): AxiosInstance
  CancelToken: CancelTokenStatic
  isCancel: (value: any) => boolean
}

// 定义拦截器对象接口
export interface AxiosInterceptorManager<T> {
  use(resolved: ResolvedFn<T>, reject?: RejectedFn): number
  eject(id: number): void
}
// 定义拦截器传入得方法类型
export interface ResolvedFn<T> {
  (val: T): T | Promise<T>
}
// 定义拦截器传入的方法类型
export interface RejectedFn {
  (error: any): any
}

// 定义tranform 类型
export interface AxiosTransformer {
  (data: any, headers?: any): any
}

// CancelToken 的实例类型
export interface CancelToken {
  promise: Promise<string>
  reason?: string
}

export interface Canceler {
  (message?: string): void
}

export interface CancelExecutor {
  (cancel: Canceler): void
}

export interface CancelTokenSource {
  token: CancelToken
  cancel: Canceler
}

// CancelToken的类类型
export interface CancelTokenStatic {
  new (executor: CancelExecutor): CancelToken
  source(): CancelTokenSource
}

export interface Cancel {
  message?: string
}

export interface CancelStatic {
  new (message?: string): Cancel
}
