import { ObjectID } from 'typeorm';
import { LoggerInstance, SessionKeyService } from '../../services';
import { ISessionKeyData } from '../../types';
import { UserEntity } from '../entities';

export const findOneBySessionKey = async (inputSessionKey: ISessionKeyData) => {
  const user = await UserEntity.findOne({
    where: {
      sessionKeys: { $eq: inputSessionKey },
    } as any,
  });

  if (user) {
    const validSessionKeys = user.sessionKeys.filter((sessionKey) =>
      SessionKeyService.isValid(sessionKey)
    );

    await UserEntity.update({ _id: user._id }, { sessionKeys: validSessionKeys });
  }

  return user;
};

export const pushSessionKeyById = async (userId: ObjectID, sessionKey: ISessionKeyData) => {
  const user = await UserEntity.findOneBy({ _id: userId });
  if (user) {
    await UserEntity.update({ _id: userId }, { sessionKeys: [...user.sessionKeys, sessionKey] });
  } else {
    LoggerInstance.warn(`UserID ${userId} not found when updating document.`);
  }
};
