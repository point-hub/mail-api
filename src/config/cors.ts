export interface ICorsConfig {
  origin: string
  credentials: boolean
}

export const origin = `${process.env['CLIENT_URL']}`
export const credentials = process.env['CORS_CREDENTIALS'] === 'true' ? true : false

const corsConfig: ICorsConfig = {
  origin,
  credentials,
}

export default corsConfig
