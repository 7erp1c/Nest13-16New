import {Injectable} from '@nestjs/common';
import {InjectModel} from "@nestjs/mongoose";
import {Model} from "mongoose";
import {User, UserDocument} from "../domain/user.entity";

@Injectable()
export class UsersRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    public async insert(user: User) {
        const result: UserDocument[] = await this.userModel.insertMany(user);
        return result[0];
    }
}
