import { useState } from "react";

export const formatDateSimple = (date: Date): string => {
    const localeDateString = date.toLocaleDateString('en-US', {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });
    const splitted = localeDateString.split('/');
    const year = splitted[2];
    const month = splitted[0];
    const day = splitted[1];
    const formattedDate = `${year}-${month}-${day}`;

    return formattedDate
}

export const formatDateShort = (date: Date): string => {
    let mm: any = date.getMonth() + 1;
    if (mm < 10) {
        mm = '0' + mm;
    }
    return `${date.getFullYear()}-${mm}`
}

export const useLocalStorage = <T>(key: string, initialValue: T) => {
    // State to store our value
    // Pass initial state function to useState so logic is only executed once
    const [storedValue, setStoredValue] = useState<T>(() => {
        try {
            // Get from local storage by key
            const item = window.localStorage.getItem(key);
            // Parse stored json or if none return initialValue
            return item ? JSON.parse(item) : initialValue;
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
}

export const StringIsNumber = (value: any) => isNaN(Number(value)) === false;

export const ToArray = (enumme: any) => {
    return Object.keys(enumme)
        .filter(StringIsNumber)
        .map(key => {
            return {
                label: enumme[key],
                value: parseInt(key, 10)
            }
        });
}