export class SessionModel {
  userId: string;
  deviceId: string;
  deviceTitle: string;
  ip: string;
  lastActiveDate: string;
  refreshToken: {
    createdAt: string;
    expiredAt: string;
  };
}

export class SessionUpdateModel {
  lastActiveDate: number;
  refreshToken: {
    createdAt: number;
    expiredAt: number;
  };
}

export class SessionInputModel {
  deviceTitle: string;
  ip: string;
}
