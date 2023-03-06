import { DateTime } from 'luxon';
import { MIN_COIN_DATE } from '../../../shared/consts';
import { BadRequestException } from '../../../shared/errors';
import { isSameDate } from '../../../shared/services/crypto';
import { ICoinListBodyInput } from '../schemas';

export const validateCoinListInput = ({
  startDate,
  endDate,
  monthlyInvestment,
}: ICoinListBodyInput) => {
  const minDate = DateTime.fromISO(MIN_COIN_DATE).toMillis();
  const currentDate = DateTime.now().toMillis();

  if (startDate < minDate) {
    throw new BadRequestException(`Start date cannot be less than ${MIN_COIN_DATE}.`);
  }

  if (startDate > currentDate) {
    throw new BadRequestException('Start date cannot be greater than today.');
  }

  if (
    endDate > currentDate ||
    isSameDate(DateTime.fromMillis(startDate), DateTime.fromMillis(endDate))
  ) {
    throw new BadRequestException('End date cannot be greater than or the same as start date.');
  }

  if (startDate > endDate) {
    throw new BadRequestException('Start date cannot be less than end date.');
  }

  if (monthlyInvestment < 20) {
    throw new BadRequestException('Monthly investment cannot be less than 20$.');
  }
};
