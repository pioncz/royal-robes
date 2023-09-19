import { useState } from 'react';

export const useStorage = <T = string>(
  propertyName: string,
  defaultValue: T,
  convert?: (storageValue: string | null) => T,
): [T, (newValue: T) => void] => {
  const storageValue = localStorage.getItem(propertyName);

  let convertedValue: T;
  if (typeof defaultValue !== 'string' && convert) {
    convertedValue = convert(storageValue);
  } else {
    convertedValue = storageValue as T;
  }

  const [value, setValue] = useState<T>(
    convertedValue || defaultValue,
  );

  if (typeof defaultValue !== 'string' && !convert) {
    console.error(
      'Invalid options. For non string values provide convert function!',
    );
    return [defaultValue, () => {}];
  }

  return [
    value,
    (newValue: T) => {
      localStorage.setItem(propertyName, '' + newValue);
      setValue(newValue);
    },
  ];
};
