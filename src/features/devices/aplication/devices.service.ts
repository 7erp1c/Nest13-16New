import {
  SessionInputModel,
  SessionModel,
} from '../api/model/input/session.input.models';
import { TokenService } from '../../../common/service/jwt/token.service';
import { UnauthorizedException } from '@nestjs/common';
import { RandomNumberService } from '../../../common/service/random/randomNumberUUVid';
import { DeviceRepository } from '../infrastructure/device.repository';

export class DevicesService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly randomNumberService: RandomNumberService,
    private readonly deviceRepository: DeviceRepository,
  ) {}
  async createSession(
    sessionInputModel: SessionInputModel,
    userId: string,
    userName: string,
  ) {
    const deviceId = await this.randomNumberService.generateRandomUUID();
    console.log('deviceId: ', deviceId);
    const tokenAccess = await this.tokenService.createJWT(userId, userName);
    const tokenRefresh = await this.tokenService.createJWTRefresh(
      userId,
      userName,
    );
    if (!tokenAccess || !tokenRefresh)
      throw new UnauthorizedException('Token not created');
    const tokenData = await this.tokenService.decodeRefreshToken(tokenRefresh);
    if (!tokenData) throw new UnauthorizedException('Token not decoded');

    const sessionModel: SessionModel = {
      userId: userId,
      deviceId: deviceId,
      deviceTitle: sessionInputModel.deviceTitle,
      ip: sessionInputModel.ip,
      lastActiveDate: tokenData.iat,
      refreshToken: {
        createdAt: tokenData.iat,
        expiredAt: tokenData.exp,
      },
    };

    await this.deviceRepository.createNewSession(sessionModel);
    //возвращаем two token:
    return { tokenAccess, tokenRefresh };
  }
}
