import { UsersRepository } from '../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
export class DeleteUserUseCaseCommand {
  constructor(public id: string) {}
}
@CommandHandler(DeleteUserUseCaseCommand)
export class DeleteUserUseCase
  implements ICommandHandler<DeleteUserUseCaseCommand>
{
  constructor(private readonly usersRepository: UsersRepository) {}
  async execute(command: DeleteUserUseCaseCommand) {
    return await this.usersRepository.deleteUser(command.id);
  }
}
