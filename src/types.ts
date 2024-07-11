export interface IConstructorOptions {
  consumerKey: string
  consumerSecret: string
  callbackUrl: string
}

export interface ICallbackOptions {
  token: string
  tokenSecret: string
  verifier: string
}

export type TokenData = {
  token: string
  tokenSecret: string
  redirectUrl: string
}

export type UserData = {
  id: string
  userName: string
  token: string
  tokenSecret: string
}
