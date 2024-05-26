import {
  MiddlewareConsumer,
  Module,
  NestModule,
  Provider,
} from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/app-settings';
import { UsersRepository } from './features/users/infrastructure/users.repository';
import { UsersService } from './features/users/application/users.service';
import { UsersQueryRepository } from './features/users/infrastructure/users.query-repository';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { BcryptAdapter } from './base/adapters/bcrypt.adapter';
import { DateCreate } from './base/adapters/get-current-date';
import { TestingController } from './features/testing/api/testing.controller';
import { TestingService } from './features/testing/aplication/testing.service';
import { TestingRepository } from './features/testing/infrastructure/testing.repository';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { BlogsRepository } from './features/blogs/infrastructure/blogs.repository';
import { BlogsService } from './features/blogs/aplication/blogs.service';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs.query-repository';
import { Post, PostsSchema } from './features/posts/domain/posts.entity';
import {
  PostsLikes,
  PostsLikesSchema,
} from './features/likes/domain/likes.entity';
import { PostsController } from './features/posts/api/posts.controller';
import { PostsLikesQueryRepository } from './features/likes/infrastructure/posts.likes.query.repository';
import { PostsRepository } from './features/posts/infrastructure/posts.repository';
import { PostsService } from './features/posts/aplication/posts.service';
import { PostsQueryRepository } from './features/posts/infrastructure/posts.query-repository';
import { CommentSchema } from './features/comments/domain/comments.entity';

const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository,
];
const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
];
const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
const testingProvider: Provider[] = [TestingService, TestingRepository];
const commonsProvider: Provider[] = [BcryptAdapter, DateCreate];
const likesProviders: Provider[] = [PostsLikesQueryRepository];
const URI = appSettings.api.MONGO_CONNECTION_URI;
console.log(URI, 'URI**');
@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostsSchema },
      // { name: Comment.name, schema: CommentSchema },
      { name: PostsLikes.name, schema: PostsLikesSchema },
    ]),
  ],
  // Регистрация провайдеров
  providers: [
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commonsProvider,
    ...testingProvider,
    ...likesProviders,
  ],
  // Регистрация контроллеров
  controllers: [
    UsersController,
    BlogsController,
    PostsController,
    TestingController,
  ],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
