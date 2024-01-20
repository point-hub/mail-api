import type { IDeleteOutput, IDeleteRepository, ISchemaValidation } from '@point-hub/papi'

import { deleteValidation } from '../validations/delete.validation'

export interface IInput {
  _id: string
}
export interface IDeps {
  schemaValidation: ISchemaValidation
  deleteRepository: IDeleteRepository
}
export interface IOptions {
  session?: unknown
}

export class DeleteUserUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IDeleteOutput> {
    // 1. validate schema
    await deps.schemaValidation(input, deleteValidation)
    // 2. database operation
    return await deps.deleteRepository.handle(input._id, options)
  }
}
