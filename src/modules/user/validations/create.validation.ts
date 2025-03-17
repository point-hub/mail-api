export const createValidation = {
  name: ['required', 'string'],
  username: ['required', 'string'],
  email: ['required', 'string', 'email'],
}
