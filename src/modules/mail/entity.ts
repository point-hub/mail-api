import { IMailEntity } from './interface'

export const collectionName = 'mails'

export class MailEntity {
  constructor(public data: IMailEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
