export type Id = number | string

/**
 * The Repository interface defines the contract of a data repository.
 */
export interface Repository<E> {
  /**
   * Return all items from a collection.
   * @param {string} name - The name of the collection.
   * @return {array}
   */
  all(name: string): Array<E>

  /**
   * Return an item from a collection by id.
   * @param {string} name - The name of the collection.
   * @param {number|string} id - The id.
   * @return {Object}
   */
  get(name: string, id: Id): E

  /**
   * Create a new item in a collection.
   * @param {string} name - The name of the collection.
   * @param {Object} data - The data of the new item to create.
   * @return {Object}
   */
  create(name: string, data: any): E

  /**
   * Update an item from a collection.
   * @param {string} name - The name of the collection.
   * @param {number|string} id - The id.
   * @param {String} data - The data containing the patch to apply.
   */
  update(name: string, id: Id, data: any): E

  /**
   * Remove an item from a collection.
   * @param {string} name - The name of the collection.
   * @param {number|string} id - The id.
   */
  remove(name: string, id: Id): void
}
