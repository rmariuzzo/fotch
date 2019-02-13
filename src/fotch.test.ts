import fotch from './fotch'
import { LocalStorage } from './repository'

const ls = new LocalStorage()

describe('fotch', () => {
  beforeEach(() => {
    self.localStorage.clear()
  })

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

  it('should get an item', async () => {
    const apple = ls.create('apples', { color: 'red' })
    const response = await fetch(`/apples/${apple.id}`)
    expect(response.json()).resolves.toMatchObject(apple)
  })

  it('should get not found', async () => {
    try {
      await fetch('/apples/1')
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })

  it('should post an item', async () => {
    const apple = { color: 'red' }
    const response = await fetch('/apples', {
      method: 'POST',
      body: JSON.stringify(apple)
    })

    expect(response.json()).resolves.toMatchObject(apple)
  })

  it('should update an item', async () => {
    const apple = ls.create('apples', { color: 'red' })

    const patch = { color: 'green' }
    const response = await fetch(`/apples/${apple.id}`, {
      method: 'PUT',
      body: JSON.stringify(patch)
    })

    expect(response.json()).resolves.toMatchObject(patch)
  })

  it('should not update an item when not found', async () => {
    try {
      await fetch(`/apples/1`, {
        method: 'PUT',
        body: JSON.stringify({ color: 'green' })
      })
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })

  it('should remove an item', async () => {
    const apple = ls.create('apples', { color: 'red' })
    const response = await fetch(`/apples/${apple.id}`, { method: 'DELETE' })

    expect(response).toMatchObject({ status: 200 })

    try {
      await fetch(`/apples/${apple.id}`, { method: 'DELETE' })
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })

  it('should not remove an item when not found', async () => {
    try {
      await fetch('/apples/1', { method: 'DELETE' })
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })
})
