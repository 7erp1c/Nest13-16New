import { Injectable, Scope } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ scope: Scope.TRANSIENT })
export class RandomNumberService {
  generateRandomUUID(): string {
    return uuidv4();
  }
}
