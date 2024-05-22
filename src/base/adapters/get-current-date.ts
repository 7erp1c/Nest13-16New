import { Injectable } from '@nestjs/common';

@Injectable()
export class DateCreate {
  async getCurrentDateInISOStringFormat() {
    const currentDate = new Date();
    return currentDate.toISOString();
  }
}
