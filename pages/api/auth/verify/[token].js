import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import UserService from '@servicesDb/UserService';

async function handler(req, res) {
  const userService = new UserService();

  switch (req.method) {
    case 'POST':
      try {
        const { token } = req.query;

        const userId = await userService.verifyEmail({ token });

        return res.status(201).json({
          success: true,
          message: 'Email verified successfully',
          data: {
            id: userId,
          },
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
