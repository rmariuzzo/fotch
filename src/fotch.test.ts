import fotch from './fotch'
import { LocalStorage } from './repository'

const ls = new LocalStorage()

describe('fotch', () => {
  beforeEach(() => {
    self.localStorage.clear()
  })

  afterEach(() => {
    fotch.stop()
  })

  it('should replace the fetch object', () => {
    const fetch = self.fetch
    fotch.start()
    expect(fetch).not.toBe(self.fetch)
  })

  it('should get a collection', async () => {
    fotch.start()

    expect((await fetch('/apples')).json()).resolves.toEqual([])
    expect((await fetch('apples')).json()).resolves.toEqual([])
    expect((await fetch('apples/')).json()).resolves.toEqual([])
    expect((await fetch('/apples/')).json()).resolves.toEqual([])
  })

  it('should get an item', async () => {
    fotch.start()

    const apple = ls.create('apples', { color: 'red' })
    const response = await fetch(`/apples/${apple.id}`)

    expect(response.json()).resolves.toMatchObject(apple)
  })

  it('should get not found', async () => {
    fotch.start()

    try {
      await fetch('/apples/1')
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })

  it('should post an item', async () => {
    fotch.start()

    const apple = { color: 'red' }
    const response = await fetch('/apples', {
      method: 'POST',
      body: JSON.stringify(apple)
    })

    expect(response.json()).resolves.toMatchObject(apple)
  })

  it('should update an item', async () => {
    fotch.start()

    const apple = ls.create('apples', { color: 'red' })
    const patch = { color: 'green' }
    const response = await fetch(`/apples/${apple.id}`, {
      method: 'PUT',
      body: JSON.stringify(patch)
    })

    expect(response.json()).resolves.toMatchObject(patch)
  })

  it('should not update an item when not found', async () => {
    fotch.start()

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
    fotch.start()

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
    fotch.start()

    try {
      await fetch('/apples/1', { method: 'DELETE' })
      fail()
    } catch (error) {
      expect(error).toMatchObject({ status: 404 })
    }
  })

  it('should intercept specific calls', () => {
    const fetchSpy = (window.fetch = jest.fn())

    try {
      fetch('/apples')
    } catch (error) {}

    expect(fetchSpy.mock.calls.length).toBe(1)

    fotch.start('/api')

    try {
      fetch('/apples')
    } catch (error) {}

    expect(fetchSpy.mock.calls.length).toBe(2)

    try {
      fetch('/api/apples')
    } catch (error) {}

    expect(fetchSpy.mock.calls.length).toBe(2)
  })

  it('should wait for the response when delay props is passed', async () => {
    jest.useFakeTimers()

    const REQUEST_DELAY = 100

    fotch.start({
      delay: REQUEST_DELAY
    })

    const mockFuctionAfterResponse = jest.fn()
    fetch('/apples/').then(mockFuctionAfterResponse) // will be called after REQUEST_DELAY (100ms)

    jest.advanceTimersByTime(20)
    // let any pending callbacks in PromiseJobs run. ref.
    // https://stackoverflow.com/questions/52177631/jest-timer-and-promise-dont-work-well-settimeout-and-async-function/52196951#52196951
    await Promise.resolve()
    expect(mockFuctionAfterResponse).not.toHaveBeenCalled()

    jest.advanceTimersByTime(80)
    await Promise.resolve()
    expect(mockFuctionAfterResponse).toHaveBeenCalled()
  })
})
