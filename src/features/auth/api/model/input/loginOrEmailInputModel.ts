import { IsOptionalEmail } from '../../../../../common/decorators/validate/is.optional.email';
import { IsOptionalString } from '../../../../../common/decorators/validate/is.optional.string';
import { IsStringLength } from '../../../../../common/decorators/validate/is.string.length';

export class LoginOrEmailInputModel {
  @IsOptionalString()
  loginOrEmail: string;

  @IsOptionalString()
  password: string;
}

export class UserEmailInputModel {
  @IsOptionalEmail()
  email: string;
}
export class NewPasswordInputModel {
  @IsStringLength(6, 20)
  password: string;

  @IsOptionalString()
  code: string;
}

export class ConfirmationCodeInputModel {
  @IsOptionalString()
  code: string;
}
