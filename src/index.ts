import { OAuth } from 'oauth'
import type {
  IConstructorOptions,
  ICallbackOptions,
  IRequestResponse,
  ICallbackResponse
} from './types'

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'

// Taking into account: https://stackoverflow.com/questions/14336605/twitter-does-not-remember-authorization
const AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'

class AsyncTwitterLogin {
  private readonly consumerKey: string
  private readonly consumerSecret: string
  private readonly callbackUrl: string
  private readonly oauth: OAuth

  constructor (args: IConstructorOptions) {
    this.consumerKey = args.consumerKey
    this.consumerSecret = args.consumerSecret
    this.callbackUrl = args.callbackUrl
    this.oauth = new OAuth(
      REQUEST_TOKEN_URL,
      ACCESS_TOKEN_URL,
      this.consumerKey,
      this.consumerSecret,
      '1.0A',
      this.callbackUrl,
      'HMAC-SHA1'
    )
  }

  async request (): Promise<IRequestResponse> {
    return await new Promise((resolve, reject) => {
      this.oauth.getOAuthRequestToken((error, oauthToken, oauthTokenSecret, results) => {
        if (error != null) {
          reject(error)
          return
        }

        const { oauth_callback_confirmed: callbackConfirmed } = results
        if (callbackConfirmed !== 'true') {
          reject(new Error('AsyncTwitterLogin: `oauth_callback_confirmed` is not `true` (Does your application have a callback url configured?)'))
          return
        }

        const redirectUrl = `${AUTHENTICATE_URL}?oauth_token=${oauthToken}`
        resolve({
          token: oauthToken,
          tokenSecret: oauthTokenSecret,
          redirectUrl
        })
      })
    })
  }

  async callback ({
    token,
    tokenSecret,
    verifier
  }: ICallbackOptions): Promise<ICallbackResponse> {
    return await new Promise((resolve, reject) => {
      this.oauth.getOAuthAccessToken(token, tokenSecret, verifier, (error, oauthAccessToken, oauthAccessTokenSecret, results) => {
        if (error != null) {
          reject(error)
          return
        }

        const { user_id: id, screen_name: userName } = results
        resolve({
          id,
          userName,
          token: oauthAccessToken,
          tokenSecret: oauthAccessTokenSecret
        })
      }
      )
    })
  }
}

export { AsyncTwitterLogin }
