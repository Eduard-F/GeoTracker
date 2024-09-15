import { Schema } from "mongoose";
import { User, UserDocument } from "../models/user.models";
import moment from "moment";

export const getUser = (user: UserDocument) => ({})

export const createUser = ({
  username,
  email,
  password,
}: {
  username: string;
  email: string;
  password: string;
}) => new User({ username, email, password });
export const setResetPasswordToken = (
  user: UserDocument,
  resetTokenValue: string,
  expiryDate: Date
) => {
  user.passwordResetToken = resetTokenValue;
  user.passwordResetExpires = expiryDate;
};

export const findUserBy = async (prop: string, value: string) =>
  await User.findOne({ [prop]: value });

export const findUserById = async (id: typeof Schema.Types.ObjectId) => await User.findById(id);

export const saveUser = async (user: UserDocument) => await user.save();

// TODO: check if the return is correct
export const setUserPassword = async (user: UserDocument, password: string) => {
  user.password = await user.hashPassword(password);
  user.passwordResetToken = "";
  user.passwordResetExpires = moment().toDate();
  return user.password;
};

export const setUserVerified = async (user: UserDocument) => {
  user.isVerified = true;
  user.expires = undefined;
};

export const deleteUserById = async (user: UserDocument) => await User.findByIdAndDelete(user._id);

export const deleteUnverifiedUserByEmail = async (email: string) =>
  await User.findOneAndDelete({ email, isVerified: false });

export default {
  getUser,
  createUser,
  setResetPasswordToken,
  findUserBy,
  findUserById,
  saveUser,
  setUserPassword,
  setUserVerified,
  deleteUserById,
  deleteUnverifiedUserByEmail,
};
