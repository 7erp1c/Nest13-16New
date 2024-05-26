// @Injectable()
// export class CommentsService {
//   constructor(
//     protected commentsRepository: CommentsRepository,
//     protected postService: PostsService,
//   ) {}
//
//   async getCommentById(id: string) {
//     return await this.commentsRepository.getCommentById(id);
//   }
//
//   async createComment(createDto: CommentCreateDto): Promise<string> {
//     const createdAt = new Date();
//
//     await this.postService.findById(createDto.postId);
//
//     const commentCreateModel: Comment = {
//       content: createDto.content,
//       postId: createDto.postId,
//       commentatorInfo: {
//         userId: createDto.userId,
//         userLogin: createDto.userLogin,
//       },
//       createdAt: createdAt.toISOString(),
//     };
//     return await this.commentsRepository.createComment(commentCreateModel);
//   }
//   async updateComment(id: string, updateModel: UpdateCommentInputModel) {
//     const comment = await this.commentsRepository.updateComment(
//       id,
//       updateModel,
//     );
//   }
//
//   async deleteComment(id: string) {
//     await this.commentsRepository.deleteComment(id);
//     return true;
//   }
// }
