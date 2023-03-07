import type { JwtPayload } from 'jsonwebtoken';

export interface IJWTData extends JwtPayload {
  sessionKey: string;
}
