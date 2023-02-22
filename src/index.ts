import { OAuth } from 'oauth'
import {
  type IConstructorOptions,
  type ICallbackOptions,
  type IRequestResponse,
  type ICallbackResponse
} from './types'

const REQUEST_TOKEN_URL = 'https://api.twitter.com/oauth/request_token'
const ACCESS_TOKEN_URL = 'https://api.twitter.com/oauth/access_token'
const AUTHENTICATE_URL = 'https://api.twitter.com/oauth/authenticate'

class AsyncTwitterLogin {
  consumerKey: string
  consumerSecret: string
  callbackUrl: string
  oauth: OAuth

  constructor ({
    consumerKey,
    consumerSecret,
    callbackUrl
  }: IConstructorOptions) {
    if (typeof consumerKey !== 'string') {
      throw new Error('AsyncTwitterLogin: `consumerKey` is required')
    }
    if (typeof consumerSecret !== 'string') {
      throw new Error('AsyncTwitterLogin: `consumerSecret` is required')
    }
    if (typeof callbackUrl !== 'string') {
      throw new Error('AsyncTwitterLogin: `callbackUrl` is required')
    }

    this.consumerKey = consumerKey
    this.consumerSecret = consumerSecret
    this.callbackUrl = callbackUrl
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
      this.oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
        if (error != null) {
          reject(error)
          return
        }

        const { oauth_callback_confirmed: callbackConfirmed } = results
        if (callbackConfirmed !== 'true') {
          reject(new Error('AsyncTwitterLogin: `oauth_callback_confirmed` is not `true` (Does your application have a callback url configured?)'))
          return
        }

        const redirectUrl = `${AUTHENTICATE_URL}?oauth_token=${token}`
        resolve({ token, tokenSecret, redirectUrl })
      })
    })
  }

  async callback ({
    token,
    tokenSecret,
    verifier
  }: ICallbackOptions): Promise<ICallbackResponse> {
    return await new Promise((resolve, reject) => {
      if (typeof token !== 'string') {
        reject(new Error('AsyncTwitterLogin: `token` is required'))
        return
      }
      if (typeof tokenSecret !== 'string') {
        reject(new Error('AsyncTwitterLogin: `tokenSecret` is required'))
        return
      }
      if (typeof verifier !== 'string') {
        reject(new Error('AsyncTwitterLogin: `verifier` is required'))
        return
      }

      this.oauth.getOAuthAccessToken(token, tokenSecret, verifier,
        (error, userToken, userTokenSecret, results) => {
          if (error != null) {
            reject(error)
            return
          }

          const { user_id: id, screen_name: userName } = results
          resolve({
            id,
            userName,
            token: userToken,
            tokenSecret: userTokenSecret
          })
        }
      )
    })
  }
}

export { AsyncTwitterLogin }
