import type { IController, IControllerInput } from '@point-hub/papi'

import { RetrieveAllRepository } from '../repositories/retrieve-all.repository'
import { RetrieveAllCredentialUseCase } from '../use-cases/retrieve-all.use-case'

export const retrieveAllCredentialController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const retrieveAllRepository = new RetrieveAllRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await RetrieveAllCredentialUseCase.handle(
      { query: controllerInput.httpRequest.query },
      { retrieveAllRepository },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 200,
      json: {
        data: response.data,
        pagination: response.pagination,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
