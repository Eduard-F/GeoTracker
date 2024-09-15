import { model, Schema, Document } from "mongoose";
import argon2 from "argon2";
import moment from "moment";

export interface UserDocument extends Document {
  username: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  isVerified: boolean;
  isAdmin: boolean;
  expires?: Date;

  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

const userSchema = new Schema<UserDocument>({
  username: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
  },
  passwordResetToken: { type: String, default: "" },
  passwordResetExpires: { type: Date, default: moment().toDate() },
  isVerified: {
    type: Boolean,
    required: true,
    default: false,
  },
  isAdmin: {
    type: Boolean,
    default: false,
    required: true,
  },
  expires: { type: Date, default: moment().toDate(), expires: 43200 },
});

userSchema.methods.comparePassword = async function(password: string) {
  return await argon2.verify(this.password, password);
};

userSchema.methods.hashPassword = async function(password: string) {
  return argon2.hash(password);
};


export const User = model<UserDocument>("User", userSchema);

export default User;
