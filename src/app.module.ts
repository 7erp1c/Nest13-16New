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

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];
const testingProvider: Provider[] = [TestingService, TestingRepository];
const commonsProvider: Provider[] = [BcryptAdapter, DateCreate];
const URI = appSettings.api.MONGO_CONNECTION_URI;
console.log(URI, 'URI**');
@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // Регистрация провайдеров
  providers: [...usersProviders, ...commonsProvider, ...testingProvider],
  // Регистрация контроллеров
  controllers: [UsersController, TestingController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
