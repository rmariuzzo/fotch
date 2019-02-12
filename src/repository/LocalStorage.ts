import { Repository, Id } from './Repository'
import { RepositoryError } from '../error/index'

type Store = {
  data: Array<any>
  meta: any
}

function read(key: string): Store | null {
  const source = localStorage.getItem(key)
  return JSON.parse(source)
}

function write(key: string, store: Store): void {
  localStorage.setItem(key, JSON.stringify(store))
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
      throw new RepositoryError.NotFound(`${name} with id ${id} not found`)
    }

    const record = collection.data.find(datum => datum.id === id)

    if (!record) {
      throw new RepositoryError.NotFound(`${name} with id ${id} not found`)
    }

    return record
  }

  create(name: string, data: any): any {
    const store = read(name) || { data: [], meta: [] }
    const lastItem = store.data[store.data.length - 1] || { id: 0 }

    data.id = `${Number(lastItem.id) + 1}`
    store.data.push(data)

    write(name, store)

    return data
  }

  update(name: string, id: Id, data: any): any {
    const store = read(name)
    const item = store.data.find(datum => datum.id === id)

    Object.assign(item, data)

    write(name, store)

    return item
  }

  remove(name: string, id: Id): void {
    const store = read(name)
    const item = store.data.find(datum => datum.id === id)
    const index = store.data.indexOf(item)

    store.data.splice(index, 1)

    write(name, store)
  }
}
