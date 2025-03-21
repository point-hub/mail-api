import { objClean } from '@point-hub/express-utils'
import type { IController, IControllerInput } from '@point-hub/papi'

import { Mailer } from '@/services/mailer'
import { schemaValidation } from '@/utils/validation'

import { CreateRepository } from '../repositories/create.repository'
import { SendMailUseCase } from '../use-cases/send.use-case'

export const sendController: IController = async (controllerInput: IControllerInput) => {
  let session
  try {
    // 1. start session for transactional
    session = controllerInput.dbConnection.startSession()
    session.startTransaction()
    // 2. define repository
    const createRepository = new CreateRepository(controllerInput.dbConnection)
    // 3. handle business rules
    const response = await SendMailUseCase.handle(
      controllerInput.httpRequest['body'],
      {
        cleanObject: objClean,
        createRepository,
        schemaValidation,
        sendMail: Mailer.send,
      },
      { session },
    )
    await session.commitTransaction()
    // 4. return response to client
    return {
      status: 201,
      json: {
        inserted_id: response.inserted_id,
      },
    }
  } catch (error) {
    await session?.abortTransaction()
    throw error
  } finally {
    await session?.endSession()
  }
}
