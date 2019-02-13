import fotch from './fotch'

describe('fotch', () => {
  it('should replace the fetch object', () => {
    const fetch = self.fetch
    fotch()
    expect(fetch).not.toBe(self.fetch)
  })

  it('should get a collection', async () => {
    expect((await fetch('/apples')).json()).resolves.toEqual([])
    expect((await fetch('apples')).json()).resolves.toEqual([])
    expect((await fetch('apples/')).json()).resolves.toEqual([])
    expect((await fetch('/apples/')).json()).resolves.toEqual([])
  })

  it('should get not found', async () => {
    expect((await fetch('/apples')).json()).resolves.toEqual([])
    expect((await fetch('apples')).json()).resolves.toEqual([])
    expect((await fetch('apples/')).json()).resolves.toEqual([])
    expect((await fetch('/apples/')).json()).resolves.toEqual([])
  })
})
