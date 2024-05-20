import {Injectable} from '@nestjs/common';
import {User, UserDocument} from "../domain/user.entity";
import {Model} from "mongoose";
import {InjectModel} from "@nestjs/mongoose";
import {UserOutputModel, UserOutputModelMapper} from "../api/models/output/user.output.model";
import {UsersRepository} from "./users.repository";

// export abstract class BaseQueryRepository<M> {
//     protected constructor(private model: Model<M>) {
//     }
//
//     async find(filter: FilterQuery<M>,
//                projection?: ProjectionType<M> | null | undefined,
//                options?: QueryOptions<M> | null | undefined,
//                pagination: {skip: number, limit: number }) {
//         return this.model.find<M>(filter, projection, options)
//     }
// }

@Injectable()
export class UsersQueryRepository {
    constructor(@InjectModel(User.name) private userModel: Model<User>) {
    }

    public async getById(userId: string): Promise<UserOutputModel> {
        const user = await this.userModel.findById(userId, {__v: false})
        return UserOutputModelMapper(user);
    }
}


