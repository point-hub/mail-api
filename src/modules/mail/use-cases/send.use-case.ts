import type { ICreateOutput, ICreateRepository, ISchemaValidation } from '@point-hub/papi'

import { ISendOptions } from '@/services/mailer'

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
  sendMail(data: ISendOptions): Promise<void>
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
    })
    mailEntity.generateCreatedDate()
    const cleanEntity = deps.cleanObject(mailEntity.data)
    // 2. validate schema
    await deps.schemaValidation(cleanEntity, sendValidation)
    // 3. database operation
    const response = await deps.createRepository.handle(cleanEntity, options)
    // 4. send email
    await deps.sendMail({
      to: input.to,
      subject: input.subject,
      html: input.html,
    })
    // 5. return response
    return response
  }
}
