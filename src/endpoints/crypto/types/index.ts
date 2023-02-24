import { ObjectID } from 'typeorm';

interface IId {
  _id: ObjectID;
}

interface IAvialableCoins {
  name: string;
  coinId: string;
  image: string;
  symbol: string;
}

export type AvialableCoinsType = IAvialableCoins & IId;

export const selectKeys: Array<keyof IAvialableCoins> = ['coinId', 'image', 'name', 'symbol'];
