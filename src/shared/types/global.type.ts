import { ObjectID } from 'typeorm';

export type ObjectIDByTypeORM = ObjectID;

export interface IObjectId {
  _id: ObjectIDByTypeORM;
}
