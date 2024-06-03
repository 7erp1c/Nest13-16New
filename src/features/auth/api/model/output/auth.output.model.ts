import { getAuthTypeEndpointMe } from './output';
import { UserOutput } from '../../../../users/api/models/output/output';
import { ObjectId } from 'mongoose';

export const getAuthUsersView = (
  dbAuthUsers: UserOutput,
): getAuthTypeEndpointMe => {
  return {
    email: dbAuthUsers.email,
    login: dbAuthUsers.login,
    userId: (dbAuthUsers._id as ObjectId).toString(),
  };
};
