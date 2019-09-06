import { CancelExecutor, CancelTokenSource, Canceler } from '../types'

interface ResolvePromise {
  (reason?: string): void
}
export default class CancelToken {
  promise: Promise<string>
  reason?: string
  constructor(executor: CancelExecutor) {
    let resolvePromise: ResolvePromise
    this.promise = new Promise<string>(resolve => {
      resolvePromise = resolve
    })
    // 函数为参数 在用户cancel 时调用
    executor(message => {
      if (this.reason) {
        return
      }
      this.reason = message
      resolvePromise(this.reason)
    })
  }
  static source(): CancelTokenSource {
    let cancel!: Canceler
    const token = new CancelToken(c => {
      cancel = c
    })
    return { cancel, token }
  }
}
