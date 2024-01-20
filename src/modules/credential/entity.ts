import { ICredentialEntity } from './interface'

export const collectionName = 'credentials'

export class CredentialEntity {
  constructor(public data: ICredentialEntity) {}

  public generateCreatedDate() {
    this.data.created_date = new Date()
  }

  public generateUpdatedDate() {
    this.data.updated_date = new Date()
  }
}
