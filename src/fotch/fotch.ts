import LocalStorage from '../repository/LocalStorage'
import { createResolver, createResponse } from '../utils'

const repository = new LocalStorage()
let _fetch = window.fetch
let intercepting = false

type FotchOptions = {
  start?: string
  delay?: number | { min: number; max: number }
}

export default {
  start(opts?: string | FotchOptions) {
    if (!intercepting) {
      _fetch = window.fetch
      intercepting = true
      window.fetch = fotch(opts)
    }
  },

  stop() {
    if (intercepting) {
      intercepting = false
      window.fetch = _fetch
    }
  },
}

const fotch = (opts?: string | FotchOptions) => {
  return (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!input) {
      return _fetch(input)
    }

    const match = typeof opts === 'object' ? opts.start : opts

    if (typeof match === 'string' && !input.toString().includes(match)) {
      return _fetch(input, init)
    }

    const resolver = createResolver(typeof opts === 'object' ? opts : undefined)

    const segments = input
      .toString()
      .replace(/(^\/|\/$)/g, '')
      .split(/\//)
    const id = segments.length > 1 ? segments.pop() : null
    const name = segments.join('/')

    let method = init && init.method && init.method.toLowerCase()
    method = method || 'get'

    if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
      return _fetch(input, init)
    }

    let data

    try {
      switch (method) {
        case 'get':
          if (id) {
            data = repository.get(name, id)
          } else {
            data = repository.all(name)
          }

          return resolver(createResponse(data, 200, input.toString()))

        case 'post':
          data = repository.create(
            name,
            JSON.parse(init?.body?.toString() ?? '{}')
          )

          return resolver(createResponse(data, 201, input.toString()))

        case 'put':
        case 'patch':
          if (!id) {
            throw new Error(`Missing id: ${id}`)
          }

          data = repository.update(
            name,
            id,
            JSON.parse(init?.body?.toString() ?? '{}')
          )

          return resolver(createResponse(data, 200, input.toString()))

        case 'delete':
          if (!id) {
            throw new Error(`Missing id: ${id}`)
          }

          repository.remove(name, id)


          return resolver(createResponse(data, 200, input.toString()))
        default:
          throw new Error(`Unexpected method: ${method}`)
      }
    } catch (error) {
      return Promise.reject(
        createResponse(data, error.status || 500, input.toString())
      )
    }
  }
}
