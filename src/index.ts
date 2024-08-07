import { OAuth } from 'oauth'
import type {
  GetAccessTokenOptions,
  TokenData,
  TwitterLoginOptions,
  UserData
} from './types.js'

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'

// Taking into account: https://stackoverflow.com/questions/14336605/twitter-does-not-remember-authorization
const AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'

class TwitterLogin {
  private readonly oauth: OAuth

  constructor(opts: TwitterLoginOptions) {
    const { consumerKey, consumerSecret, callbackURL } = opts

    this.oauth = new OAuth(
      REQUEST_TOKEN_URL,
      ACCESS_TOKEN_URL,
      consumerKey,
      consumerSecret,
      '1.0A',
      callbackURL,
      'HMAC-SHA1'
    )
  }

  getRequestToken() {
    return new Promise<TokenData>((resolve, reject) => {
      this.oauth.getOAuthRequestToken(
        (error, oauthToken, oauthTokenSecret, results) => {
          if (error != null) {
            reject(error)
            return
          }

          const { oauth_callback_confirmed: callbackConfirmed } = results
          if (callbackConfirmed !== 'true') {
            const errorMessage = `TwitterLogin: 'oauth_callback_confirmed' is different from 'true', got '${callbackConfirmed}'`
            reject(new Error(errorMessage))
            return
          }

          const redirectURL = `${AUTHENTICATE_URL}?oauth_token=${oauthToken}`
          resolve({
            token: oauthToken,
            tokenSecret: oauthTokenSecret,
            redirectURL
          })
        }
      )
    })
  }

  getAccessToken(opts: GetAccessTokenOptions) {
    const { requestToken, requestTokenSecret, verifier } = opts

    return new Promise<UserData>((resolve, reject) => {
      this.oauth.getOAuthAccessToken(
        requestToken,
        requestTokenSecret,
        verifier,
        (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
          if (error != null) {
            reject(error)
            return
          }

          const { user_id: id, screen_name: username } = results
          resolve({
            id,
            username,
            accessToken: oauthAccessToken,
            accessTokenSecret: oauthAccessTokenSecret
          })
        }
      )
    })
  }
}

export type { TokenData, UserData }

export default TwitterLogin
