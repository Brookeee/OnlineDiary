require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const session = require('express-session');
const {ExpressOIDC} = require('@okta/oidc-middleware');
const app = express();
const PORT = 3000;

app.use(
  session({
    secret: process.env.RANDOM_SECRET_WORD,
    resave: true,
    saveUninitialized: false,
  })
);

const oidc = new ExpressOIDC({
  issuer: `${process.env.OKTA_ORG_URL}/oauth2/default`,
  client_id: process.env.OKTA_CLIENT_ID,
  client_secret: process.env.OKTA_CLIENT_SECRET,
  redirect_uri: process.env.REDIRECT_URL,
  scope: 'openid profile',
  routes: {
    callback: {
      path: '/authorization-code/callback',
      defaultRedirect: '/admin',
    },
  },
});

app.use(oidc.router);
app.use(cors());
app.use(bodyParser.json());

app.get('/home', (req, res) => {
  res.send('<h1>Welcome!!</div><a href="/login">Login</a');

  app.get('/admin', (req, res) => {
    res.send('Admin page');
  });
});

app.listen(PORT, () => console.log(`Blog listening on port ${PORT}`));
