import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { UserEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  name?: string
  username?: string
  email?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
}
export interface IOptions {
  session?: unknown
}

export class CreateUserUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. define entity
    const userEntity = new UserEntity({
      name: input.name,
      username: input.username,
      email: input.email,
    })
    userEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(userEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, createValidation)
    // 3. database operation
    return await deps.createRepository.handle(cleanEntity, options)
  }
}
