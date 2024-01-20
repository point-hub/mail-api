import express, { Express } from 'express'

import { IBaseAppInput } from './app'
import credentialRouter from './modules/credential/router'
import mailRouter from './modules/mail/router'
import userRouter from './modules/user/router'

export default async function (baseRouterInput: IBaseAppInput) {
  const app: Express = express()

  /**
   * Register all available modules
   * <modules>/router.ts
   */
  app.use('/v1/users', await userRouter(baseRouterInput))
  app.use('/v1/credentials', await credentialRouter(baseRouterInput))
  app.use('/v1/mails', await mailRouter(baseRouterInput))

  return app
}
