export default class RepositoryError extends Error {
  static NotFound = class extends RepositoryError {
    constructor(message: string) {
      super(message, 404)
    }
  }
  
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}