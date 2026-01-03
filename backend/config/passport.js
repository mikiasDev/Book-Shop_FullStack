import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as GitHubStrategy } from 'passport-github2';
import User from '../models/User.js';

// Google Strategy
if (process.env.GOOGLE_CLIENT_ID) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/auth/google/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Ensure email is available
          if (!profile.emails || !profile.emails[0]) {
            return done(new Error('No email provided by Google'), null);
          }
          let user = await User.findOne({ email: profile.emails[0].value });
          if (!user) {
            user = await User.create({
              name: profile.displayName,
              email: profile.emails[0].value,
              password: 'oauth_user', // dummy password for OAuth users
              isEmailVerified: true, // Google users are considered verified
              googleId: profile.id, // Store Google ID for future logins
            });
          } else if (!user.googleId) {
            // If user exists but googleId is not set, update it
            user.googleId = profile.id;
            await user.save();
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// GitHub Strategy
if (process.env.GITHUB_CLIENT_ID || true) {
  passport.use(
    new GitHubStrategy(
      {
        clientID: process.env.GITHUB_CLIENT_ID || 'Ov23li0wwP68VJhrGeT3',
        clientSecret: process.env.GITHUB_CLIENT_SECRET || 'a46379e0fca6e7e37faa7615e2c880eb7fba1e40',
        callbackURL: '/auth/github/callback',
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // GitHub may not provide email in profile, so check
          let email = profile.emails && profile.emails[0] ? profile.emails[0].value : profile._json.email;
          if (!email) {
            // If no email, use username@github.com as placeholder
            email = `${profile.username}@github.com`;
          }
          let user = await User.findOne({ email });
          if (!user) {
            user = await User.create({
              name: profile.displayName || profile.username,
              email,
              password: 'oauth_user', // dummy password for OAuth users
              isEmailVerified: true, // GitHub users are considered verified
            });
          }
          return done(null, user);
        } catch (error) {
          return done(error, null);
        }
      }
    )
  );
}

// Serialize and Deserialize
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;