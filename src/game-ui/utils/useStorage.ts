import { useState } from 'react';

export const useStorage = (
  propertyName: string,
): [string, (newValue: string) => void] => {
  const [value, setValue] = useState(
    localStorage.getItem(propertyName) || '',
  );

  return [
    value,
    (newValue: string) => {
      localStorage.setItem(propertyName, newValue);
      setValue(newValue);
    },
  ];
};
