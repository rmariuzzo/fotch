const notImplemented = () => {
  throw new Error('not implemented')
}

export function createResponse(
  data: any,
  status: number,
  url: string
): Response {
  return {
    body: null,
    bodyUsed: false,
    headers: {} as any,
    ok: status >= 200 && status < 300,
    redirected: false,
    status,
    statusText: '',
    type: 'basic',
    url: `fotch:///${url}`,
    trailer: Promise.resolve({} as any),
    json: () => Promise.resolve(data),
    clone: notImplemented,
    arrayBuffer: notImplemented,
    blob: notImplemented,
    formData: notImplemented,
    text: notImplemented,
  }
}

export function createResolver(opts?: {
  delay?: number | { min: number; max: number }
}): Function {
  return function(value: any): Promise<any> {
    if (opts && opts.delay) {
      const responseDelay =
        typeof opts.delay === 'number'
          ? opts.delay
          : getRandomNumber(opts.delay.min, opts.delay.max)

      return new Promise(resolve => {
        setTimeout(() => {
          resolve(value)
        }, responseDelay)
      })
    }

    return Promise.resolve(value)
  }
}

function getRandomNumber(min: number, max: number) {
  return Math.random() * (max - min) + min
}
