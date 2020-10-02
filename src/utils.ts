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
