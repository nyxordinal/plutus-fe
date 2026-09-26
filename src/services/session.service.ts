import { removeTokenCookie, removeUserCookie } from "@service/cookie.service";
import { removeLocalStorageItem } from "@util";
import { resetExpenseReduxStore } from "redux/expense";
import { resetIncomeReduxStore } from "redux/income";
import { store } from "redux/store";

const KEY_SESSION_EXPIRED = "sessionExpired";

type SessionExpiredHandler = () => void;

let sessionExpiredHandler: SessionExpiredHandler | null = null;
let expiringSession = false;

export const registerSessionExpiredHandler = (
  handler: SessionExpiredHandler | null
): void => {
  sessionExpiredHandler = handler;
};

const markSessionExpired = (): void => {
  try {
    window.sessionStorage.setItem(KEY_SESSION_EXPIRED, "1");
  } catch (error) {
  }
};

export const consumeSessionExpiredNotice = (): boolean => {
  try {
    const expired = window.sessionStorage.getItem(KEY_SESSION_EXPIRED) === "1";
    if (expired) window.sessionStorage.removeItem(KEY_SESSION_EXPIRED);
    return expired;
  } catch (error) {
    return false;
  }
};

export const clearSession = (): void => {
  store.dispatch(resetExpenseReduxStore());
  store.dispatch(resetIncomeReduxStore());
  removeTokenCookie();
  removeUserCookie();
  if (typeof window !== "undefined") {
    removeLocalStorageItem("updateDataExpense");
    removeLocalStorageItem("updateDataIncome");
  }
};

export const resetSessionExpiryGuard = (): void => {
  expiringSession = false;
};

export const expireSession = (): void => {
  if (typeof window === "undefined" || expiringSession) return;
  expiringSession = true;

  markSessionExpired();
  clearSession();

  if (sessionExpiredHandler) sessionExpiredHandler();
  else window.location.replace("/login");
};
