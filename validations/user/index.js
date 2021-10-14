import InvariantError from '@exceptions/InvariantError';
import { VALIDATION_ERR } from '@lib/constantErrorType';
import { UserRegisterPayloadSchema } from './schema';

const userValidation = {
  validateRegisterUserPayload: (payload) => {
    const validationResult = UserRegisterPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
};

export default userValidation;
