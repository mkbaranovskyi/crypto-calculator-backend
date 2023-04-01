import { IJWTPayload } from '../../../types';

export interface IGenerateTokensInput {
  payload: IJWTPayload;
  accessDeathDate: number;
  refreshDeathDate: number;
}
