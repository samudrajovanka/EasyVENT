import { VALIDATION_ERR } from '@constants/errorType';
import InvariantError from '@exceptions/InvariantError';
import { EventPayloadSchema } from './schema';

const eventValidation = {
  validateCreateEventPayload: (payload) => {
    const validationResult = EventPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message, VALIDATION_ERR);
    }
  },
};

export default eventValidation;
