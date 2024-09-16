import passport from "passport";
import { UserDocument, User } from "../models/user.models";
import Local from "passport-local";
import argon2 from "argon2";
import { Error } from "mongoose";

export function initPassportJS() {
  passport.use(
    // @ts-ignore
    new Local.Strategy(async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) {
        return done(undefined, false, { message: `email ${email} not found` });
      }
      if (!user.comparePassword(password)) {
        return done(undefined, false, { message: "Incorrect email or password" });
      }
      return done(undefined, user);
    })
  );
  passport.serializeUser((user, done) => done(undefined, user));

  passport.deserializeUser((id, done) =>
    User.findById(id, (err: Error, user: UserDocument) => done(err, user))
  );
}
