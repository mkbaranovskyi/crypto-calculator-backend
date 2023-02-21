import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { UnauthorizedException } from '../../shared/errors';
import { VerificationCodeService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { statusOutputSuccess } from '../../shared/view-models';
import { CodeEmailSchema, ICodeEmailBodyInput } from './schemas';

export const codeEmailRoute: RouteCustomOptions<{ Body: ICodeEmailBodyInput }> = {
  url: '/email/code',
  method: 'POST',
  schema: CodeEmailSchema,
  handler: async (req, reply) => {
    const { email, code: receivedCode } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    const savedCode = await VerificationCodeEntity.findOneBy({ userId: user._id });

    try {
      VerificationCodeService.validateCode(savedCode, receivedCode);
    } catch (err: any) {
      throw new UnauthorizedException(err.message);
    }

    return statusOutputSuccess;
  },
};
