import { Schema, model, Document, Types } from 'mongoose';

export interface IInterview extends Document {
  title: string;
  description: string;
  position: string;
  creator: Types.ObjectId;
  teamMembers: Types.ObjectId[];
  positionOverviewVideo: string;
  questions: {
    videoUrl: string;
    text: string;
    maxDuration: number;
    order: number;
  }[];
  status: 'draft' | 'published' | 'closed';
  candidates: {
    email: string;
    status: 'invited' | 'started' | 'completed';
    invitationSentAt: Date;
    completedAt?: Date;
  }[];
  settings: {
    timeLimit: number;
    allowRetakes: boolean;
    preventCopyPaste: boolean;
    requireCameraOn: boolean;
    monitorScreenShare: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const interviewSchema = new Schema<IInterview>({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  position: {
    type: String,
    required: true,
  },
  creator: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  teamMembers: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
  positionOverviewVideo: {
    type: String,
    required: true,
  },
  questions: [{
    videoUrl: String,
    text: String,
    maxDuration: Number,
    order: Number,
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'closed'],
    default: 'draft',
  },
  candidates: [{
    email: String,
    status: {
      type: String,
      enum: ['invited', 'started', 'completed'],
      default: 'invited',
    },
    invitationSentAt: Date,
    completedAt: Date,
  }],
  settings: {
    timeLimit: {
      type: Number,
      required: true,
    },
    allowRetakes: {
      type: Boolean,
      default: false,
    },
    preventCopyPaste: {
      type: Boolean,
      default: true,
    },
    requireCameraOn: {
      type: Boolean,
      default: true,
    },
    monitorScreenShare: {
      type: Boolean,
      default: true,
    },
  },
}, {
  timestamps: true,
});

export default model<IInterview>('Interview', interviewSchema); 