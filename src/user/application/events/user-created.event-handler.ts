import { EventsHandler, IEventHandler } from '@nestjs/cqrs';
import { UserCreatedEvent } from './user-created.event';
import { UserUpdatedEvent } from './user-updated.event';
import { UserDeletedEvent } from './user-deleted.event';
import { Logger } from '@nestjs/common';

@EventsHandler(UserCreatedEvent)
export class UserCreatedHandler implements IEventHandler<UserCreatedEvent> {
  private readonly logger = new Logger(UserCreatedHandler.name);

  handle(event: UserCreatedEvent) {
    this.logger.log(
      `User created: ${event.userId} - ${event.name} (${event.email})`,
    );
    // Add your side effects here (e.g., send welcome email, analytics, etc.)
  }
}

@EventsHandler(UserUpdatedEvent)
export class UserUpdatedHandler implements IEventHandler<UserUpdatedEvent> {
  private readonly logger = new Logger(UserUpdatedHandler.name);

  handle(event: UserUpdatedEvent) {
    this.logger.log(
      `User updated: ${event.userId} - ${event.name} (${event.email})`,
    );
    // Add your side effects here
  }
}

@EventsHandler(UserDeletedEvent)
export class UserDeletedHandler implements IEventHandler<UserDeletedEvent> {
  private readonly logger = new Logger(UserDeletedHandler.name);

  handle(event: UserDeletedEvent) {
    this.logger.log(`User deleted: ${event.userId}`);
    // Add your side effects here (e.g., cleanup related data)
  }
}