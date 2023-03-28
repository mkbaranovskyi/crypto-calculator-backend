import { ObjectIDByTypeORM } from './global.type';
import { ISessionKeyData } from './session-key.type';

export interface IJWTPayload {
  sessionKey: ISessionKeyData;
  userId: ObjectIDByTypeORM;
}

export interface IJWTData extends IJWTPayload {
  exp: number;
  iat: number;
}
