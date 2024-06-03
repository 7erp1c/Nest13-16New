import { Provider } from '@nestjs/common';
import { AuthService } from '../features/auth/aplication/auth.service';
import { JwtService } from '@nestjs/jwt';
import { TokenService } from '../common/service/jwt/token.service';
import { BlogsRepository } from '../features/blogs/infrastructure/blogs.repository';
import { BlogsService } from '../features/blogs/aplication/blogs.service';
import { BlogsQueryRepository } from '../features/blogs/infrastructure/blogs.query-repository';
import { PostsRepository } from '../features/posts/infrastructure/posts.repository';
import { PostsService } from '../features/posts/aplication/posts.service';
import { PostsQueryRepository } from '../features/posts/infrastructure/posts.query-repository';
import { UsersRepository } from '../features/users/infrastructure/users.repository';
import { UsersService } from '../features/users/application/users.service';
import { UsersQueryRepository } from '../features/users/infrastructure/users.query-repository';
import { TestingService } from '../features/testing/aplication/testing.service';
import { TestingRepository } from '../features/testing/infrastructure/testing.repository';
import { BcryptAdapter } from '../base/adapters/bcrypt.adapter';
import { DateCreate } from '../base/adapters/get-current-date';
import { PostsLikesQueryRepository } from '../features/likes/infrastructure/posts.likes.query.repository';
import { EmailAdapter } from '../common/service/email/email-adapter';
import { EmailsManager } from '../common/service/email/email-manager';
import { AuthGuard } from '../common/guards/auth.guard';

export const authProviders: Provider[] = [AuthService, AuthGuard];
export const JWTProviders: Provider[] = [JwtService, TokenService];
export const blogsProviders: Provider[] = [
  BlogsRepository,
  BlogsService,
  BlogsQueryRepository,
];
export const postsProviders: Provider[] = [
  PostsRepository,
  PostsService,
  PostsQueryRepository,
];
export const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
export const testingProvider: Provider[] = [TestingService, TestingRepository];
export const commonsProvider: Provider[] = [BcryptAdapter, DateCreate];
export const likesProviders: Provider[] = [PostsLikesQueryRepository];
export const emailProviders: Provider[] = [EmailAdapter, EmailsManager];
