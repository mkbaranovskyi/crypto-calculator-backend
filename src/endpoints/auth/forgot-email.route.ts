import { DateTime } from 'luxon';
import { emailConfig } from '../../shared/configs';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { EmailEnum } from '../../shared/enums';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import { EmailService, VerificationCodeService } from '../../shared/services';
import { RouteCustomOptions } from '../../shared/types';
import { ForgotEmailSchema, IForgotEmailBodyInput } from './schemas';

export const forgotEmailRoute: RouteCustomOptions<{ Body: IForgotEmailBodyInput }> = {
  url: '/email/forgot',
  method: 'POST',
  schema: ForgotEmailSchema,
  handler: async (req, reply) => {
    const { email } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (!user) {
      throw new UnauthorizedException('Email does not exist.');
    }

    const { code, expiresAt } = VerificationCodeService.createCode();

    const savedCode = await VerificationCodeEntity.findOneBy({ userId: String(user._id) });

    if (savedCode) {
      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(savedCode.createdAt).plus({
        seconds: emailConfig.expiresIn,
      });

      if (+currentDate < +codeExpiresAt) {
        throw new BadRequestException('Wait before you can request another code.');
      }

      await VerificationCodeEntity.delete({ userId: String(user._id) });
    }

    await VerificationCodeEntity.create({ userId: String(user._id), code, expiresAt }).save();
    await EmailService.sendMessageToEmail(email, code, EmailEnum.RECOVERY_LETTER);

    return { emailCodeExpiresIn: DateTime.fromJSDate(expiresAt).toMillis() };
  },
};
