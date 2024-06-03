import { appSettings } from '../../../settings/app-settings';
import * as process from 'process';

export const jwtConstants = {
  secret: process.env.JWT_SECRET,
};
