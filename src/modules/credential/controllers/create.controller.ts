import { objClean, tokenGenerate, tokenSha256 } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { throwApiError } from '@/utils/throw-api-error'
import { schemaValidation } from '@/utils/validation'

import { CreateRepository } from '../repositories/create.repository'
import { RetrieveRepository } from '../repositories/retrieve.repository'
import { CreateCredentialUseCase } from '../use-cases/create.use-case'
import { validateScopes } from '../utils/validate-scopes'
import { validateUser } from '../utils/validate-user'

export const createCredentialController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createRepository = new CreateRepository(controllerInput.dbConnection)
    const retrieveRepository = new RetrieveRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await CreateCredentialUseCase.handle(
      controllerInput.httpRequest.body,
      {
        cleanObject: objClean,
        createRepository,
        retrieveRepository,
        schemaValidation,
        generateApiKey: tokenGenerate,
        hashApiKey: tokenSha256,
        throwApiError,
        validateScopes,
        validateUser,
      },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
        api_key: response.api_key,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
