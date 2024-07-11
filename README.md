<h1 align="center">
  async-twitter-login
</h1>

<p align="center">
  <b>Simple Twitter™(aka X™) Login with Promises.</b>
</p>

<div align="center">

  ![license](https://img.shields.io/npm/l/async-twitter-login)
  ![node-current](https://img.shields.io/node/v/async-twitter-login?color=darkgreen)
  ![version](https://img.shields.io/npm/v/async-twitter-login?color=orange)
  ![unpacked-size](https://img.shields.io/npm/unpacked-size/async-twitter-login)
  ![downloads](https://img.shields.io/npm/dt/async-twitter-login)

</div>

## ✨ Features

* Twitter OAuth lightweight wrap.
* Promises. 🎈
* Readable Objects.

All this in < 9kb, what else do you need? ✨

## 📦 Installation

```shell
npm install async-twitter-login
```

## 🚀 Quick start

We will configure two routes in our web server, `auth/login` and `auth/callback` can have any name :P

### Initialization

We import and instantiate, you will need your consumer key and your consumer secret... both are obtained when creating an application from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).

Finally you will need your callback url, as we said before it would be `https://example.com/auth/callback`.

```js
import TwitterLogin from 'async-twitter-login'

const twitterLogin = new TwitterLogin({
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-consumer-secret',
  callbackURL: 'https://example.com/auth/callback'
})
```

### Login

From our `auth/login` path we call the `getRequestToken()` method and save in a safe place `token` and `tokenSecret` to use it later.

```js
app.get('/auth/login', async (req, res) => {
  try {
    // Get the request token and the redirect URL
    const { token, tokenSecret, redirectURL } = await twitterLogin.getRequestToken()
    
    // Save the token and token secret in safe place
    req.session.token = token
    req.session.tokenSecret = tokenSecret

    // Redirect to Twitter to authenticate in the application
    res.redirect(redirectURL)
    return
  } catch (err) {
    // Handle errors
  }
})
```

### Callback

If the user completes the authorization from twitter, he will be redirected to his `auth/callback` path together with `oauth_token` and `oauth_verifier` as query parameters in the URL, they are accessed with `req.query` but we only need the `oauth_verifier`.

We call the `getAccessToken()` method from our `auth/callback` path and pass the parameters to it along with the `token` and `tokenSecret` that we saved in the previous step.

This method will return a user object with the user's data. 🙍‍♂️

```js
app.get('/auth/callback', async (req, res) => {
  // Get the token and token secret from the session
  const { token, tokenSecret } = req.session

  // Get the oauth_verifier from the query parameters
  const { oauth_verifier: verifier } = req.query

  if (!token || !tokenSecret || !verifier) {
    // Handle missing or invalid data
  }

  try {
    // Get the access token and the user data
    const user = await twitterLogin.getAccessToken({ token, tokenSecret, verifier })

    // Delete the token and token secret from the session
    delete req.session.token
    delete req.session.tokenSecret

    // The user object is a readable object with the user's data.
    // user = {
    //   id,
    //   username,
    //   accessToken,
    //   accessTokenSecret
    // }
    req.session.user = user

    // Redirect to the home page
    res.redirect('/')
    return
  } catch (err) {
    // Handle errors
  }
})
```

## Copyright & License

© 2021 [Brian Fernandez](https://github.com/br14n-sol)

This project is licensed under the MIT license. See the file [LICENSE](LICENSE) for details.

## Disclaimer

No affiliation with X Corp.

This package is a third-party offering and is not a product of X Corp.

Twitter™ and X™ are trademarks of X Corp.