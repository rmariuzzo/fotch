import LocalStorage from './repository/LocalStorage'
import { createResponse } from './utils'

const repository = new LocalStorage()

export default function fotch(match: string = ''): void {
  const fetch = self.fetch

  self.fetch = (input: RequestInfo, init?: RequestInit): Promise<Response> => {
    if (!input) {
      return fetch(input)
    }

    if (!input.toString().includes(match)) {
      return fetch(input, init)
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
      return fetch(input, init)
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
