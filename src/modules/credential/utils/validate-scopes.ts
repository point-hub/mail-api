const availableScopes = ['mail:send']

export const validateScopes = (scopes: string[]) => {
  for (const scope of scopes) {
    if (!availableScopes.includes(scope)) {
      return false
    }
  }

  return true
}
