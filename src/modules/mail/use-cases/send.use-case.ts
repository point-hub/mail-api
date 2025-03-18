import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import type { ISendMail } from '@/services/mailer'

import { MailEntity } from '../entity'
import { sendValidation } from '../validations/send.validation'

export interface IInput {
  to?: string
  subject?: string
  html?: string
}
export interface IDeps {
  cleanObject(object: object): object
  createRepository: ICreateRepository
  schemaValidation: ISchemaValidation
  sendMail: ISendMail
}
export interface IOptions {
  session?: unknown
}

export class SendMailUseCase {
  static async handle(input: IInput, deps: IDeps, options?: IOptions): Promise<ICreateOutput> {
    // 1. define entity
    const mailEntity = new MailEntity({
      to: input.to,
      subject: input.subject,
      html: input.html,
      created_at: new Date(),
    })
    const cleanEntity = deps.cleanObject(mailEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, sendValidation)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    // TODO: 4. check api key
    // TODO: 5. sanitize html
    // 6. send email
    await deps.sendMail({
      to: input.to,
      subject: input.subject,
      html: input.html,
    })
    // 7. return response
    return response
  }
}
