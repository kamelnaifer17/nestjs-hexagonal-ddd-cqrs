import { CommandHandler, ICommandHandler, EventBus } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateUserCommand } from './create-user.command';
import { User } from '../../domain/entities/user.entity';
import {
  USER_REPOSITORY,
  UserRepositoryPort,
} from '../ports/user.repository.port';
import { UserCreatedEvent } from '../events/user-created.event';

@CommandHandler(CreateUserCommand)
export class CreateUserHandler implements ICommandHandler<CreateUserCommand> {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: UserRepositoryPort,
    private readonly eventBus: EventBus,
  ) {}

  async execute(command: CreateUserCommand): Promise<User> {
    const { name, email } = command;

    const existingUser = await this.userRepository.findByEmail(email);

    if (existingUser) {
      throw new Error('User with this email already exists.');
    }

    const user = User.create(name, email);
    const savedUser = await this.userRepository.save(user);

    // Publish domain event
    this.eventBus.publish(
      new UserCreatedEvent(
        savedUser.getId().getValue(),
        savedUser.getName(),
        savedUser.getEmail().getValue(),
      ),
    );

    return savedUser;
  }
}