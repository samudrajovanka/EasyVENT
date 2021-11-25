import AuthenticationError from '@exceptions/AuthenticationError';
import ClientError from '@exceptions/ClientError';
import connectDb from '@lib/connectDb';
import { clientErrRes, notAllowedErrRes, serverErrRes } from '@lib/errorResponse';
import uploadFormData from '@lib/uploadFormData';
import eventValidation from '@validations/event';
import EventService from '@servicesDb/EventService';
import { getSession } from 'next-auth/client';

async function handler(req, res) {
  const eventService = new EventService();

  switch (req.method) {
    case 'GET':
      try {
        const { username } = req.query;

        const events = await eventService.getEvents(username);

        return res.status(200).json({
          success: true,
          data: {
            events,
          },
        });
      } catch (error) {
        if (error instanceof ClientError) {
          return res.status(error.statusCode).json(clientErrRes(error));
        }

        return res.status(500).json(serverErrRes(error));
      }
    case 'POST':
      try {
        const session = await getSession({ req });

        if (!session) {
          throw new AuthenticationError('No authenticated');
        }

        const data = await uploadFormData(req, {
          typeFile: ['image/jpeg', 'image/jpg', 'image/png'],
        });

        const {
          name, type, caption, startTime, endTime, fee = 0, contactPersons, link,
        } = data.fields;
        const { banner } = data.files;

        const owner = session.user.name;

        eventValidation.validateCreateEventPayload({ ...data.fields, banner });

        const idEvent = await eventService.createEvent({
          owner, name, type, caption, startTime, endTime, fee, contactPersons, link, banner,
        });

        return res.status(201).json({
          success: true,
          data: {
            id: idEvent,
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

export const config = {
  api: {
    bodyParser: false,
  },
};
