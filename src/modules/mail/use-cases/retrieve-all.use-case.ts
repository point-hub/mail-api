import type { IQuery, IRetrieveAllOutput, IRetrieveAllRepository } from '@point-hub/papi'

export interface IInput {
  query: IQuery
}
export interface IDeps {
  retrieveAllRepository: IRetrieveAllRepository
}
export interface IOptions {
  session: unknown
}

export class RetrieveAllMailUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IRetrieveAllOutput> {
    const query = input.query
    query.sort = '-created_at'
    return await deps.retrieveAllRepository.handle(input.query, options)
  }
}
