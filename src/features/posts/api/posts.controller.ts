import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import {
  CreatePostInputModels,
  UpdatePostInputModel,
} from './models/input/create.post.input.models';
import { BlogsService } from '../../blogs/aplication/blogs.service';
import { PostsService } from '../aplication/posts.service';
import { PostsQueryRepository } from '../infrastructure/posts.query-repository';
import { QueryBlogsRequestType } from '../../blogs/api/models/input/input';
import { createQuery } from '../../../base/adapters/query/create.query';
import { QueryUsersRequestType } from '../../users/api/models/input/input';
import { PostOutputDto } from './models/output/output.types';
import { UpdateBlogInputModel } from '../../blogs/api/models/input/create.blog.input.model';
import { QueryPostsRequestType } from './models/input/input';

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected postsQueryRepository: PostsQueryRepository,
    // protected commentsService: CommentsService,
  ) {}

  @Get('/comment')
  async getCommentsForPost() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  // async getAllPosts(@Query() query: QueryPostsRequestType) {
  //   const { sortData } = createQuery(query);
  //   try {
  //     return await this.postsQueryRepository.getAllPosts(sortData);
  //   } catch (error) {
  //     throw new NotFoundException('What?');
  //   }
  // }
  async getAllPosts(
    @Query() query: QueryPostsRequestType,
    // @Req() req: Request,
  ) {
    const { sortData, searchData } = createQuery(query);
    // try {
    // const authHeader = req.header('authorization')?.split(' ');
    // const token = new AccessTokenService(
    //   tokenServiceCommands.set,
    //   authHeader[1],
    // );
    // const userId = token.decode().userId;
    // return await this.postsQueryRepository.getAllPosts(
    //   sortData,
    //   null,
    //   userId,
    // );
    // } catch {
    return await this.postsQueryRepository.getAllPosts(sortData);

    // }
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputModel: CreatePostInputModels) {
    const findBlogById = await this.blogsService.findBlogById(
      inputModel.blogId,
    );
    if (!findBlogById) {
      throw new NotFoundException([
        { message: 'Sorry bro, blog not found', field: 'blogId' },
      ]);
    }
    const newPosts = await this.postsService.createPost(
      inputModel,
      findBlogById.name,
    );
    return await this.postsQueryRepository.getPostById(newPosts);
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string): Promise<PostOutputDto> {
    return await this.postsQueryRepository.getPostById(id, null);
  }

  @Put('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') postId: string,
    @Body() UpdateModel: UpdatePostInputModel,
  ) {
    return await this.postsService.updateBlog(postId, UpdateModel);
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postId: string) {
    return await this.postsService.deletePost(postId);
  }

  // @Post(':id/comments')
  // async createNewCommentToPost(
  //   @Param('id') id: string,
  //   @Body() inputModel: CommentCreateInputModel,
  // ) {
  //   const commentCreateDto: CommentCreateDto = {
  //     content: inputModel.content,
  //     postId: id,
  //     userId: 'user?.id',
  //     userLogin: user.login,
  //   };
  //   const commentId: string =
  //     await this.commentsService.createComment(commentCreateDto);
  //   return await this.commentsQueryRepository.getById(commentId);
  // }
}
