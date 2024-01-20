export const createValidation = {
  user_id: ['required', 'string'],
  name: ['required', 'string'],
  callback_url: ['required', 'string', 'url'],
  token: ['required', 'string'],
  scopes: ['required', 'array'],
}
