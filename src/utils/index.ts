import { customAlphabet } from 'nanoid';

export const generateEntityId = (): string => {
  const nanoid = customAlphabet(
    '123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
    10,
  );
  return nanoid();
};

export const shuffle = (array: any[]): any[] => {
  return array.sort(() => 0.5 - Math.random());
};
