import { DEFAULT_TOKEN_LIFETIME_DAYS } from "@interface/constant";
import { User } from "@interface/entity.interface";
import Cookies from "js-cookie";

// Token Name for JWT Token
const KEY_TOKEN = "32EML6C5fJYjrUFe";

// Token Name for user data
const KEY_USER = "akszdrhh7Yz4GShe";

// Browsers cap cookie lifetimes at 400 days, an expiry past that means the exp
// claim is not in the unit we expect
const MAX_TOKEN_LIFETIME_MS = 400 * 24 * 60 * 60 * 1000;

const getTokenExpiry = (token: string): Date | null => {
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const { exp } = JSON.parse(window.atob(padded));
    if (typeof exp !== "number" || !isFinite(exp)) return null;

    const expiry = new Date(exp * 1000);
    return expiry.getTime() - Date.now() > MAX_TOKEN_LIFETIME_MS
      ? null
      : expiry;
  } catch (error) {
    return null;
  }
};

// Keeps the session cookies from outliving the token the server issued
const getSessionCookieExpiry = (token: string): Date | number =>
  getTokenExpiry(token) || DEFAULT_TOKEN_LIFETIME_DAYS;

export const getTokenCookie = (): string => {
  return Cookies.get(KEY_TOKEN) || "";
};

export const setTokenCookie = (token = ""): void => {
  Cookies.set(KEY_TOKEN, token, { expires: getSessionCookieExpiry(token) });
};

export const removeTokenCookie = (): void => {
  Cookies.remove(KEY_TOKEN);
};

export const getUserCookie = (): string => {
  return Cookies.get(KEY_USER) || "";
};

// Must be called after setTokenCookie to mirror the token lifetime
export const setUserCookie = (user: User): void => {
  Cookies.set(KEY_USER, JSON.stringify(user), {
    expires: getSessionCookieExpiry(getTokenCookie()),
  });
};

export const removeUserCookie = (): void => {
  Cookies.remove(KEY_USER);
};

export const isTokenExpired = (token: string): boolean => {
  const expiry = getTokenExpiry(token);
  return expiry !== null && expiry.getTime() <= Date.now();
};

export const hasValidTokenCookie = (): boolean => {
  const token = getTokenCookie();
  return Boolean(token) && !isTokenExpired(token);
};
