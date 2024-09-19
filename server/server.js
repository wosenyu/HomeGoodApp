// server/server.js
const express = require('express');
const passport = require('passport');
const OAuth2Strategy = require('passport-oauth2');
const session = require('express-session');
const axios = require('axios');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;


app.use(session({
    secret: 'your-secret-to-me',
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


passport.use(new OAuth2Strategy({
    authorizationURL: 'https://www.etsy.com/oauth/connect',
    tokenURL: 'https://api.etsy.com/v3/public/oauth/token',
    clientID: process.env.ETSY_CLIENT_ID,
    clientSecret: process.env.ETSY_CLIENT_SECRET,
    callbackURL: process.env.ETSY_REDIRECT_URI,
    scope: ['listings_r', 'shops_r'],
}, (accessToken, refreshToken, profile, cb) => {
    return cb(null, { accessToken, refreshToken });
}));


passport.serializeUser((user, done) => {
    done(null, user);
});

passport.deserializeUser((user, done) => {
    done(null, user);
});


app.get('/auth/etsy', passport.authenticate('oauth2'));

// Route to handle callback after OAuth
app.get('/auth/etsy/callback',
    passport.authenticate('oauth2', { failureRedirect: '/' }),
    (req, res) => {
        // Successful authentication, redirect to listings
        res.redirect('/listings');
    }
);


app.get('/listings', async (req, res) => {
    if (!req.user) {
        return res.redirect('/auth/etsy');
    }

    const accessToken = req.user.accessToken;

    try {
        const response = await axios.get('https://api.etsy.com/v3/application/shops/513083969/listings/active', {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });


        res.json(response.data);
    } catch (error) {
        console.error('Failed to fetch listings:', error);
        res.status(500).json({ error: 'Failed to fetch listings' });
    }
});

app.listen(port, () => {
    console.log(`App running on http://localhost:${port}`);
});