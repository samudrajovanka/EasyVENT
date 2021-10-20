import { INVARIANT_ERR } from '@constants/errorType';
import ClientError from './ClientError';

class InvariantError extends ClientError {
  constructor(message, type = INVARIANT_ERR) {
    super(message, type);
    this.name = 'Invariant Error';
  }
}

export default InvariantError;
