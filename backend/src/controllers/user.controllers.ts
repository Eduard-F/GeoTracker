import { Request, Response } from "express";

import sanitize from "mongo-sanitize";
import { validateEmail, validateRegisterInput } from "../validations/user.validations";

import UserService from "../services/user.services";
import TokenService from "../services/token.services";
import EmailService from "../services/email.services";

// Define email address that will send the emails to your users.

export const getUser = (req: Request, res: Response) => {
  const user = req.user;

  res.status(200).send({ message: "User info successfully retreived", user });
};

export const postUser = async (req: Request, res: Response) => {
  // Validate Register input
  const { error } = validateRegisterInput(req.body);
  // @ts-ignore
  if (error) return res.status(400).send({ message: error.details[0].message });

  let sanitizedInput = sanitize<{ email: string; password: string; }>(req.body);

  try {
    let user = await UserService.findUserBy("email", sanitizedInput.email.toLowerCase());

    if (user) {
      return res.status(400).send({ message: "email already taken. Take an another email" });
    }

    user = await UserService.findUserBy("email", sanitizedInput.email.toLowerCase());

    if (user) {
      return res.status(400).send({ message: "Email already registered. Take an another email" });
    }

    const newUser = UserService.createUser(sanitizedInput);
    await UserService.setUserPassword(newUser, newUser.password);
    try {
      await UserService.saveUser(newUser);
      const verificationToken = TokenService.createToken();
      // @ts-ignore
      TokenService.setUserId(verificationToken, newUser._id);
      TokenService.saveToken(verificationToken);
      const verificationEmail = EmailService.createVerificationEmail(
        newUser.email,
        verificationToken.token
      );
      try {
        EmailService.sendEmail(verificationEmail);

        return res.status(200).send({ message: "A verification mail has been sent." });
      } catch (error) {
        // @ts-ignore
        UserService.deleteUserById(newUser._id);

        return res.status(503).send({
          message: `Impossible to send an email to ${newUser.email}, try again. Our service may be down.`,
        });
      }
    } catch (error) {
      console.log(error);

      return res.status(500).send({ message: "Creation of user failed, try again." });
    }
  } catch (error) {
    console.log(error);

    return res.status(500).send("An unexpected error occurred");
  }
};

export const postUserCancel = (req: Request, res: Response) => {
  const { error } = validateEmail(req.body);
  // @ts-ignore
  if (error) return res.status(400).send({ message: error.details[0].message });

  const sanitizedInputs = sanitize<{ email: string }>(req.body);

  try {
    UserService.deleteUnverifiedUserByEmail(sanitizedInputs.email);
    return res.status(200).send({ message: "User reset success" });
  } catch (error) {
    return res.status(500).send("An unexpected error occurred");
  }
};

export default {
  getUser,
  postUser,
  postUserCancel,
};
