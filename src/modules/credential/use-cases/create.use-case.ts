import type {
  ICreateOutput,
  ICreateRepository,
  IRetrieveRepository,
  ISchemaValidation,
  TypeCodeStatus,
} from '@point-hub/papi'

import { CredentialEntity } from '../entity'
import { createValidation } from '../validations/create.validation'

export interface IInput {
  user_id: string
  name: string
  api_key: string
  callback_url: string
  token: string
  scopes: string[]
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  retrieveRepository: IRetrieveRepository
  schemaValidation: ISchemaValidation
  generateApiKey(): string
  hashApiKey(apiKey: string): string
  validateScopes(scopes: string[]): boolean
  validateUser(retrieveRepository: IRetrieveRepository, _id: string): Promise<boolean>
  throwApiError(codeStatus: TypeCodeStatus, errors?: object): void
}
export interface IOptions {
  session?: unknown
}

export class CreateCredentialUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. define entity
    const apiKey = deps.generateApiKey()
    const credentialEntity = new CredentialEntity({
      user_id: input.user_id,
      name: input.name,
      api_key: deps.hashApiKey(apiKey),
      callback_url: input.callback_url,
      token: input.token,
      scopes: input.scopes,
    })
    credentialEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(credentialEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, createValidation)
    // 3. validate user_id
    if (!(await deps.validateUser(deps.retrieveRepository, input.user_id))) {
      deps.throwApiError(422, {
        user_id: ['Invalid user'],
      })
    }
    // 4. validate scopes
    if (!deps.validateScopes(credentialEntity.data.scopes ?? [])) {
      deps.throwApiError(422, {
        scopes: ['Invalid scopes'],
      })
    }
    // 5. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    return {
      inserted_id: response.inserted_id,
      api_key: apiKey,
    }
  }
}
