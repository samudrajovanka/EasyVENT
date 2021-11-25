import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import EventService from '@servicesDb/EventService';

async function handler(req, res) {
  const eventService = new EventService();

  switch (req.method) {
    case 'GET':
      try {
        const { id } = req.query;

        const event = await eventService.getEventById(id);

        return res.status(200).json({
          success: true,
          data: {
            event,
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
