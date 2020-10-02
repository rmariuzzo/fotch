import { Repository, Id } from './Repository'
import { NotFoundError } from '../error'

type Store = {
  data: Array<any>
  meta: {
    version: number
    lastId: string
  }
}

function read(key: string): Store | null {
  const source = localStorage.getItem(`__fotch_${key}`)
  return source ? JSON.parse(source) : null
}

function write(key: string, store: Store): void {
  localStorage.setItem(`__fotch_${key}`, JSON.stringify(store))
}

export default class LocalStorage implements Repository<Object> {
  constructor() {
    if (!self.localStorage) {
      throw new Error('localStorage must exist')
    }
  }

  all(name: string): any[] {
    const collection = read(name)
    return collection ? collection.data : []
  }

  get(name: string, id: Id): any {
    const collection = read(name)

    if (!collection) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    const record = collection.data.find((datum) => datum.id === id)

    if (!record) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    return record
  }

  create(name: string, data: any): any {
    const store = read(name) || { data: [], meta: { version: 1, lastId: '0' } }

    store.meta.lastId = data.id = `${Number(store.meta.lastId) + 1}`
    store.data.push(data)

    write(name, store)

    return data
  }

  update(name: string, id: Id, data: any): any {
    const store = read(name)

    if (!store) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    const item = store.data.find((datum) => datum.id === id)

    if (item === undefined) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    Object.assign(item, data)

    write(name, store)

    return item
  }

  remove(name: string, id: Id): void {
    const store = read(name)

    if (!store) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    const item = store.data.find((datum) => datum.id === id)

    if (item === undefined) {
      throw new NotFoundError(`${name} with id ${id} not found`)
    }

    const index = store.data.indexOf(item)

    store.data.splice(index, 1)

    write(name, store)
  }
}
