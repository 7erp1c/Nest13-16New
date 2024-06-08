import { IsStringLength } from '../../../../common/decorators/validate/is.string.length';
import { IsString } from 'class-validator';

export class CommentUpdateInputModel {
  @IsStringLength(20, 300)
  content: string;
}
