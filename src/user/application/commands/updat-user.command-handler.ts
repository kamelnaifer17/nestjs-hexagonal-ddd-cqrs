import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject, NotFoundException } from '@nestjs/common';
import { UpdateUserCommand } from './update-user.command';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { UserUpdatedEvent } from '../events/user-updated.event';
import { User } from '../../domain/entities/user.entity';

@CommandHandler(UpdateUserCommand)
export class UpdateUserHandler implements ICommandHandler<UpdateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: UpdateUserCommand): Promise<User> {
    const { id, name, email } = command;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    if (name) {
      user.updateName(name);
    }

    if (email) {
      user.updateEmail(email);
    }

    const updatedUser = await this.userRepository.save(user);

    // Publish domain event
    this.eventBus.publish(
      new UserUpdatedEvent(
        updatedUser.getId().getValue(),
        updatedUser.getName(),
        updatedUser.getEmail().getValue(),
      ),
    );

    return updatedUser;
  }
}