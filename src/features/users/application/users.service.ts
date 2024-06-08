import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserOutputDto, UserType } from '../api/models/output/output';
import { UserCreateInputModel } from '../api/models/input/create.user.input.model';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { BcryptAdapter } from '../../../base/adapters/bcrypt.adapter';
import {
  ConfirmationCodeInputModel,
  LoginOrEmailInputModel,
  NewPasswordInputModel,
  UserEmailInputModel,
} from '../../auth/api/model/input/loginOrEmailInputModel';
import { User } from '../domain/user.entity';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    protected dateCreate: DateCreate,
  ) {}
  async getUserByLoginOrEmail(inputModelDto: LoginOrEmailInputModel) {
    return await this.usersRepository.getUserByLoginOrEmail(inputModelDto);
  }

  async getUserByCode(code: string) {
    return await this.usersRepository.getUserByCode(code);
  }
  async updatePassword(inputModelDto: NewPasswordInputModel) {
    const createdAtPlus = await this.dateCreate.getDateInISOStringFormat();
    const hash = await this.bcryptAdapter.createHash(inputModelDto.password);
    return await this.usersRepository.updatePassword(
      inputModelDto.code,
      hash,
      createdAtPlus,
    );
  }
  async updateRecovery(email: string, code: string) {
    const createdAtPlus = await this.dateCreate.getDateInISOStringFormat();
    return await this.usersRepository.updateRecovery(
      email,
      code,
      createdAtPlus,
    );
  }
  async updateConfirmationStatus(inputModelDto: ConfirmationCodeInputModel) {
    const createdAt = await this.dateCreate.getCurrentDateInISOStringFormat();
    return await this.usersRepository.updateConfirmationStatus(
      inputModelDto.code,
      createdAt,
    );
  }
  async updateUserConfirmationCodeAndData(
    inputModelDto: UserEmailInputModel,
    RecoveryCode: string,
  ) {
    const createdAtPlus = await this.dateCreate.getDateInISOStringFormat();
    return await this.usersRepository.updateUserConfirmationAccount(
      inputModelDto.email,
      RecoveryCode,
      createdAtPlus,
    );
  }

  async createUser(
    inputModel: UserCreateInputModel /*isConfirmed: boolean = false*/,
  ): Promise<UserOutputDto> {
    const createdAt = await this.dateCreate.getCurrentDateInISOStringFormat();
    const hash = await this.bcryptAdapter.createHash(inputModel.password);

    const newUser: UserType = {
      login: inputModel.login,
      email: inputModel.email,
      hash: hash,
      createdAt: createdAt,
    };

    return await this.usersRepository.createUser(newUser);
  }
  async deleteUser(id: string) {
    console.log(id);
    return await this.usersRepository.deleteUser(id);
  }
  async getUserById(userId: string) {
    return await this.usersRepository.getUserById(userId);
  }
  async getUserByEmail(email: string): Promise<User> {
    return await this.usersRepository.getUserByEmail(email);
  }
  async create(email: string, name: string) {
    // email send message
    // this.emailAdapter.send(message);

    return 'id';
  }
}
