import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CommentDocument = HydratedDocument<Comment>;

@Schema()
export class CommentatorInfo {
  @Prop()
  userId: string;
  @Prop()
  userLogin: string;
}
@Schema()
export class Comment {
  @Prop()
  content: string;

  @Prop()
  postId: string;

  @Prop({ type: CommentatorInfo })
  commentatorInfo: {
    userId: string;
    userLogin: string;
  };

  @Prop()
  createdAt: string;
}
export const CommentSchema = SchemaFactory.createForClass(Comment);
