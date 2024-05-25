import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import { UserOutputDto, UserType } from '../api/models/output/output';
import { UserCreateInputModel } from '../api/models/input/create.user.input.model';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { BcryptAdapter } from '../../../base/adapters/bcrypt.adapter';

// Для провайдера всегда необходимо применять декоратор @Injectable() и регистрировать в модуле
@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly cryptAdapter: BcryptAdapter,
    protected dateCreate: DateCreate,
  ) {}

  async createUser(
    inputModel: UserCreateInputModel /*isConfirmed: boolean = false*/,
  ): Promise<UserOutputDto> {
    const createdAt = await this.dateCreate.getCurrentDateInISOStringFormat();
    const hash = await this.cryptAdapter.createHash(inputModel.password);

    const newUser: UserType = {
      login: inputModel.login,
      email: inputModel.email,
      hash: hash,
      createdAt: createdAt,
      /*isConfirmed: isConfirmed,*/
    };

    return await this.usersRepository.createUser(newUser);
  }
  async deleteUser(id: string) {
    console.log(id);
    return await this.usersRepository.deleteUser(id);
  }
  async create(email: string, name: string) {
    // email send message
    // this.emailAdapter.send(message);

    return 'id';
  }
}
