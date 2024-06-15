import { appSettings } from '../../../settings/app-settings';
import * as process from 'process';

export const jwtConstants = {
  secret: appSettings.api.JWT_SECRET,
};
