import { Injectable } from '@nestjs/common';
import { appSettings } from '../../../settings/app-settings';
import mongoose from 'mongoose';

@Injectable()
export class TestingRepository {
  constructor() {}
  async dropDb() {
    try {
      const db = appSettings.api.MONGO_CONNECTION_URI;
      //+
      // '/' +
      // appSettings.api.MONGO_DB_NAME;
      await mongoose.connect(db); // Connecting to the database.
      await mongoose.connection.db.dropDatabase();
    } catch {
      console.log('DB dropping does failed');
      throw new Error('DB dropping did fail');
    }
  }

  async deleteAll() {
    await this.dropDb();
  }
}
