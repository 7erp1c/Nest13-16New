import { ApiTags } from '@nestjs/swagger';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseIntPipe,
  Post,
  Query,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { UsersQueryRepository } from '../infrastructure/users.query-repository';
import { UserCreateModel } from './models/input/create-user.input.model';
import { UserOutputModel } from './models/output/user.output.model';
import { UsersService } from '../application/users.service';
import { NumberPipe } from '../../../common/pipes/number.pipe';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { Request, Response } from 'express';

// Tag для swagger
@ApiTags('Users')
@Controller('users')
// Установка guard на весь контроллер
//@UseGuards(AuthGuard)
export class UsersController {
  usersService: UsersService;
  constructor(
    usersService: UsersService,
    private readonly usersQueryRepository: UsersQueryRepository,
  ) {
    this.usersService = usersService;
  }

  @Get()
  async hello(
    // Для работы с query применяя наш кастомный pipe
    @Query('id', NumberPipe) id: number,
    // Для работы с request (импорт Request из express)
    @Req() req: Request,
    // Для работы с response (импорт Response из express)
    // При работе с данным декоратором необходимо установить passthrough: true
    // чтобы работал механизм возврата ответа с помощью return data; или res.json(data)
    @Res({ passthrough: true }) res: Response,
  ) {
    return 'Hello';
  }

  @Post()
  // Для переопределения default статус кода https://docs.nestjs.com/controllers#status-code
  @HttpCode(200)
  async create(@Body() createModel: UserCreateModel): Promise<UserOutputModel> {
    const result = await this.usersService.create(
      createModel.email,
      createModel.name,
    );

    return await this.usersQueryRepository.getById(result);
  }

  // :id в декораторе говорит nest о том что это параметр
  // Можно прочитать с помощью @Param("id") и передать в property такое же название параметра
  // Если property не указать, то вернется объект @Param()
  @Delete(':id')
  // Установка guard на данный роут
  @UseGuards(AuthGuard)
  // Pipes из коробки https://docs.nestjs.com/pipes#built-in-pipes
  async delete(@Param('id', ParseIntPipe) id: number) {
    return id;
  }
}
