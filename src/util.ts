import { CURRENCIES, MAIL_FORMAT } from "@interface/constant";
import { useState } from "react";

/**
 * Convert date to YYYY-MM-DD string in Asia/Jakarta timezone
 * @param {Date} date - input date
 * @returns {string} output date in YYYY-MM-DD string format
 */
export const formatDateSimple = (date: Date | undefined): string => {
  if (date === undefined) {
    return "";
  }
  const localeDateString = date.toLocaleDateString("en-US", {
    timeZone: "Asia/Jakarta",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const splitted = localeDateString.split("/");
  return `${splitted[2]}-${splitted[0]}-${splitted[1]}`;
};

/**
 * Convert date to YYYY-MM string
 * @param {Date} date - input date
 * @returns {string} output date in YYYY-MM string format
 */
export const formatDateShort = (date: Date): string => {
  let mm: any = date.getMonth() + 1;
  if (mm < 10) {
    mm = "0" + mm;
  }
  return `${date.getFullYear()}-${mm}`;
};

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      // Get from local storage by key
      if (typeof window !== "undefined") {
        const item = localStorage.getItem(key);
        // Parse stored json or if none return initialValue
        return item ? JSON.parse(item) : initialValue;
      }
    } catch (error) {
      // If error also return initialValue
      console.log(error);
      return initialValue;
    }
  });
  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = (value: T | ((val: T) => T)) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      // Save state
      setStoredValue(valueToStore);
      // Save to local storage
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      // A more advanced implementation would handle the error case
      console.log(error);
    }
  };
  return [storedValue, setValue] as const;
};

export const removeLocalStorageItem = (itemName: string) =>
  window.localStorage.removeItem(itemName);

/**
 * Convert enum to array
 * @param {enum} enumme - input enum
 * @returns {EnumArray} enum array output
 */
type EnumArray = {
  label: string;
  value: number;
};
export const enumToArray = (enumme: any): EnumArray[] => {
  return Object.keys(enumme)
    .filter((value: any): boolean => isNaN(Number(value)) === false)
    .map((key) => {
      return {
        label: enumme[key],
        value: parseInt(key, 10),
      };
    });
};

/**
 * Currency formatter
 * Convert number to currency
 */
const currencyFormatsMap = new Map<string, Intl.NumberFormat>();
CURRENCIES.forEach((currency) => {
  const numberFormat = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  currencyFormatsMap.set(currency, numberFormat);
});
export const formatCurrency = (
  currency: string,
  value: number | bigint
): string | undefined => currencyFormatsMap.get(currency)?.format(value);

/**
 * Log message from error response
 * @param {Error} error - error
 * @returns {String} error message
 */
export const logErrorResponse = (error: any): string => {
  // TODO: make to show up a snackbar everytime the API call return an error response
  console.log(error);

  let message: string = "";
  error instanceof Error ? (message = error.message) : (message = error);
  return message;
};

/**
 * Get current UNIX Timestamp in UTC
 * @returns {number} UNIX timestamp
 */
export const getUTCTimestamp = (): number => Math.floor(Date.now() / 1000);

/**
 * Validate a string is email or not
 * @param {string} inputText - the text that will be validated
 * @returns {boolean} true if the text is an email and vice versa
 */
export const ValidateEmail = (inputText: string): Boolean =>
  !!inputText.match(MAIL_FORMAT);

/**
 * Convert an object keys from snake case to camel case
 * @param {unknown} o input object
 * @returns {unknown} input object but in camel case
 */
export const snakeCaseKeysToCamelCase = function (o: any) {
  if (isObject(o)) {
    const n: any = {};

    Object.keys(o).forEach((k) => {
      n[toCamel(k)] = snakeCaseKeysToCamelCase(o[k]);
    });

    return n;
  } else if (isArray(o)) {
    return o.map((i: any) => {
      return snakeCaseKeysToCamelCase(i);
    });
  }

  return o;
};

const toCamel = (s: any) => {
  return s.replace(/([-_][a-z])/gi, ($1: any) => {
    return $1.toUpperCase().replace("-", "").replace("_", "");
  });
};

const isArray = function (a: any) {
  return Array.isArray(a);
};

const isObject = function (o: any) {
  return o === Object(o) && !isArray(o) && typeof o !== "function";
};
