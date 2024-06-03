import jwt from 'jsonwebtoken';
import { Injectable } from '@nestjs/common';
import { RefreshTokenPayloadType } from './type/jwt.type';
import { appSettings } from '../../../settings/app-settings';
import { ObjectId } from 'mongodb';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../../features/auth/setting/constants';

@Injectable()
export class TokenService {
  constructor(private jwtService: JwtService) {}
  // async addTokenInDB(token: string) {
  //   const decode = await this.decodeRefreshToken(token);
  //   // const createToken = {
  //   //   oldToken: token,
  //   //   userId: decode?.userId,
  //   //   deviceId: decode?.deviceId,
  //   //   isValid: true,
  //   // };
  //   // // const oldToken = await this.refreshTokenRepository.addToken(createToken);
  //   // // if (!oldToken) return null;
  //   return true;
  // }
  // async twoToken(
  //   id: string,
  //   /*deviceTitle: string,
  //   ip: string,*/
  // ): Promise<twoTokenType> {
  //   const access = await this.createJWT(id);
  //   const refresh = await this.createJWTRefresh(id);

  // if (!access || !refresh)
  //   throw new UnauthorizedException('The token has not been created');
  // const createSessions = await this.securityService.createAuthSession(
  //   refresh,
  //   deviceTitle,
  //   ip,
  // );
  // if (!createSessions)throw new UnauthorizedException('The token has not been created');
  // await this.addTokenInDB(refresh);
  // return {
  //   access,
  //   refresh,
  // };
  // }
  // async tokenUpdate(id: string, token: string): Promise<twoTokenType | null> {
  //   const access = await this.createJWT(id);
  //   const refresh = await this.updateJWTRefresh(token);
  //
  //   if (!access || !refresh)
  //     throw new UnauthorizedException('The token has not been created');
  //   await this.addTokenInDB(refresh);
  //   return {
  //     access,
  //     refresh,
  //   };
  // }
  //создание access токена
  async createJWT(id: string) {
    const payload = { userId: id };
    return this.jwtService.signAsync(payload, { secret: jwtConstants.secret });
    // jwt.sign({ userId: id }, appSettings.api.JWT_SECRET, {
    //   expiresIn: appSettings.api.ACCESS_TOKEN_EXPIRATION_TIME,
    // });
  }
  //создание refresh токена
  async createJWTRefresh(id: string) {
    const payload = { userId: id };
    return this.jwtService.sign(payload, { secret: jwtConstants.secret });

    // const deviceId = uuidv4();
    // return jwt.sign(
    //   { userId: id /*, deviceId: deviceId*/ },
    //   appSettings.api.JWT_SECRET,
    //   {
    //     expiresIn: appSettings.api.REFRESH_TOKEN_EXPIRATION_TIME,
    //   },
    // );
  }
  //обновление refresh токена
  async updateJWTRefresh(token: string) {
    const decode = await this.decodeRefreshToken(token);
    const newToken = jwt.sign(
      {
        userId: decode?.userId,
        deviceId: decode?.deviceId,
      },
      appSettings.api.JWT_SECRET,
      { expiresIn: appSettings.api.REFRESH_TOKEN_EXPIRATION_TIME },
    );
    // const updateDataRefreshToken =
    //   await this.securityService.updateDataRefreshTokenInSession(newToken);

    if (!newToken) return null;
    return newToken;
  }
  //userId in global variable
  async getIdFromToken(token: string) {
    try {
      //достаём из token userId
      const result: any = jwt.verify(token, appSettings.api.JWT_SECRET);
      return new ObjectId(result.userId).toString();
    } catch (error) {
      return null;
    }
  }
  // async updateDBJWT(token: string) {
  //   await this.refreshTokenRepository.updateRefreshValid(token);
  // }
  async decode(token: string) {
    return jwt.decode(token);
  }
  async decodeRefreshToken(
    token: string,
  ): Promise<RefreshTokenPayloadType | null> {
    const decodedToken: any = await this.decode(token);
    if (!decodedToken) return null;
    return {
      userId: decodedToken.userId,
      deviceId: decodedToken.deviceId,
      iat: decodedToken.iat,
      exp: decodedToken.exp,
    };
  }
  // async checkToken(token: string) {
  //   return await this.refreshTokenRepository.checkToken(token);
  // }
  // async updateRefreshValid(token: string) {
  //   await this.refreshTokenRepository.updateRefreshValid(token);
  // }
  // async deleteByDeviseId(deviseId: string) {
  //   return await this.refreshTokenRepository.deleteByDeviseId(deviseId);
  // }
}
