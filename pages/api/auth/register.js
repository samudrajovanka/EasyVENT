import ClientError from '@exceptions/ClientError';
import InvariantError from '@exceptions/InvariantError';
import connectDb from '@lib/connectDb';
import { NAME_ALPHANUMERIC_ERR_MSG, USERNAME_REGEX_ERR_MSG } from '@lib/constantErrorMessage';
import { VALIDATION_ERR } from '@lib/constantErrorType';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import { isAlphanumericWithSpace, isUsername } from '@lib/typeChecking';
import UserService from '@servicesDb/UserService';
import userValidation from '@validations/user';

async function handler(req, res) {
  const userService = new UserService();

  switch (req.method) {
    case 'POST':
      // register user
      try {
        // get user data from request
        const {
          name, email, username, password, confirmPassword,
        } = req.body;

        // validate user data
        userValidation.validateRegisterUserPayload(req.body);

        // check name alphanumeric
        if (!isAlphanumericWithSpace(name)) {
          throw new InvariantError(NAME_ALPHANUMERIC_ERR_MSG, VALIDATION_ERR);
        }

        // check username regex
        if (!isUsername(username)) {
          throw new InvariantError(USERNAME_REGEX_ERR_MSG, VALIDATION_ERR);
        }

        // create user
        await userService.createUser({
          name, email, username, password, confirmPassword,
        });

        return res.status(200).json({
          success: true,
          message: 'Activation link success sent to mail. Please check',
        });
      } catch (error) {
        if (error instanceof ClientError) {
          return res.status(error.statusCode).json(clientErrRes(error));
        }

        return res.status(500).json(serverErrRes(error));
      }
    default:
      return res.status(400).json(notAllowedErrRes());
  }
}

export default connectDb(handler);
