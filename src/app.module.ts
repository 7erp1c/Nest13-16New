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

const usersProviders: Provider[] = [
  UsersRepository,
  UsersService,
  UsersQueryRepository,
];

@Module({
  // Регистрация модулей
  imports: [
    MongooseModule.forRoot(appSettings.api.MONGO_CONNECTION_URI),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  // Регистрация провайдеров
  providers: [...usersProviders,],
  // Регистрация контроллеров
  controllers: [UsersController],
})
export class AppModule implements NestModule {
  // https://docs.nestjs.com/middleware#applying-middleware
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}
