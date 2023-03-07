import { IJWTData } from '../../../types';

export interface IGenerateTokensOutput {
  accessToken: string;
  refreshToken: string;
  accessTokenExpiresIn: number;
  refreshTokenExpiresIn: number;
}

export type DecodeTokenOutput = IJWTData | null;
