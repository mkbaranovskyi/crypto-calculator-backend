import { IObjectId } from './global.type';

export interface ICoinInfo {
  coinId: string;
  image: string;
  symbol: string;
  name: string;
}

export type AvialableCoinsType = ICoinInfo & IObjectId;
