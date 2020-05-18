import { Dispatch, useCallback, useEffect, useState } from 'react';

export default function useLocalStorage(
  key: string,
  initialValue: string = ''
): [any, Dispatch<string>] {
  const [value, setValue] = useState(
    () => window.localStorage.getItem(key) || initialValue
  );

  const setItem = (newValue: any) => {
    const stringified = JSON.stringify(newValue)
    setValue(stringified);
    window.localStorage.setItem(key, stringified);
  };

  useEffect(() => {
    const newValue = window.localStorage.getItem(key);
    if (value !== newValue) {
      setValue(newValue || initialValue);
    }
  }, [initialValue, key, value]);

  const handleStorage = useCallback(
    (event: StorageEvent) => {
      if (event.key === key && event.newValue !== value) {
        setValue(event.newValue || initialValue);
      }
    },
    [initialValue, key, value]
  );

  useEffect(() => {
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, [handleStorage]);

  const parsedValue = value ? JSON.parse(value) : "";
  return [parsedValue, setItem];
}