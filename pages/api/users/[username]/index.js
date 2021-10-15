import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import UserService from '@servicesDb/UserService';

async function handler(req, res) {
  const userService = new UserService();

  switch (req.method) {
    case 'GET':
      try {
        const { username } = req.query;

        const user = await userService.getUserByUsername({ username });

        return res.status(200).json({
          success: true,
          data: {
            user,
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
