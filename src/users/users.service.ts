import {
  BadRequestException,
  ForbiddenException,
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

    // Check user exists
    const user: User = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
    // return `This action returns a #${id} user`;
  }

  update(id: string, updateUserDto: UpdateUserDto) {
    // return `This action updates a #${id} user`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`); //400
    }
    // Check user exists
    const index: number = this.users.findIndex((user) => user.id === id);
    // const user: User = this.users.find((user) => user.id === id);
    if (index === -1) {
      throw new NotFoundException('User not found.'); //404
    }

    // check old password is correct
    const user: User = this.users[index];
    if (user.password !== updateUserDto.oldPassowrd) {
      throw new ForbiddenException('Old passowrd is wrong.'); //403
    }

    //create updated user
    const updatedUser = {
      id: id,
      login: user.login,
      version: user.version + 1,
      createdAt: user.createdAt,
      updatedAt: Date.now(),
      password: updateUserDto.newPassword,
    };
    this.users[index] = updatedUser;
    return updatedUser;
  }

  remove(id: string) {
    // return `This action removes a #${id} user`;
    // check uuid is valid or return error
    if (!validate(id) || !(version(id) === 4)) {
      throw new BadRequestException(`userId ${id} is invalid (not uuid)`); //400
    }
    // Check user exists
    const user: User = this.users.find((user) => user.id === id);
    if (!user) {
      throw new NotFoundException('User not found.'); //404
    }
    this.users = this.users.filter((user) => user.id !== id);
    return;
  }
}
