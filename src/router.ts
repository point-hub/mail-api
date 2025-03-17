import express, { type Express } from 'express'

import type { IBaseAppInput } from './app'
import credentialRouter from './modules/credential/router'
import healthRouter from './modules/health/router'
import mailRouter from './modules/mail/router'
import userRouter from './modules/user/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/', await healthRouter(baseRouterInput))
  app.use('/v1/health', await healthRouter(baseRouterInput))
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/credentials', await credentialRouter(baseRouterInput))
  app.use('/v1/mails', await mailRouter(baseRouterInput))

  return app
}
