export declare const toSafeUser: <T extends Record<string, unknown>>(user: T) => Omit<T, "password" | "twoFactorSecret" | "recoveryCodes">;
