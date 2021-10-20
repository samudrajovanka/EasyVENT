import { CLIENT_ERR } from '@constants/errorType';

class ClientError extends Error {
  constructor(message, type = CLIENT_ERR, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
    this.type = type;
  }
}

export default ClientError;
