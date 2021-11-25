import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserFollowingSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  followings: [
    {
      type: String,
    },
  ],
  created_at: {
    type: Date,
    default: Date.now(),
  },
  updated_at: {
    type: Date,
    default: Date.now(),
  },
});

module.exports = mongoose.models.UserFollowing || mongoose.model('UserFollowing', UserFollowingSchema);
