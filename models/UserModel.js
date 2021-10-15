import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatar: {
    url: {
      type: String,
      required: true,
    },
    path: {
      type: String,
      default: null,
    },
    default: {
      type: Boolean,
      required: true,
      default: true,
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

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);
