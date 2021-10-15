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

export {
  UserRegisterPayloadSchema,
  UserLoginPayloadSchema,
  UserFollowPayloadSchema,
};
