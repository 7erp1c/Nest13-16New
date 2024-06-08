import { PostsLikesInputModel } from '../api/model/input/likes.input.models';
import { PostLikeDto } from '../api/model/input/input.types';
import { DateCreate } from '../../../base/adapters/get-current-date';
import { Injectable } from '@nestjs/common';
import { PostLikesRepository } from '../infrastructure/post.likes.repository';
import { PostsLikes } from '../domain/likes.entity';
@Injectable()
export class LikesPostService {
  constructor(
    protected dateCreate: DateCreate,
    protected postLikesRepository: PostLikesRepository,
  ) {}
  async createLikePost(
    userId: string,
    login: string,
    postId: string,
    inputModel: PostsLikesInputModel,
  ) {
    const createdAt = await this.dateCreate.getCurrentDateInISOStringFormat();
    const likesDto: PostsLikes = {
      postId: postId,
      likedUserId: userId,
      likedUserName: login,
      addedAt: createdAt,
      status: inputModel.likeStatus,
    };
    await this.postLikesRepository.updatePostLike(likesDto);
  }
}
