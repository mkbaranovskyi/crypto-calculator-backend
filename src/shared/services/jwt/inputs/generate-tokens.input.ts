export interface IGenerateTokensInput {
  jwtSecret: string;
  sessionKey: string;
  accessLifetime: string;
  refreshLifetime: string;
}
