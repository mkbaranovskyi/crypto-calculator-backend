export interface IGenerateTokensInput {
  jwtSecret: string;
  sessionKey: string;
  accessLifetime: number;
  refreshLifetime: number;
}
