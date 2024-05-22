import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, ObjectId } from 'mongoose';
import { randomUUID } from 'crypto';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop()
  login: string;
  @Prop()
  email: string;
  @Prop()
  hash: string;
  @Prop()
  createdAt: string;
  @Prop()
  isConfirmed: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
