import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { DeleteUserCommand } from './delete-user.command';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { UserDeletedEvent } from '../events/user-deleted.event';

@CommandHandler(DeleteUserCommand)
export class DeleteUserHandler implements ICommandHandler<DeleteUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const { id } = command;

    await this.userRepository.delete(id);

    // Publish domain event
    this.eventBus.publish(new UserDeletedEvent(id));
  }
}