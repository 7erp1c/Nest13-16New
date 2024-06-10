import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from '../aplication/auth.service';
import { jwtConstants } from '../setting/constants';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { AuthController } from '../api/model/auth.controller';
import { UsersService } from '../../users/application/users.service';
import { UsersRepository } from '../../users/infrastructure/users.repository';
import { TokenService } from '../../../common/service/jwt/token.service';
import { EmailsManager } from '../../../common/service/email/email-manager';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { DevicesService } from '../../devices/aplication/devices.service';

@Module({
  imports: [
    UsersService,
    UsersRepository,
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '5m' },
    }),
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
    EmailsManager,
    DateCreate,
    AuthGuard,
    DevicesService,
    TokenService,
  ],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
