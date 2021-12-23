import { AsyncLocalStorage } from 'async_hooks';
import { UserEntity } from '../../database';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export const initAsyncLocalStorage = (): void => {
  asyncLocalStorage.enterWith(new Map());
};

export const setUser = (value: UserEntity): void => {
  asyncLocalStorage.getStore()!.set('user', value);
};

export const getUser = (): UserEntity => {
  return asyncLocalStorage.getStore()!.get('user');
};
