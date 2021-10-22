import Joi from 'joi';

const UserRegisterPayloadSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  username: Joi.string().required().min(3).max(20),
  password: Joi.string().required().min(8).max(100),
  confirmPassword: Joi.string().required(),
});

const UserLoginPayloadSchema = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required(),
});

const UserFollowPayloadSchema = Joi.object({
  username: Joi.string().required(),
});

const UserUpdateProfilePayloadSchema = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  username: Joi.string().required().min(3).max(20),
  avatar: Joi.object(),
});

const UserUpdatePasswordPayloadSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string().required().min(8).max(100),
  confirmNewPassword: Joi.string().required(),
});

const UserUpdateEmailPayloadSchema = Joi.object({
  email: Joi.string().email().required(),
});

export {
  UserRegisterPayloadSchema,
  UserLoginPayloadSchema,
  UserFollowPayloadSchema,
  UserUpdateProfilePayloadSchema,
  UserUpdatePasswordPayloadSchema,
  UserUpdateEmailPayloadSchema,
};
