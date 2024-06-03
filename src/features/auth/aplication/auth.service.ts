import {
  BadRequestException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { UserCreateInputModel } from '../../users/api/models/input/create.user.input.model';
import { UsersService } from '../../users/application/users.service';
import { TokenService } from '../../../common/service/jwt/token.service';
import {
  ConfirmationCodeInputModel,
  LoginOrEmailInputModel,
  NewPasswordInputModel,
  UserEmailInputModel,
} from '../api/model/input/loginOrEmailInputModel';
import { JwtService } from '@nestjs/jwt';
import { BcryptAdapter } from '../../../base/adapters/bcrypt.adapter';
import { RandomNumberService } from '../../../common/service/random/randomNumberUUVid';
import { EmailsManager } from '../../../common/service/email/email-manager';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { Error } from 'mongoose';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly tokenService: TokenService,
    private readonly jwtService: JwtService,
    private readonly bcryptAdapter: BcryptAdapter,
    private readonly randomNumberService: RandomNumberService,
    private readonly emailsManager: EmailsManager,
    private readonly dateCreate: DateCreate,
  ) {}
  async newPassword(inputModelDto: NewPasswordInputModel) {
    const user = await this.usersService.getUserByCode(inputModelDto.code);
    //сравним input-password и hash c Db, незя использовать старый
    const compareHash = await this.bcryptAdapter.compareHash(
      inputModelDto.password,
      user.hash,
    );
    if (!compareHash)
      throw new BadRequestException(
        `status: ${HttpStatus.NOT_FOUND}, Method: newPassword, field: compareHash, hash&hash`,
      );
    //проверим не протух ли код:
    const currentDate = await this.dateCreate.getCurrentDateInISOStringFormat();
    if (user.recoveryPassword.expirationDate < currentDate)
      throw new BadRequestException(
        `status: ${HttpStatus.NOT_FOUND}, Method: newPassword, field: currentDate, currentDate&expirationDate`,
      );
    //......
    const updatePassword =
      await this.usersService.updatePassword(inputModelDto);
    if (!updatePassword)
      throw new BadRequestException(
        `status: ${HttpStatus.NOT_FOUND}, Method: newPassword, field: updatePassword, not update`,
      );
    return;
  }
  async passwordRecovery(inputModelDto: UserEmailInputModel) {
    const user = await this.usersService.getUserByEmail(inputModelDto.email);
    if (!user.recoveryPassword.isUsed) {
      //проверим не протух ли код:
      const currentDate =
        await this.dateCreate.getCurrentDateInISOStringFormat();
      if (user.recoveryPassword.expirationDate < currentDate)
        throw new BadRequestException(
          `status: ${HttpStatus.NOT_FOUND}, Method: newPassword, field: currentDate, currentDate&expirationDate`,
        );
      const sendEmail = this.emailsManager.emailsManagerRecovery(
        user.email,
        user.recoveryPassword.recoveryCode,
      );
      if (!sendEmail)
        throw new Error('The email has not been delivered to the soap.');
      return sendEmail;
    }
    if (user.recoveryPassword.isUsed) {
      const RecoveryCode = this.randomNumberService.generateRandomUUID();
      const updateRecoveryUser = this.usersService.updateRecovery(
        user.email,
        RecoveryCode,
      );
      if (!updateRecoveryUser) throw new Error('Not update recovery code');
      const sendEmail = this.emailsManager.emailsManagerRecovery(
        user.email,
        RecoveryCode,
      );
      if (!sendEmail)
        throw new Error('The email has not been delivered to the soap.');
      return sendEmail;
    }
  }

  async registrationConfirmation(inputModelDto: ConfirmationCodeInputModel) {
    const user = await this.usersService.getUserByCode(inputModelDto.code);
    const currentDate = await this.dateCreate.getCurrentDateInISOStringFormat();
    if (
      !user ||
      user.emailConfirmation.confirmationCode !== inputModelDto.code ||
      user.emailConfirmation.isConfirmed ||
      user.emailConfirmation.expirationDate < currentDate
    )
      throw new BadRequestException([
        {
          message: 'code already exist',
          field: 'code',
        },
      ]);
    const updateConfirmationStatus =
      this.usersService.updateConfirmationStatus(inputModelDto);
    if (!updateConfirmationStatus)
      throw new Error('Not updated confirmation status');
    return updateConfirmationStatus;
  }

  async registrationUser(userModelDto: UserCreateInputModel) {
    const createUser = await this.usersService.createUser(userModelDto);
    const user = await this.usersService.getUserByEmail(createUser.email);
    if (!createUser) throw new BadRequestException();
    const sendEmail = await this.emailsManager.sendMessageWitchConfirmationCode(
      createUser.email,
      createUser.login,
      user.emailConfirmation.confirmationCode,
    );
    if (!sendEmail)
      throw new Error('The email has not been delivered to the soap.');

    return true;
  }

  async registrationEmailResending(inputModelDto: UserEmailInputModel) {
    const RecoveryCode = this.randomNumberService.generateRandomUUID();
    const user = await this.usersService.getUserByEmail(inputModelDto.email);
    if (!user || user.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message: 'code already exist',
          field: 'email',
        },
      ]);
    const updateUserConfirmationData =
      await this.usersService.updateUserConfirmationCodeAndData(
        inputModelDto,
        RecoveryCode,
      );
    if (!updateUserConfirmationData) throw new Error('User not updated');
    this.emailsManager.sendMessageWitchConfirmationCode(
      user.email,
      user.login,
      RecoveryCode,
    );
    return updateUserConfirmationData;
  }

  async logInUser(inputModelDto: LoginOrEmailInputModel) {
    //ищем User по логину или email (res ошибка внутри)
    const findUser =
      await this.usersService.getUserByLoginOrEmail(inputModelDto);
    //сравним input-пароль c паролем в Db
    const compareHash = await this.bcryptAdapter.compareHash(
      inputModelDto.password,
      findUser.hash,
    );
    if (!compareHash)
      throw new UnauthorizedException(
        `status: ${HttpStatus.UNAUTHORIZED}, Method: logInUser, field: findUser, enter a different password`,
      );
    //создаём token:
    const tokenAccess = await this.tokenService.createJWT(
      findUser._id.toString(),
    );
    const tokenRefresh = await this.tokenService.createJWT(
      findUser._id.toString(),
    );
    if (!tokenAccess || !tokenRefresh)
      throw new UnauthorizedException('Token not created');
    //возвращаем two token:
    return {
      tokenAccess,
      tokenRefresh,
    };
  }
}
