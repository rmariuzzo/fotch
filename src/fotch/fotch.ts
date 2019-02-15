import LocalStorage from '../repository/LocalStorage'
import { createResponse } from '../utils'

const repository = new LocalStorage()
let _fetch = null
let intercepting = false

export default {
  start(match?: string) {
    if (!intercepting) {
      _fetch = window.fetch
      intercepting = true
      window.fetch = fotch(match)
    }
  },

  stop() {
    if (intercepting) {
      intercepting = false
      window.fetch = _fetch
    }
  }
}

const fotch = (match?: string) => {
  return (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!input) {
      return _fetch(input)
    }

    if (typeof match === 'string' && !input.toString().includes(match)) {
      return _fetch(input, init)
    }

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
          if (id === null) {
            data = repository.all(name)
          } else {
            data = repository.get(name, id)
          }

          return Promise.resolve(createResponse(data, 200, input.toString()))

        case 'post':
          data = repository.create(name, JSON.parse(init.body.toString()))

          return Promise.resolve(createResponse(data, 201, input.toString()))

        case 'put':
        case 'patch':
          data = repository.update(name, id, JSON.parse(init.body.toString()))

          return Promise.resolve(createResponse(data, 200, input.toString()))

        case 'delete':
          repository.remove(name, id)

          return Promise.resolve(createResponse(data, 200, input.toString()))
      }
    } catch (error) {
      return Promise.reject(
        createResponse(data, error.status || 500, input.toString())
      )
    }
  }
}
