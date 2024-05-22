import { Matches } from 'class-validator';
import { IsStringLength } from "../../../../../common/decorators/validate/is.string.length";
import { IsOptionalEmail } from "../../../../../common/decorators/validate/is-optional-email";

export class UserCreateInputModel {
  @IsStringLength(3, 10)
  @Matches('^[a-zA-Z0-9_-]*$')
  login: string;
  @IsStringLength(6, 20)
  password: string;
  @IsOptionalEmail()
  @Matches('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')
  email: string;
}
