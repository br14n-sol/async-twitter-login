import { http, HttpResponse } from 'msw'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { server } from './mocks/node.js'

import TwitterLogin from '../src/index.js'

server.listen({ onUnhandledRequest: 'error' })

afterEach(() => {
  server.resetHandlers()
})

// NOTE: This is my first time making a testing, so I'm not sure if this is the best way to do it
// - If you have another way, please make a PR :)
describe('Twitter Login', () => {
  let twitterLogin: TwitterLogin

  beforeEach(() => {
    twitterLogin = new TwitterLogin({
      consumerKey: 'CONSUMER_KEY',
      consumerSecret: 'CONSUMER_SECRET',
      callbackURL: 'http://127.0.0.1:3000/twitter/callback'
    })
  })

  it('should return valid token data', async () => {
    const tokenData = await twitterLogin.getRequestToken()

    expect(tokenData).toStrictEqual({
      token: 'REQUEST_TOKEN',
      tokenSecret: 'REQUEST_TOKEN_SECRET',
      redirectURL:
        'https://api.twitter.com/oauth/authenticate?oauth_token=REQUEST_TOKEN'
    })
  })

  it('should return valid user data', async () => {
    const userData = await twitterLogin.getAccessToken({
      requestToken: 'REQUEST_TOKEN',
      requestTokenSecret: 'REQUEST_TOKEN_SECRET',
      verifier: 'VERIFIER'
    })

    expect(userData).toStrictEqual({
      id: '1234567',
      username: 'johndoe',
      accessToken: 'ACCESS_TOKEN',
      accessTokenSecret: 'ACCESS_TOKEN_SECRET'
    })
  })

  // NOTE: Twitter's API docs are not clear about this, they just say that it should be true
  // https://developer.twitter.com/en/docs/authentication/oauth-1-0a/obtaining-user-access-tokens
  it('should throw an error if oauth_callback_confirmed is not true', async () => {
    server.use(
      http.post('https://api.twitter.com/oauth/request_token', () => {
        return HttpResponse.text(
          'oauth_token=REQUEST_TOKEN&oauth_token_secret=REQUEST_TOKEN_SECRET&oauth_callback_confirmed=false',
          {
            status: 200,
            headers: {
              'Content-Type': 'text/html'
            }
          }
        )
      })
    )

    await expect(twitterLogin.getRequestToken()).rejects.toThrow()
  })
})
