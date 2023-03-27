import { ObjectID } from 'typeorm';
import { SessionKeyService } from '../../services';
import { ISessionKeyData } from '../../types';
import { MongoManager } from '../connection';
import { UserEntity } from '../entities';

export const findOneBySessionKey = async (inputSessionKey: ISessionKeyData) => {
  const user = await MongoManager.findOne(UserEntity, {
    where: {
      sessionKeys: { $elemMatch: { id: inputSessionKey.id } },
    },
  });

  if (user) {
    const invalidSessionKeys = user.sessionKeys.filter(
      (sessionKey) => !SessionKeyService.isValid(sessionKey)
    );

    MongoManager.updateOne(
      UserEntity,
      {
        _id: user._id,
      },
      { $pull: { sessionKeys: { $in: invalidSessionKeys } } }
    );
  }

  return user;
};

export const pushSessionKeyById = async (userId: ObjectID, sessionKey: ISessionKeyData) => {
  await MongoManager.updateOne(
    UserEntity,
    {
      _id: userId,
    },
    { $push: { sessionKeys: sessionKey } }
  );
};
