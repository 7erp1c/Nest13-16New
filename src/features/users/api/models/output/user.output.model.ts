import {UserDocument} from "../../../domain/user.entity";


export class UserOutputModel {
    id: string;
    name: string
    email: string
}

// MAPPERS

export const UserOutputModelMapper = (user: UserDocument): UserOutputModel => {
    const outputModel = new UserOutputModel();

    outputModel.id = user.id;
    outputModel.name = user.name;
    outputModel.email = user.email;

    return outputModel;
};
