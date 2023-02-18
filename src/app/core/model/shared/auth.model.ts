export class AuthModel {
  accessToken: string;
  refreshToken: string;
  expiresIn: Date;
  user: any;
  setAuth(auth: AuthModel) {
    this.accessToken = auth.accessToken;
    this.refreshToken = auth.refreshToken;
    this.expiresIn = auth.expiresIn;
  }
}
