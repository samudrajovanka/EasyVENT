import mongoose from 'mongoose';

const { Schema } = mongoose;

const EventSchema = new Schema({
  owner: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['webinar', 'workshop'],
  },
  caption: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  fee: {
    type: Number,
    default: 0,
  },
  contact_persons: [
    {
      name: {
        type: String,
        required: true,
      },
      app: {
        type: String,
        required: true,
        enum: ['whatsapp', 'telegram', 'line', 'instagram'],
      },
      value: {
        type: String,
        required: true,
      },
    },
  ],
  link: {
    type: String,
    required: true,
  },
  banner: {
    url: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      required: true,
    },
  },
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.models.Event || mongoose.model('Event', EventSchema);
