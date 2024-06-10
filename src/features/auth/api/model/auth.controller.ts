import { ApiBody, ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { UserCreateInputModel } from '../../../users/api/models/input/create.user.input.model';
import { AuthService } from '../../aplication/auth.service';
import { Request, Response } from 'express';
import {
  ConfirmationCodeInputModel,
  LoginOrEmailInputModel,
  NewPasswordInputModel,
  UserEmailInputModel,
} from './input/loginOrEmailInputModel';
//import { ThrottlerGuard } from '@nestjs/throttler';
import { AuthGuard } from '../../../../common/guards/auth.guard';
import { UsersQueryRepository } from '../../../users/infrastructure/users.query-repository';
import {
  BadRequestResponse,
  NoContentResponse,
  TooManyRequestsResponse,
} from '../../../../common/swagger/response.dto';
import { CodeDto } from '../../../../common/swagger/input.type';
import { SessionInputModel } from '../../../devices/api/model/input/session.input.models';

@ApiTags('Auth')
@Controller('auth')
//@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(
    protected authService: AuthService,
    protected usersQueryRepository: UsersQueryRepository,
  ) {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('new-password')
  async newPassword(@Body() inputModelDto: NewPasswordInputModel) {
    await this.authService.newPassword(inputModelDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('password-recovery')
  async passwordRecovery(@Body() inputModelDto: UserEmailInputModel) {
    return await this.authService.passwordRecovery(inputModelDto);
  }

  @HttpCode(HttpStatus.OK)
  @Post('login')
  @ApiBody({ type: LoginOrEmailInputModel })
  async logInUser(
    @Body() inputModelDto: LoginOrEmailInputModel,
    @Res({ passthrough: true }) res: Response,
    @Req() req: Request,
  ) {
    const sessionInputModel: SessionInputModel = {
      deviceTitle: req.header('user-agent')?.split(' ')[1] || 'unknown',
      ip: req.ip || 'unknown',
    };
    const login = await this.authService.logInUser(
      inputModelDto,
      sessionInputModel,
    );
    res.cookie('refreshToken', login.tokenRefresh, {
      httpOnly: true,
      secure: true,
    });
    return { accessToken: login.tokenAccess };
  }
  @Post('refresh-token')
  async for3() {}

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-confirmation')
  @ApiBody({ type: CodeDto })
  @BadRequestResponse
  @TooManyRequestsResponse
  @NoContentResponse
  async registrationConfirmation(
    @Body() inputModel: ConfirmationCodeInputModel,
  ) {
    return await this.authService.registrationConfirmation(inputModel);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration')
  async registration(@Body() inputModelDto: UserCreateInputModel) {
    return await this.authService.registrationUser(inputModelDto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Post('registration-email-resending')
  async registrationEmailResending(@Body() inputModelDto: UserEmailInputModel) {
    return await this.authService.registrationEmailResending(inputModelDto);
  }

  @Post('logout')
  async for22() {}

  //@SkipThrottle()
  @Get('me')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.OK)
  async getMe(@Req() req: Request) {
    try {
      const userId = req.user.userId;
      console.log(userId);
      return this.usersQueryRepository.getUserAuthMe(userId);
    } catch {
      throw new UnauthorizedException();
    }
  }
}
