import mongoose from 'mongoose';

const { Schema } = mongoose;

const UserFollowersSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  followers: [
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

module.exports = mongoose.models.UserFollowers || mongoose.model('UserFollowers', UserFollowersSchema);
