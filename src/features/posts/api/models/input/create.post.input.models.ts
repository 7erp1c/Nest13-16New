import { IsStringLength } from '../../../../../common/decorators/validate/is.string.length';
import { IsString } from 'class-validator';
import { CreateBlogInputModel } from '../../../../blogs/api/models/input/create.blog.input.model';

export class CreatePostInputModels {
  @IsStringLength(1, 30)
  title: string;

  @IsStringLength(1, 100)
  shortDescription: string;

  @IsStringLength(1, 1000)
  content: string;

  @IsString()
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
