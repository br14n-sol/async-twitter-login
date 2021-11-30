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

export interface IRequestResponse {
  token: string
  tokenSecret: string
  redirectUrl: string
}

export interface ICallbackResponse {
  id: string
  userName: string
  token: string
  tokenSecret: string
}