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
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  CommentsLikesInputModel,
  PostsLikesInputModel,
} from '../../likes/api/model/input/likes.input.models';
import { Request } from 'express';
import { AuthGuard } from '../../../common/guards/auth.guard';
import { CommentsService } from '../aplication/comments.service';
import { LikesCommentsService } from '../../likes/aplication/likes.comments.service';
import { CommentsQueryRepository } from '../infrastructure/comments.query.repository';
import { CommentUpdateInputModel } from './input/comments.input.model';

@ApiTags('Comments')
@Controller('comments')
export class CommentsController {
  constructor(
    protected commentsService: CommentsService,
    protected likesCommentsService: LikesCommentsService,
    protected commentsQueryRepository: CommentsQueryRepository,
  ) {}
  @Put('/:commentId/like-status')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async updateOrCreateCommentLike(
    @Param('id') id: string,
    @Body() inputModel: CommentsLikesInputModel,
    @Req() req: Request,
  ) {
    const comment = await this.commentsService.getCommentById(id);
    if (!comment) throw new NotFoundException('Comment Not Found');

    await this.likesCommentsService.updateOrCreateCommentLike(
      id,
      inputModel,
      req.user.userId,
    );
  }

  @Put('/:commentId')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async UpdateComment(
    @Param('id') id: string,
    @Body() inputModel: CommentUpdateInputModel,
    @Req() req: Request,
  ) {
    const updateContent = await this.commentsService.updateComment(
      req.params.commentId,
      inputModel,
      req.user.userId,
    );
    //403
  }

  @Delete('/:id')
  @UseGuards(AuthGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteCommentById(@Param('id') id: string, @Req() req: Request) {
    return await this.commentsService.deleteComment(id, req.user.userId);
    //403
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async commentById(@Param('id') id: string, @Req() req: Request) {
    const result = await this.commentsQueryRepository.getCommentById(
      id,
      req.user.userId!,
    );
    if (!result) throw new NotFoundException('Not Found');
    return result;
  }
}
