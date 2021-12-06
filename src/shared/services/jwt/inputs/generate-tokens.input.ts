export interface IGenerateTokensInput {
  jwtSecret: string;
  sessionKey: string;
  accessDeathDate: number;
  refreshDeathDate: number;
}
