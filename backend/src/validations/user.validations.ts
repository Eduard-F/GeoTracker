import Joi from "joi";
import { UserDocument } from "../models/user.models";

export function validateUser(
  user: Pick<UserDocument, "name" | "email" | "password" | "role">
) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
    role: Joi.string().min(3).max(50).required(),
  });

  return schema.validate(user);
}

export function validateLoginInput(input: Pick<UserDocument, "email" | "password">) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(255).required(),
  });

  return schema.validate(input);
}

export function validateRegisterInput(
  input: Pick<UserDocument, "email" | "password">
) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validateEmail(input: Pick<UserDocument, "email">) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
  });

  return schema.validate(input);
}

export function validatePassword(input: Pick<UserDocument, "password">) {
  const schema = Joi.object({
    password: Joi.string().min(5).max(255).required(),
  });
  return schema.validate(input);
}
