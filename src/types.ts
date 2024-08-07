export type TwitterLoginOptions = {
  consumerKey: string
  consumerSecret: string
  callbackURL: string
}

export type GetAccessTokenOptions = {
  requestToken: string
  requestTokenSecret: string
  verifier: string
}

export type TokenData = {
  token: string
  tokenSecret: string
  redirectURL: string
}

export type UserData = {
  id: string
  username: string
  accessToken: string
  accessTokenSecret: string
}
