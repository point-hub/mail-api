import type { ISchemaValidation, IUpdateOutput, IUpdateRepository } from '@point-hub/papi'

import { CredentialEntity } from '../entity'
import { updateValidation } from '../validations/update.validation'

export interface IInput {
  _id: string
  data: {
    name: string
    callback_url: string
    token: string
    scopes: string[]
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

export class UpdateCredentialUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<IUpdateOutput> {
    // 1. define entity
    const credentialEntity = new CredentialEntity({
      name: input.data.name,
      callback_url: input.data.callback_url,
      token: input.data.token,
      scopes: input.data.scopes,
    })
    credentialEntity.generateUpdatedDate()
    const cleanEntity = deps.cleanObject(credentialEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, updateValidation)
    // 3. database operation
    return await deps.updateRepository.handle(input._id, cleanEntity, options)
  }
}
