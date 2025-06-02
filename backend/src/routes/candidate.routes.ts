import { Router } from 'express';
import { Request, Response } from 'express';
import Interview from '../models/Interview';
import Response from '../models/Response';
import { uploadVideo } from '../services/videoUpload';
import { analyzeResponse } from '../services/ai';
import { detectCheating } from '../services/monitoring';

const router = Router();

// Start interview session
router.post('/interviews/:id/start', async (req: Request, res: Response) => {
  try {
    const { email, name } = req.body;
    const interview = await Interview.findById(req.params.id);
    
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    const candidateIndex = interview.candidates.findIndex(c => c.email === email);
    if (candidateIndex === -1) {
      return res.status(403).json({ message: 'Not invited to this interview' });
    }

    const response = new Response({
      interview: interview._id,
      candidate: { email, name },
      startedAt: new Date(),
    });

    await response.save();
    
    interview.candidates[candidateIndex].status = 'started';
    await interview.save();

    res.json({
      sessionId: response._id,
      questions: interview.questions,
      settings: interview.settings,
    });
  } catch (error) {
    console.error('Start interview error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Submit question response
router.post('/sessions/:sessionId/questions/:questionIndex', uploadVideo, async (req: Request, res: Response) => {
  try {
    const response = await Response.findById(req.params.sessionId);
    if (!response) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const questionIndex = parseInt(req.params.questionIndex);
    const videoUrl = req.file.path;
    const duration = parseInt(req.body.duration);

    // Analyze response using AI
    const aiAnalysis = await analyzeResponse(videoUrl);
    
    // Check for suspicious behavior
    const behaviorFlags = await detectCheating(req.body.monitoringData);

    response.responses.push({
      questionIndex,
      videoUrl,
      duration,
      aiAnalysis: {
        ...aiAnalysis,
        behavioralFlags: behaviorFlags,
      },
    });

    await response.save();
    
    res.json({
      success: true,
      analysis: aiAnalysis,
      behaviorFlags,
    });
  } catch (error) {
    console.error('Submit response error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Complete interview session
router.post('/sessions/:sessionId/complete', async (req: Request, res: Response) => {
  try {
    const response = await Response.findById(req.params.sessionId);
    if (!response) {
      return res.status(404).json({ message: 'Session not found' });
    }

    const interview = await Interview.findById(response.interview);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Calculate overall score and AI ranking
    const totalScore = response.responses.reduce((sum, r) => {
      return sum + (
        r.aiAnalysis.confidence +
        r.aiAnalysis.clarity +
        r.aiAnalysis.engagement +
        r.aiAnalysis.authenticity +
        r.aiAnalysis.technicalAccuracy
      ) / 5;
    }, 0);

    response.overallScore = totalScore / response.responses.length;
    response.completed = true;
    response.completedAt = new Date();

    // Update candidate status in interview
    const candidateIndex = interview.candidates.findIndex(c => c.email === response.candidate.email);
    if (candidateIndex !== -1) {
      interview.candidates[candidateIndex].status = 'completed';
      interview.candidates[candidateIndex].completedAt = new Date();
    }

    await Promise.all([
      response.save(),
      interview.save(),
    ]);

    res.json({
      success: true,
      overallScore: response.overallScore,
    });
  } catch (error) {
    console.error('Complete session error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get interview results (for employers)
router.get('/interviews/:id/results', async (req: Request, res: Response) => {
  try {
    const responses = await Response.find({
      interview: req.params.id,
      completed: true,
    }).sort('-overallScore');

    // Assign rankings based on overall scores
    responses.forEach((response, index) => {
      response.aiRanking = index + 1;
    });

    await Promise.all(responses.map(r => r.save()));

    res.json(responses);
  } catch (error) {
    console.error('Get results error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router; 