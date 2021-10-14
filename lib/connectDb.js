import mongoose from 'mongoose';
import { permissionErrRes } from './errorResponse';

const connectDb = (handler, isWithoutApiKey) => async (req, res) => {
  const apiKey = req.headers['x-api-key'];

  if (!isWithoutApiKey) {
    if (apiKey !== process.env.API_KEY) {
      return res.status(403).json(permissionErrRes());
    }
  }

  if (mongoose.connections[0].readyState) {
    return handler(req, res);
  }

  await mongoose.connect(process.env.MONGO_URI, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  });

  return handler(req, res);
};

export default connectDb;
