import { ISessionKeyData } from './session-key.type';

export interface IJWTData {
  sessionKey: ISessionKeyData;
  exp: number;
  iat: number;
}
