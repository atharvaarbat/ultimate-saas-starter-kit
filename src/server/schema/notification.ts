import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ["message", "calendar", "user", "default", "invite"],
    required: true,
  },
  fromUserEmail: {
    type: String,
    required: true,
  },
  toUserEmail: {
    type: String,
    required: true,
  },
  isRead: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});


export const Notification = mongoose.models.Notification || mongoose.model('Notification', notificationSchema);