import LocalStorage from "./repository/LocalStorage";

const repository = new LocalStorage()

function createResponse(data: any, status: number, url: string) : Response {
  return {
    body: new ReadableStream({
      start(controller) {
        controller.enqueue((new TextEncoder()).encode(JSON.stringify(data)))
        controller.close()
      }
    }),
    bodyUsed: false,
    headers: new Headers(),
    ok: status >= 200 && status < 300,
    redirected: false,
    status,
    statusText: '',
    type: 'basic',
    url: `fotch:///${url}`,
    trailer: Promise.resolve(new Headers()),
    json() {
      try {
        return Promise.resolve(JSON.parse(data))
      } catch(error) {
        return Promise.reject(error)
      }
    },
    clone() {
      throw new Error('not implemented')
    },
    arrayBuffer() {
      throw new Error('not implemented')
    },
    blob() {
      throw new Error('not implemented')
    },
    formData() {
      throw new Error('not implemented')
    },
    text() {
      throw new Error('not implemented')
    },
  }
}

export default function fotch(match: string) : void {
  const fetch = self.fetch
  
  self.fetch = (input: RequestInfo, init?: RequestInit) : Promise<Response> => {
    if (!input) {
      return fetch(input)
    }

    if (!input.toString().includes(match)) {
      return fetch(input, init)
    }

    const segments = input.toString().split(/\//)
    const id = segments.length > 1 ? segments.pop() : null
    const name = segments.join('/')

    let method = init && init.method && init.method.toLowerCase()
    method = method || 'get'

    let data

    try {
      switch(method) {
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
      return Promise.reject(createResponse(data, 500, input.toString()))
    }
  }
}