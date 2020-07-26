export class User {

  constructor(public email: string, public id: string, private _token: string, private _expiryDate: Date) {}

  get token() {
    if (!this._token || this._token.trim().length == 0 || !this._expiryDate) return null;
    else if (new Date() > this._expiryDate) return null;
    else return this._token;
  }

}
