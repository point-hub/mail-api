import { faker } from '@faker-js/faker'
import { BaseFactory, type IDatabase } from '@point-hub/papi'

import { ICredentialEntity } from './interface'
import { CreateRepository } from './repositories/create.repository'
import { CreateManyRepository } from './repositories/create-many.repository'

export default class CredentialFactory extends BaseFactory<ICredentialEntity> {
  constructor(public dbConnection: IDatabase) {
    super()
  }

  definition() {
    return {
      user_id: faker.person.fullName(),
      api_key: faker.string.uuid(),
      token: faker.string.uuid(),
      callback_url: faker.internet.url(),
      name: faker.person.fullName(),
      username: faker.internet.userName(),
      email: faker.internet.email(),
      created_date: new Date(),
      scopes: ['email:send'],
    }
  }

  async create() {
    const createRepository = new CreateRepository(this.dbConnection)
    return await createRepository.handle(this.makeOne())
  }

  async createMany(count: number) {
    const createManyRepository = new CreateManyRepository(this.dbConnection)
    return await createManyRepository.handle(this.makeMany(count))
  }
}
