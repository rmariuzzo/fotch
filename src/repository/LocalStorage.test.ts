import LocalStorage from './LocalStorage'

describe('LocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('should return array on all', () => {
    const ls = new LocalStorage()
    expect(ls.all(null)).toHaveLength(0)
    expect(ls.all(undefined)).toHaveLength(0)
    expect(ls.all('apples')).toHaveLength(0)
  })

  it('should error on invalid get', () => {
    const ls = new LocalStorage()
    expect(() => ls.get(null, null)).toThrow('not found')
    expect(() => ls.get(undefined, undefined)).toThrow('not found')
    expect(() => ls.get('apples', null)).toThrow('not found')
    expect(() => ls.get('apples', 1)).toThrow('not found')
  })

  it('should create item on create', () => {
    expect(() => {
      const ls = new LocalStorage()
      const data = { color: 'red' }
      const created = ls.create('apples', data)

      expect(created).toHaveProperty('id')
      expect(created).toMatchObject(data)

      const apple = ls.get('apples', created.id)

      expect(apple).toMatchObject(data)
    }).not.toThrow()
  })

  it('should update item on update', () => {
    expect(() => {
      const ls = new LocalStorage()
      const data = { color: 'red' }
      const created = ls.create('apples', data)

      expect(created).toHaveProperty('id')
      expect(created).toMatchObject(data)

      const apple = ls.get('apples', created.id)

      expect(apple).toMatchObject(data)

      const patch = { color: 'green' }
      const updated = ls.update('apples', apple.id, patch)

      expect(updated).toMatchObject(patch)
      expect(ls.get('apples', apple.id)).toMatchObject(updated)
    }).not.toThrow()
  })

  it('should remove item on remove', () => {
    expect(() => {
      const ls = new LocalStorage()
      const data = { color: 'red' }
      const created = ls.create('apples', data)

      expect(() => ls.get('apples', created.id)).not.toThrow()

      ls.remove('apples', created.id)

      expect(() => ls.get('apples', created.id)).toThrow('not found')
    }).not.toThrow()
  })
})
