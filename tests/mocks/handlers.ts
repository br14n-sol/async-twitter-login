import { http, HttpResponse } from 'msw'

export const handlers = [
  http.post('https://api.twitter.com/oauth/request_token', () => {
    return HttpResponse.text(
      'oauth_token=REQUEST_TOKEN&oauth_token_secret=REQUEST_TOKEN_SECRET&oauth_callback_confirmed=true',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  }),
  http.post('https://api.twitter.com/oauth/access_token', () => {
    return HttpResponse.text(
      'oauth_token=ACCESS_TOKEN&oauth_token_secret=ACCESS_TOKEN_SECRET&user_id=1234567&screen_name=johndoe',
      {
        status: 200,
        headers: {
          'Content-Type': 'text/html'
        }
      }
    )
  })
]
