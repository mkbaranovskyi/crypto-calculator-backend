import { jwtConfig } from '../../shared/configs';
import { UserEntity, UserRepository, VerificationCodeEntity } from '../../shared/database';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import {
  JWTService,
  LoggerInstance,
  SessionKeyService,
  VerificationCodeService,
} from '../../shared/services';
import { ControllerOptions } from '../../shared/types';
import { IValidateEmailBodyInput, validateEmailSchema } from './schemas';

const { secret, accessDeathDate, refreshDeathDate } = jwtConfig;

export const validateEmailController: ControllerOptions<{ Body: IValidateEmailBodyInput }> = {
  url: '/email/validate',
  method: 'POST',
  schema: validateEmailSchema,
  handler: async (req, reply) => {
    const { code: receivedCode, email } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new BadRequestException('User does not exist.');
    }

    const savedCode = await VerificationCodeEntity.findOneBy({ userId: String(user._id) });

    try {
      VerificationCodeService.validateCode(savedCode, receivedCode);
    } catch (err: any) {
      LoggerInstance.error('Verification code error.');
      throw new UnauthorizedException(err.message);
    }

    const sessionKey = SessionKeyService.create();

    UserRepository.pushSessionKeyById(user._id, sessionKey);

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
