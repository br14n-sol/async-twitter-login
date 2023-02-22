# async-twitter-login

![npm](https://img.shields.io/npm/v/async-twitter-login)
![npm bundle size](https://img.shields.io/bundlephobia/minzip/async-twitter-login)
![npm](https://img.shields.io/npm/dm/async-twitter-login)
![Libraries.io SourceRank](https://img.shields.io/librariesio/sourcerank/npm/async-twitter-login)

Simple Twitter login, without much of the bullshit. and promises... who doesn't like them?

## ✨ Features

* Twitter OAuth lightweight wrap.
* Promises. 🎈
* Readable Objects.

All this in < 4kb, what else do you need? ✨

## 📦 Installation

```shell
npm install async-twitter-login
```

## 🚀 Quick start

We will configure two routes in our web server, `auth/login` and `auth/callback` can have any name :P

### Initialization

We import and instantiate, you will need your consumer key and your comsumer secret... both are obtained when creating an application from the [Twitter Developer Portal](https://developer.twitter.com/en/portal/dashboard).

Finally you will need your callback url, as we said before it would be `https://example.com/auth/callback`.

```js
// ECMAScript
import AsyncTwitterLogin from 'async-twitter-login'

// CommonJS
const AsyncTwitterLogin = require('async-twitter-login').default

const twitterLogin = new AsyncTwitterLogin({
  consumerKey: 'your-consumer-key',
  consumerSecret: 'your-consumer-secret',
  callbackUrl: 'https://example.com/auth/callback'
})
```

### Login

From our `auth/login` path we call the `request()` method and save in a safe place `tokenSecret` to use it later.

```js
app.get('/auth/login', async (req, res) => {
  try {
    const { token, tokenSecret, redirectUrl } = await twitterLogin.request()
    
    // Save the token secret in a safe place
    req.session.tokenSecret = tokenSecret

    // Redirect to Twitter to authorize the application
    res.redirect(redirectUrl)
  } catch (err) {
    // Handle errors
  }
})
```

### Callback

If the user completes the authorization from twitter, he will be redirected to his `auth/callback` path together with `oauth_token` and `oauth_verifier` as query parameters in the URL, they are accessed with `req.query`.

We call the `callback()` method from our `auth/callback` path and pass the parameters to it along with the `tokenSecret` that we saved in the previous step.

This method will return a user object. 🧔

```js
app.get('/auth/callback', async (req, res) => {
  try {
    const { oauth_token: token, oauth_verifier: verifier } = req.query
    const tokenSecret = req.session.tokenSecret
    const user = await twitterLogin.callback(token, tokenSecret, verifier)

    // Delete the token secret from the session
    delete req.session.tokenSecret

    // The user object is a readable object with the user's data.
    // user = {
    //   id,
    //   userName,
    //   token,
    //   tokenSecret
    // }
    req.session.user = user

    // Redirect to the home page
    res.redirect('/')
  } catch (err) {
    // Handle errors
  }
})
```

## License

MIT License © 2021 - 2023 [Brian Fernandez](https://twitter.com/br14n_sol).
