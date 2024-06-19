import { UserCreateInputModel } from '../api/models/input/create.user.input.model';
import { UserOutputDto, UserType } from '../api/models/output/output';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptAdapter } from '../../../base/adapters/bcrypt.adapter';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class CreateUserUseCaseCommand {
  login: string;
  password: string;
  email: string;
  constructor(public inputModel: UserCreateInputModel) {
    this.login = inputModel.login;
    this.password = inputModel.password;
    this.email = inputModel.email;
  }
}
@CommandHandler(CreateUserUseCaseCommand)
export class CreateUserUseCase
  implements ICommandHandler<CreateUserUseCaseCommand>
{
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly bcryptAdapter: BcryptAdapter,
    protected dateCreate: DateCreate,
  ) {}
  async execute(command: CreateUserUseCaseCommand): Promise<UserOutputDto> {
    const createdAt = await this.dateCreate.getCurrentDateInISOStringFormat();
    const hash = await this.bcryptAdapter.createHash(
      command.inputModel.password,
    );

    const newUser: UserType = {
      login: command.login,
      email: command.email,
      hash: hash,
      createdAt: createdAt,
    };

    return await this.usersRepository.createUser(newUser);
  }
}
