import { IsStringLength } from '../../../../../common/decorators/validate/is.string.length';
import { IsOptionalString } from '../../../../../common/decorators/validate/is.optional.string';

export class CreatePostInputModels {
  @IsStringLength(1, 30)
  title: string;

  @IsStringLength(1, 100)
  shortDescription: string;

  @IsStringLength(1, 1000)
  content: string;

  @IsOptionalString()
  blogId: string;
}
export class UpdatePostInputModel extends CreatePostInputModels {}
export class CreatePostInputModelByBlog {
  @IsStringLength(0, 30)
  title: string;

  @IsStringLength(0, 100)
  shortDescription: string;

  @IsStringLength(0, 1000)
  content: string;
}
export class CommentCreateInputModel {
  @IsStringLength(20, 300)
  content: string;
}
