export function createResponse(
  data: any,
  status: number,
  url: string
): Response {
  return {
    body: new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode(JSON.stringify(data)))
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
      } catch (error) {
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
    }
  }
}
