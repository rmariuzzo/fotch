import Repository from "./Repository"

type Store = {
  data: Array<any>,
  meta: any,
}

function read(key: string) : Store | null {
  const source = localStorage.getItem(key)
  return JSON.parse(source)
}

function write(key: string, store: Store) : void {
  localStorage.setItem(key, JSON.stringify(store))
}

export default class LocalStorage implements Repository<Object> {
  constructor() {
    if (!self.localStorage) {
      throw new Error('localStorage must exist')
    }
  }

  all(name: string): Object[] {
    return read(name).data
  }

  get(name: string, id: string): Object {
    const record = read(name).data.find(datum => datum.id === id)

    if (!record) {
      throw new Error(`${name} with id ${id} not found`)
    }

    return record
  }

  create(name: string, data: any): Object {
    const store = read(name)
    const lastItem = store.data[store.data.length - 1]

    data.id = `${Number(lastItem.id) + 1}`
    store.data.push(data)

    write(name, store)

    return data
  }

  update(name: string, id: string, data: any): Object {
    const store = read(name)
    const item = store.data.find(datum => datum.id === id)
    
    Object.assign(item, data)

    write(name, store)

    return item
  }

  remove(name: string, id: string): void {
    const store = read(name)
    const item = store.data.find(datum => datum.id === id)
    const index = store.data.indexOf(item)

    store.data.splice(index, 1)
    
    write(name, store)
  }
}