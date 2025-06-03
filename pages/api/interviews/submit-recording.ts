import type { NextApiRequest, NextApiResponse } from 'next';
import formidable, { File } from 'formidable';
import fs from 'fs';
import path from 'path';

export const config = {
  api: {
    bodyParser: false
  }
};

const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({ multiples: false, uploadDir: uploadsDir });

  form.parse(req, (err, fields, files) => {
    if (err) {
      console.error('Upload error', err);
      return res.status(500).json({ error: 'Failed to upload' });
    }

    const file = files.video as File;
    if (!file) {
      return res.status(400).json({ error: 'Video file required' });
    }

    const newPath = path.join(uploadsDir, file.newFilename);
    fs.renameSync(file.filepath, newPath);

    // Placeholder: store questionId and interviewId if needed
    res.status(200).json({ success: true });
  });
}
