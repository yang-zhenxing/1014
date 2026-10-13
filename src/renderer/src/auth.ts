export const AUTH_SESSION_KEY = 'venture-research-terminal:session'

export function verifyCredentials(account: string, password: string): boolean {
  return account.trim() === 'admin' && password === '123123'
}
