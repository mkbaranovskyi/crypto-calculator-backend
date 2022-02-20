import { AsyncLocalStorage } from 'async_hooks';
import { UserEntity } from '../../database';

export const asyncLocalStorage = new AsyncLocalStorage<Map<string, any>>();

export const initAsyncLocalStorage = (done: (err?: Error) => void): void => {
  asyncLocalStorage.run(new Map(), () => {
    done();
  });
};

export const setUser = (value: UserEntity): void => {
  asyncLocalStorage.getStore()!.set('user', value);
};

export const getUser = (): UserEntity => {
  return asyncLocalStorage.getStore()!.get('user');
};
