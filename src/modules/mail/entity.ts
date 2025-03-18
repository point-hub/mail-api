import type { IMailEntity } from './interface'

export const collectionName = 'mails'

export class MailEntity {
  constructor(public data: IMailEntity) {}
}
