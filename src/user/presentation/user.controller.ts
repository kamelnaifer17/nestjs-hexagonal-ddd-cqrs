import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/commands/create-user.command';
import { UpdateUserCommand } from '../application/commands/update-user.command';
import { DeleteUserCommand } from '../application/commands/delete-user.command';
import { GetUserQuery } from '../application/queries/get-user.query';
import { ListUsersQuery } from '../application/queries/list-users.query';
import { User } from '../domain/entities/user.entity';

export interface CreateUserDto {
  name: string;
  email: string;
}

export interface UpdateUserDto {
  name?: string;
  email?: string;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Post()
  async createUser(@Body() request: CreateUserDto) {
    const user = await this.commandBus.execute<CreateUserCommand, User>(
      new CreateUserCommand(request.name, request.email),
    );
    return this.mapUserToResponse(user);
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    const user = await this.queryBus.execute<GetUserQuery, User>(
      new GetUserQuery(id),
    );
    return this.mapUserToResponse(user);
  }

  @Get()
  async listUsers() {
    const users = await this.queryBus.execute<ListUsersQuery, User[]>(
      new ListUsersQuery(),
    );
    return users.map((user) => this.mapUserToResponse(user));
  }

  @Patch(':id')
  async updateUser(@Param('id') id: string, @Body() body: UpdateUserDto) {
    const user = await this.commandBus.execute<UpdateUserCommand, User>(
      new UpdateUserCommand(id, body.name, body.email),
    );
    return this.mapUserToResponse(user);
  }

  @Delete(':id')
  async deleteUser(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteUserCommand(id));
  }

  private mapUserToResponse(user: User) {
    return {
      id: user.getId().getValue(),
      name: user.getName(),
      email: user.getEmail().getValue(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpatedAt(),
      accountAge: user.getAccountAge(),
    };
  }
}