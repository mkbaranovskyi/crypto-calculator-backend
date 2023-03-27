import { ISessionKeyData } from '../../../types';

export interface IGenerateTokensInput {
  jwtSecret: string;
  sessionKey: ISessionKeyData;
  accessDeathDate: number;
  refreshDeathDate: number;
}
