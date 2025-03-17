export interface ICredentialEntity {
  _id?: string
  user_id?: string
  /**
   * The name of your credential. This name is only used to identify
   * the project or apps or website using this services
   */
  name?: string
  /**
   * Api Key to use Mail API Services
   */
  api_key?: string
  /**
   * Call this url to notify email is sent
   */
  callback_url?: string
  /**
   * Put your token here to authorize callback url
   */
  token?: string
  /**
   * Scopes access
   */
  scopes?: string[]
  created_date?: Date
  updated_date?: Date
}
