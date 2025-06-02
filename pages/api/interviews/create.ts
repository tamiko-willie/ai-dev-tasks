import type { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';

type InterviewData = {
  title: string;
  position: string;
  candidateEmail: string;
  deadline: string;
  questions: Array<{
    text: string;
    duration: number;
    preparationTime: number;
  }>;
};

type ErrorResponse = {
  error: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ id: string } | ErrorResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body as InterviewData;

    // Validate required fields
    if (!data.title || !data.candidateEmail || !data.deadline || !data.questions?.length) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Validate email format
    const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
    if (!emailRegex.test(data.candidateEmail)) {
      return res.status(400).json({ error: 'Invalid email format' });
    }

    // Validate deadline is in the future
    const deadlineDate = new Date(data.deadline);
    if (deadlineDate <= new Date()) {
      return res.status(400).json({ error: 'Deadline must be in the future' });
    }

    // Connect to MongoDB
    const client = await MongoClient.connect(process.env.MONGODB_URI as string);
    const db = client.db('virtual-interview-platform');
    
    // Create the interview
    const interview = {
      ...data,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date(),
      employerId: new ObjectId(req.headers['employer-id']), // Assuming employer ID is passed in headers
      recordings: []
    };

    const result = await db.collection('interviews').insertOne(interview);
    await client.close();

    // Send confirmation email to candidate
    // TODO: Implement email sending

    return res.status(201).json({ id: result.insertedId.toString() });
  } catch (error) {
    console.error('Error creating interview:', error);
    return res.status(500).json({ error: 'Failed to create interview' });
  }
}