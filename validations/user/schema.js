import Joi from 'joi';

const UserRegisterPayloadSchema = Joi.object({
  name: Joi.string().required().min(3).max(50),
  email: Joi.string().email().required(),
  username: Joi.string().required().min(3).max(15),
  password: Joi.string().required().min(8).max(100),
  confirmPassword: Joi.string().required().min(8).max(100),
});

export {
  UserRegisterPayloadSchema,
};
