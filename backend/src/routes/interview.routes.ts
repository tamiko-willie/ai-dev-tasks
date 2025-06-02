import { Router } from 'express';
import { Request, Response } from 'express';
import Interview from '../models/Interview';
import { authenticateToken } from '../middleware/auth';
import { uploadVideo } from '../services/videoUpload';
import { sendInterviewInvitation } from '../services/email';

const router = Router();

// Create new interview
router.post('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const interview = new Interview({
      ...req.body,
      creator: req.user.id,
    });
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error('Create interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get all interviews for a user
router.get('/', authenticateToken, async (req: Request, res: Response) => {
  try {
    const interviews = await Interview.find({
      $or: [
        { creator: req.user.id },
        { teamMembers: req.user.id },
      ],
    }).populate('creator', 'firstName lastName email');
    res.json(interviews);
  } catch (error) {
    console.error('Get interviews error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single interview
router.get('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id)
      .populate('creator', 'firstName lastName email')
      .populate('teamMembers', 'firstName lastName email');
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Get interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update interview
router.put('/:id', authenticateToken, async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findOneAndUpdate(
      { _id: req.params.id, creator: req.user.id },
      req.body,
      { new: true }
    );
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }
    
    res.json(interview);
  } catch (error) {
    console.error('Update interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload position overview video
router.post('/:id/overview-video', authenticateToken, uploadVideo, async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    interview.positionOverviewVideo = req.file.path;
    await interview.save();
    
    res.json({ videoUrl: interview.positionOverviewVideo });
  } catch (error) {
    console.error('Upload overview video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Upload question video
router.post('/:id/questions/:questionIndex/video', authenticateToken, uploadVideo, async (req: Request, res: Response) => {
  try {
    const interview = await Interview.findById(req.params.id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const questionIndex = parseInt(req.params.questionIndex);
    if (!interview.questions[questionIndex]) {
      return res.status(404).json({ message: 'Question not found' });
    }

    interview.questions[questionIndex].videoUrl = req.file.path;
    await interview.save();
    
    res.json({ videoUrl: interview.questions[questionIndex].videoUrl });
  } catch (error) {
    console.error('Upload question video error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Invite candidates
router.post('/:id/invite', authenticateToken, async (req: Request, res: Response) => {
  try {
    const { candidates } = req.body;
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    for (const candidate of candidates) {
      interview.candidates.push({
        email: candidate.email,
        status: 'invited',
        invitationSentAt: new Date(),
      });

      await sendInterviewInvitation(candidate.email, interview);
    }

    await interview.save();
    res.json({ message: 'Invitations sent successfully' });
  } catch (error) {
    console.error('Invite candidates error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 