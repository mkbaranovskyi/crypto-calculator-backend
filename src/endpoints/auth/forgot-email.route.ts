import { DateTime } from 'luxon';
import { UserEntity, VerificationCodesEntity } from '../../shared/database';
import { EmailEnum } from '../../shared/enums';
import { BadRequestException, UnauthorizedException } from '../../shared/errors';
import { EmailService, VerificationCodeService } from '../../shared/services';
import { statusOutputSuccess } from '../../shared/view-models';
import { ForgotEmailSchema, IForgotEmailBodySchema } from './schemas';
import { RouteCustomOptions } from './types';

export const forgotEmailRoute: RouteCustomOptions<IForgotEmailBodySchema> = {
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

    const savedCode = await VerificationCodesEntity.findOneBy({ userId: String(user._id) });

    if (savedCode) {
      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(savedCode.createdAt).plus({ seconds: 90 });

      if (+currentDate < +codeExpiresAt) {
        throw new BadRequestException('Wait before you can request another code.');
      }

      await VerificationCodesEntity.delete({ userId: String(user._id) });
    }

    await VerificationCodesEntity.create({ userId: String(user._id), code, expiresAt }).save();
    await EmailService.sendMessageToEmail(email, code, EmailEnum.RECOVERY_LETTER);

    return statusOutputSuccess;
  },
};
