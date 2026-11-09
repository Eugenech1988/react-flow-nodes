export function toSafeUser<T extends Record<string, unknown>>(user: T) {
  const {
    password: _password,
    twoFactorSecret: _twoFactorSecret,
    recoveryCodes: _recoveryCodes,
    ...safeUser
  } = user;
  return safeUser;
}
