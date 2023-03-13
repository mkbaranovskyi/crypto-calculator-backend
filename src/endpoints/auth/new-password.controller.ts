import { randomUUID } from 'crypto';
import { jwtConfig } from '../../shared/configs';
import { USER_STATE_COOKIE } from '../../shared/consts';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { USER_STATE } from '../../shared/enums';
import { UnauthorizedException } from '../../shared/errors';
import { HashingService, JWTService, VerificationCodeService } from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { INewPasswordBodyInput, newPasswordSchema } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const newPasswordController: ControllerOptions<{ Body: INewPasswordBodyInput }> = {
  url: '/email/new-password',
  method: 'POST',
  schema: newPasswordSchema,
  handler: async (req, reply) => {
    const { email, code: receivedCode, password: newPassword } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    const savedCode = await VerificationCodeEntity.findOneBy({ userId: String(user._id) });

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

    await VerificationCodeEntity.delete({ userId: String(user._id) });

    reply.setCookie(USER_STATE_COOKIE, USER_STATE.ACTIVATED);

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
