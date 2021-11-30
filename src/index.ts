/*
  Package: async-twitter-login
  License: MIT
  Author: Brian Fernandez
*/
import { OAuth } from 'oauth'
import {
  IConstructorOptions,
  ICallbackOptions,
  IRequestResponse,
  ICallbackResponse
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
    if (!consumerKey && typeof consumerKey !== 'string') {
      throw new Error('AsyncTwitterLogin: `consumerKey` is required')
    }
    if (!consumerSecret && typeof consumerSecret !== 'string') {
      throw new Error('AsyncTwitterLogin: `consumerSecret` is required')
    }
    if (!callbackUrl && typeof callbackUrl !== 'string') {
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

  request (): Promise<IRequestResponse> {
    return new Promise((resolve, reject) => {
      this.oauth.getOAuthRequestToken((error, token, tokenSecret, results) => {
        if (error) return reject(error)

        const { oauth_callback_confirmed: callbackConfirmed } = results
        if (callbackConfirmed !== 'true') {
          return reject(new Error('AsyncTwitterLogin: `oauth_callback_confirmed` is not `true` (Does your application have a callback url configured?)'))
        }

        const redirectUrl = `${AUTHENTICATE_URL}?oauth_token=${token}`
        return resolve({ token, tokenSecret, redirectUrl })
      })
    })
  }

  callback ({
    token,
    tokenSecret,
    verifier
  }: ICallbackOptions): Promise<ICallbackResponse> {
    return new Promise((resolve, reject) => {
      if (!token && typeof token !== 'string') {
        return reject(new Error('AsyncTwitterLogin: `token` is required'))
      }
      if (!tokenSecret && typeof tokenSecret !== 'string') {
        return reject(new Error('AsyncTwitterLogin: `tokenSecret` is required'))
      }
      if (!verifier && typeof verifier !== 'string') {
        return reject(new Error('AsyncTwitterLogin: `verifier` is required'))
      }

      this.oauth.getOAuthAccessToken(token, tokenSecret, verifier,
        (error, userToken, userTokenSecret, results) => {
          if (error) return reject(error)

          const { user_id: id, screen_name: userName } = results
          return resolve({
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
