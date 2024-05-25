import { ApiTags } from '@nestjs/swagger';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
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

@ApiTags('Posts')
@Controller('posts')
export class PostsController {
  constructor(
    protected postsService: PostsService,
    protected blogsService: BlogsService,
    protected postsQueryRepository: PostsQueryRepository,
  ) {}
  @Get()
  async getCommentsForPost() {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async getAllPosts(
    @Query() query: QueryUsersRequestType,
    @Req() req: Request,
  ) {
    const { sortData, searchData } = createQuery(query);
    return await this.postsQueryRepository.getAllPosts(sortData);
  }
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async createPost(@Body() inputModel: CreatePostInputModels) {
    const findBlogById = await this.blogsService.findBlogById(
      inputModel.blogId,
    );
    if (!findBlogById) {
      throw new BadRequestException('Sorry bro, blog not found');
    }
    const newPosts = await this.postsService.createPost(
      inputModel,
      findBlogById.name,
    );
    return await this.postsQueryRepository.getPostById(newPosts);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async getPostById(@Param('id') id: string): Promise<PostOutputDto> {
    return await this.postsQueryRepository.getPostById(id, null);
  }

  @Put(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async updatePost(
    @Param('id') postId: string,
    @Body() UpdateModel: UpdatePostInputModel,
  ) {
    return await this.postsService.updateBlog(postId, UpdateModel);
  }
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePost(@Param('id') postId: string) {
    return await this.postsService.deletePost(postId);
  }
}
