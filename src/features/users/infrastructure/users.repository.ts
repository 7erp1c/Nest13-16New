import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Schema, Types } from 'mongoose';
import { User, UserDocument } from '../domain/user.entity';
import { CreateUserDto, UserOutputDto } from '../api/models/output/output';
import { ObjectId } from 'mongodb';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}
  async createUser(newUserDto: CreateUserDto | User) {
    const createUser = new this.userModel(newUserDto);
    const savedUser = await createUser.save();
    const user: UserOutputDto = {
      id: savedUser._id.toString(),
      login: savedUser.login,
      email: savedUser.email,
      createdAt: savedUser.createdAt,
    };
    return user;
  }

  async deleteUser(id: string) {
    const result = await this.userModel
      .findOneAndDelete({
        _id: id,
      })
      .exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return result;
  }

  async getUserById(id: string) {
    try {
      return await this.userModel.findOne({ _id: id }).lean();
    } catch {
      throw new NotFoundException();
    }
  }
  public async insert(user: User) {
    const result: UserDocument[] = await this.userModel.insertMany(user);
    return result[0];
  }
}
