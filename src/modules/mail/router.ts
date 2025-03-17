import { Router } from 'express'

import { IBaseAppInput } from '@/app'
import { makeController } from '@/express'

import * as controller from './controllers/index'

const makeRouter = async (routerInput: IBaseAppInput) => {
  const router = Router()

  router.post(
    '/',
    await makeController({
      controller: controller.sendController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.get(
    '/',
    await makeController({
      controller: controller.retrieveAllMailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  router.get(
    '/:id',
    await makeController({
      controller: controller.retrieveMailController,
      dbConnection: routerInput.dbConnection,
    }),
  )

  return router
}

export default makeRouter
