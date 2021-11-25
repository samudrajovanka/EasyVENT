import InvariantError from '@exceptions/InvariantError';
import { VALIDATION_ERR } from '@constants/errorType';
import {
  UserFollowPayloadSchema,
  UserLoginPayloadSchema,
  UserRegisterPayloadSchema,
  UserUpdateEmailPayloadSchema,
  UserUpdatePasswordPayloadSchema,
  UserUpdateProfilePayloadSchema,
} from './schema';

const userValidation = {
  validateRegisterUserPayload: (payload) => {
    const validationResult = UserRegisterPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateLoginUserPayload: (payload) => {
    const validationResult = UserLoginPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUserFollowPayload: (payload) => {
    const validationResult = UserFollowPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUserUpdateProfilePayload: (payload) => {
    const validationResult = UserUpdateProfilePayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUserUpdatePasswordPayload: (payload) => {
    const validationResult = UserUpdatePasswordPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
  validateUserUpdateEmailPayload: (payload) => {
    const validationResult = UserUpdateEmailPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
};

export default userValidation;
