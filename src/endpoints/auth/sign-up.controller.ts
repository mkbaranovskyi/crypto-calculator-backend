import { DateTime } from 'luxon';
import { emailConfig } from '../../shared/configs';
import { UserEntity, VerificationCodeEntity } from '../../shared/database';
import { EMAIL_TYPE } from '../../shared/enums';
import { BadRequestException, InternalServerError } from '../../shared/errors';
import { EmailService, VerificationCodeService } from '../../shared/services';
import { LoggerInstance } from '../../shared/services/logger';
import { ControllerOptions } from '../../shared/types';
import { ISignUpBodyInput, signUpSchema } from './schemas';

export const signUpController: ControllerOptions<{ Body: ISignUpBodyInput }> = {
  url: '/sign-up',
  method: 'POST',
  schema: signUpSchema,
  handler: async (req, reply) => {
    const { email } = req.body;

    const user = await UserEntity.findOneBy({ email });

    if (user) {
      throw new BadRequestException('User exists.');
    }

    const dataUser = await UserEntity.create({ email }).save();
    const userId = String(dataUser._id);

    const savedCode = await VerificationCodeEntity.findOneBy({ userId });

    if (savedCode) {
      const currentDate = DateTime.utc();
      const codeExpiresAt = DateTime.fromJSDate(savedCode.createdAt).plus({
        seconds: emailConfig.expiresIn,
      });

      if (+currentDate < +codeExpiresAt) {
        throw new BadRequestException('Wait before you can request another code.');
      }

      await VerificationCodeEntity.delete({ userId });
    }

    const { code, expiresAt } = VerificationCodeService.createCode();

    await VerificationCodeEntity.create({ userId, code, expiresAt }).save();

    try {
      await EmailService.sendMessageToEmail(email, code, EMAIL_TYPE.SIGN_IN_LETTER);
    } catch (err) {
      LoggerInstance.error('Send message to email error.');
      new InternalServerError(err);
    }

    return {
      emailCodeExpiresIn: expiresAt,
    };
  },
};
