import RepositoryError from './RepositoryError'

export default class NotFoundError extends RepositoryError {
  constructor(message: string) {
    super(message, 404)
  }
}
