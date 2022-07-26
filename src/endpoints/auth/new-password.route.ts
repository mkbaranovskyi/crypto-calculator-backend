import { randomUUID } from 'crypto';
import { jwtConfig } from '../../shared/configs';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { UnauthorizedException } from '../../shared/errors';
import { HashingService, JWTService, VerificationCodeService } from '../../shared/services';
import { INewPasswordBodyInput, newPasswordSchema } from './schemas';
import { RouteCustomOptions } from './types';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const newPasswordRoute: RouteCustomOptions<INewPasswordBodyInput> = {
  url: '/email/new-password',
  method: 'POST',
  schema: newPasswordSchema,
  handler: async (req, reply) => {
    const { email, code: receivedCode, password: newPassword } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    const savedCode = await VerificationCodesEntity.findOneBy({
      userId: String(user._id),
    });

    try {
      VerificationCodeService.validateCode(savedCode, receivedCode);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }

    const sessionKey = randomUUID();
    const salt = randomUUID();
    const newPasswordHash = HashingService.createHash(newPassword, sessionKey);

    await UserEntity.update(user._id, {
      passwordHash: newPasswordHash,
      sessionKey,
      salt,
    });

    await VerificationCodesEntity.delete({ userId: String(user._id) });

    const { accessToken, refreshToken, accessTokenExpiresIn, refreshTokenExpiresIn } =
      await JWTService.generateTokens({
        sessionKey,
        jwtSecret: secret,
        accessDeathDate,
        refreshDeathDate,
      });

    return {
      accessToken,
      refreshToken,
      accessTokenExpiresIn,
      refreshTokenExpiresIn,
    };
  },
};
