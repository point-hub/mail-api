import type { IController, IControllerInput } from '@point-hub/papi'

import { version } from '@/../package.json'
import apiConfig from '@/config/api'
import corsConfig from '@/config/cors'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const healthController: IController = async (controllerInput: IControllerInput) => {
  return {
    status: 200,
    json: {
      version: version,
      status: 'healthy',
      timestamp: new Date(),
      cors: corsConfig.origin,
      api: apiConfig.baseUrl,
    },
  }
}
