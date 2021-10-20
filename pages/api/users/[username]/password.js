import AuthenticationError from '@exceptions/AuthenticationError';
import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import UserService from '@servicesDb/UserService';
import userValidation from '@validations/user';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  const userService = new UserService();

  switch (req.method) {
    case 'PUT':
      try {
        const session = await getSession({ req });

        if (!session) {
          throw new AuthenticationError('No authenticated');
        }

        const { oldPassword, newPassword, confirmNewPassword } = req.body;

        userValidation.validateUserUpdatePasswordPayload(req.body);

        const { username } = req.query;

        await userService.updateUserPassword(username,
          { oldPassword, newPassword, confirmNewPassword });

        return res.status(200).json({
          success: true,
          message: 'Password successfull updated',
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
