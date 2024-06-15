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
  devicesProviders,
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
import { BlogExistsValidator } from './common/decorators/validate/blogId/isBlogExist';
import { CommentsController } from './features/comments/api/comments.controller';
import {
  DevicesSchema,
  Session,
} from './features/devices/domain/device.entity';
import { DevicesController } from './features/devices/api/devices.controller';
import cookieParser from 'cookie-parser';
import { RefreshTokenBlackRepository } from './features/auth/infrastructure/refresh.token.black.repository';
import {
  RefreshTokenBlackList,
  RefreshTokenBlackListSchema,
} from './features/auth/domain/refresh.token.black.list.entity';
//const URI = appSettings.api.MONGO_CONNECTION_URI;
//console.log(URI, 'URI**');
const throttleModule = ThrottlerModule.forRoot([
  {
    ttl: 10000,
    limit: 5,
  },
]);
@Module({
  // Регистрация модулей
  imports: [
    throttleModule,
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
      { name: Session.name, schema: DevicesSchema },
      { name: RefreshTokenBlackList.name, schema: RefreshTokenBlackListSchema },
    ]),
  ],
  // Регистрация провайдеров
  providers: [
    ...devicesProviders,
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
    BlogExistsValidator,
    RandomNumberService,
    RefreshTokenBlackRepository,
  ],
  // Регистрация контроллеров
  controllers: [
    AuthController,
    DevicesController,
    UsersController,
    BlogsController,
    PostsController,
    CommentsController,
    TestingController,
  ],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes('*')
      .apply(cookieParser())
      .forRoutes('*');
  }
}
