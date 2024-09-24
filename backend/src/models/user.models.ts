import { model, Schema, Document } from "mongoose";
import argon2 from "argon2";
import moment from "moment";

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  passwordResetToken: string;
  passwordResetExpires: Date;
  isVerified: boolean;
  role: string;
  expires?: Date;

  comparePassword(password: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
}

const userSchema = new Schema<UserDocument>({
  name: {
    type: String,
    required: false,
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
  role: {
    type: String,
    default: 'user',
    required: true,
  },
  expires: { type: Date, default: moment().toDate(), expires: 43200 },
});

userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await argon2.verify(this.password, password);
};

userSchema.methods.hashPassword = async function(password: string) {
  return argon2.hash(password);
};


export const User = model<UserDocument>("User", userSchema);

export default User;
