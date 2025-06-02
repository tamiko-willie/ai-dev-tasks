import { Schema, model, Document, Types } from 'mongoose';

export interface IResponse extends Document {
  interview: Types.ObjectId;
  candidate: {
    email: string;
    name: string;
  };
  responses: {
    questionIndex: number;
    videoUrl: string;
    duration: number;
    aiAnalysis: {
      confidence: number;
      clarity: number;
      engagement: number;
      authenticity: number;
      technicalAccuracy: number;
      behavioralFlags: string[];
      transcription: string;
      sentiment: 'positive' | 'neutral' | 'negative';
    };
  }[];
  overallScore: number;
  aiRanking: number;
  behaviorAnalysis: {
    suspiciousActivities: string[];
    attentiveness: number;
    nervousness: number;
    confidence: number;
  };
  completed: boolean;
  startedAt: Date;
  completedAt?: Date;
}

const responseSchema = new Schema<IResponse>({
  interview: {
    type: Schema.Types.ObjectId,
    ref: 'Interview',
    required: true,
  },
  candidate: {
    email: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  responses: [{
    questionIndex: Number,
    videoUrl: String,
    duration: Number,
    aiAnalysis: {
      confidence: Number,
      clarity: Number,
      engagement: Number,
      authenticity: Number,
      technicalAccuracy: Number,
      behavioralFlags: [String],
      transcription: String,
      sentiment: {
        type: String,
        enum: ['positive', 'neutral', 'negative'],
      },
    },
  }],
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
  },
  aiRanking: {
    type: Number,
    min: 1,
  },
  behaviorAnalysis: {
    suspiciousActivities: [String],
    attentiveness: {
      type: Number,
      min: 0,
      max: 100,
    },
    nervousness: {
      type: Number,
      min: 0,
      max: 100,
    },
    confidence: {
      type: Number,
      min: 0,
      max: 100,
    },
  },
  completed: {
    type: Boolean,
    default: false,
  },
  startedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: Date,
}, {
  timestamps: true,
});

export default model<IResponse>('Response', responseSchema); 