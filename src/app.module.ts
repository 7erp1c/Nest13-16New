import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appSettings } from './settings/app-settings';
import { User, UserSchema } from './features/users/domain/user.entity';
import { UsersController } from './features/users/api/users.controller';
import { LoggerMiddleware } from './common/middlewares/logger.middleware';
import { TestingController } from './features/testing/api/testing.controller';
import { BlogsController } from './features/blogs/api/blogs.controller';
import { Blog, BlogSchema } from './features/blogs/domain/blogs.entity';
import { Post, PostsSchema } from './features/posts/domain/posts.entity';
import {
  CommentLikes,
  CommentLikesSchema,
  PostsLikes,
  PostsLikesSchema,
} from './features/likes/domain/likes.entity';
import { PostsController } from './features/posts/api/posts.controller';
import { ThrottlerModule } from '@nestjs/throttler';
import { InputUniqDataIsExistConstraint } from './common/decorators/validate/uniqueness/uniqInDb-is-exist.decorator';
import { AuthController } from './features/auth/api/model/auth.controller';
import { RandomNumberService } from './common/service/random/randomNumberUUVid';
import {
  authProviders,
  blogsProviders,
  commentsProviders,
  commonsProvider,
  emailProviders,
  JWTProviders,
  likesProviders,
  postsProviders,
  testingProvider,
  usersProviders,
} from './settings/setting-providers';
import {
  CommentsDb,
  CommentSchema,
} from './features/comments/domain/comments.entity';
//const URI = appSettings.api.MONGO_CONNECTION_URI;
//console.log(URI, 'URI**');
@Module({
  // Регистрация модулей
  imports: [
    ThrottlerModule.forRoot([
      {
        ttl: 10000,
        limit: 2,
      },
    ]),
    MongooseModule.forRoot(
      appSettings.env.isTesting()
        ? appSettings.api.MONGO_CONNECTION_URI_FOR_TESTS
        : appSettings.api.MONGO_CONNECTION_URI,
    ),
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostsSchema },
      { name: CommentsDb.name, schema: CommentSchema },
      { name: CommentLikes.name, schema: CommentLikesSchema },
      { name: PostsLikes.name, schema: PostsLikesSchema },
    ]),
  ],
  // Регистрация провайдеров
  providers: [
    ...authProviders,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commonsProvider,
    ...testingProvider,
    ...likesProviders,
    ...JWTProviders,
    ...emailProviders,
    ...commentsProviders,
    InputUniqDataIsExistConstraint,
    RandomNumberService,
  ],
  // Регистрация контроллеров
  controllers: [
    AuthController,
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
