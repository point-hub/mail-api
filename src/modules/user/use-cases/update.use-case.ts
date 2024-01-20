import type { ISchemaValidation, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name?: string
    username?: string
    email?: string
  }
}
export interface IDeps {
  cleanObject(object: object): object
  updateRepository: IUpdateRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class UpdateUserUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. define entity
    const userEntity = new UserEntity({
      name: input.data.name,
      username: input.data.username,
      email: input.data.email,
    })
    userEntity.generateUpdatedDate()
    const cleanEntity = deps.cleanObject(userEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, updateValidation)
    // 3. database operation
    return await deps.updateRepository.handle(input._id, cleanEntity, options)
  }
}
