import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { v4 as uuid, validate, version } from 'uuid';

@Injectable()
export class UsersService {
  private users: Array<User> = [];

  create(createUserDto: CreateUserDto) {
    // return 'This action adds a new user';

    //check required fields and types
    const hasAllRequiredFields = createUserDto.login && createUserDto.password;
    const hasCorrectTypes =
      typeof createUserDto.login === 'string' &&
      typeof createUserDto.password === 'string';

    if (!hasAllRequiredFields || !hasCorrectTypes) {
      throw new BadRequestException(
        `request body does not contain required fields. name should be string, age should be number, hobbies should be array`,
      );
    }

    // check that user does not exist
    const userExists: boolean = this.users.some(
      (user) => user.login === createUserDto.login,
    );
    if (userExists) {
      throw new UnprocessableEntityException(
        `User with login ${createUserDto.login} already exists.`,
      );
    }

    // create a user, with random id, version and created time and data sent
    const createdAt = Date.now();
    const newUser = {
      id: uuid(),
      version: 1,
      createdAt: createdAt,
      updatedAt: createdAt,
      ...createUserDto,
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
    // return `This action returns all users`;
  }

  findOne(id: string) {
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`);
    }

    const user: User = this.users.find((user) => user.id === id);

    if (!user) {
      throw new NotFoundException('Post not found.');
    }

    return user;
    // return `This action returns a #${id} user`;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
