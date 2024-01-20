import { IRetrieveRepository } from '@point-hub/papi'

export const validateUser = async (retrieveRepository: IRetrieveRepository, _id: string) => {
  const result = await retrieveRepository.handle(_id)
  if (!result) {
    return false
  }
  return true
}
