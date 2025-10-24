import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateUserHandler } from './application/commands/create-user.command-handler';
import { UpdateUserHandler } from './application/commands/updat-user.command-handler';
import { DeleteUserHandler } from './application/commands/delete-user.command-handler';
import { UserCreatedHandler, UserDeletedHandler, UserUpdatedHandler } from './application/events/user-created.event-handler';
import { GetUserHandler } from './application/queries/get-user.query-handler';
import { ListUsersHandler } from './application/queries/list-users.query-handler';
import { UserController } from './presentation/user.controller';
import { USER_REPOSITORY } from './application/ports/user.repository.port';
import { InMemoryUserRepository } from './infrastructure/adapaters/in-memory-user.repository';

const CommandHandlers = [
  CreateUserHandler,    
  UpdateUserHandler,
  DeleteUserHandler];

const QueryHandlers = [
  GetUserHandler,
  ListUsersHandler,
];

const EventHandlers = [
  UserCreatedHandler,
  UserUpdatedHandler,
  UserDeletedHandler,
];

@Module({
  imports: [CqrsModule],  
  controllers: [UserController],
  providers: [
    ...CommandHandlers,   
    ...QueryHandlers,
    ...EventHandlers,
    {
      provide: USER_REPOSITORY,
      useClass: InMemoryUserRepository,
    },
  ],
})
export class UserModule {}
