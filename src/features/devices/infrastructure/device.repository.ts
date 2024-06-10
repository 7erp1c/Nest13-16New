import { InjectModel } from '@nestjs/mongoose';
import { SessionModel } from '../api/model/input/session.input.models';
import { Session, SessionDocument } from '../domain/device.entity';
import { Model } from 'mongoose';

export class DeviceRepository {
  constructor(
    @InjectModel(Session.name) protected sessionsModel: Model<Session>,
  ) {}
  async createNewSession(sessionModel: SessionModel) {
    try {
      const session: SessionDocument =
        await this.sessionsModel.create(sessionModel);
      return session._id.toString();
    } catch {
      throw new Error();
    }
  }
}
