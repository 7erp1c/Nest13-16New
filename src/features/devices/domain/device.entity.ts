import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type SessionDocument = HydratedDocument<Session>;

@Schema()
class RefreshTokenSchema {
  @Prop()
  createdAt: number;

  @Prop()
  expiredAt: number;
}

@Schema()
export class Session {
  @Prop()
  userId: string;

  @Prop()
  deviceId: string;

  @Prop()
  deviceTitle: string;

  @Prop()
  ip: string;

  @Prop()
  lastActiveDate: number;

  @Prop({ type: RefreshTokenSchema })
  refreshToken: {
    createdAt: number;
    expiredAt: number;
  };
}

export const DevicesSchema = SchemaFactory.createForClass(Session);
