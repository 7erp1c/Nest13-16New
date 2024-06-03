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
  commonsProvider,
  emailProviders,
  JWTProviders,
  likesProviders,
  postsProviders,
  testingProvider,
  usersProviders,
} from './settings/setting-providers';
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
    ...authProviders,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commonsProvider,
    ...testingProvider,
    ...likesProviders,
    ...JWTProviders,
    ...emailProviders,
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
