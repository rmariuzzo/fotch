export interface Repository <E> {
  all(entity: string) : Array<E>,
  get(entity: string, id: string) : E,
  create(entity: string, data: any): E,
  update(entity: string, id: string, data: any): E,
  remove(entity: string, id: string): void,
}