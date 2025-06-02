import nodemailer from 'nodemailer';
import { IInterview } from '../models/Interview';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendInterviewInvitation = async (candidateEmail: string, interview: IInterview) => {
  try {
    const interviewLink = `${process.env.FRONTEND_URL}/interviews/${interview._id}/candidate`;
    
    const mailOptions = {
      from: process.env.SMTP_FROM || 'no-reply@ai-interview.com',
      to: candidateEmail,
      subject: `Interview Invitation: ${interview.position} at ${interview.creator.company}`,
      html: `
        <h2>Interview Invitation</h2>
        <p>Dear Candidate,</p>
        <p>You have been invited to participate in an interview for the position of <strong>${interview.position}</strong>.</p>
        
        <h3>Interview Details:</h3>
        <ul>
          <li><strong>Position:</strong> ${interview.position}</li>
          <li><strong>Company:</strong> ${interview.creator.company}</li>
          <li><strong>Time Limit:</strong> ${interview.settings.timeLimit} minutes</li>
        </ul>

        <h3>Important Instructions:</h3>
        <ul>
          <li>Ensure you have a stable internet connection</li>
          <li>Use a quiet room with good lighting</li>
          <li>Test your camera and microphone before starting</li>
          <li>Have your ID ready for verification</li>
        </ul>

        <p>Please click the link below to start your interview:</p>
        <a href="${interviewLink}" style="
          display: inline-block;
          padding: 12px 24px;
          background-color: #007bff;
          color: white;
          text-decoration: none;
          border-radius: 4px;
          margin: 16px 0;
        ">Start Interview</a>

        <p>This link will remain active for the next 7 days. Please complete the interview at your earliest convenience.</p>

        <p><strong>Note:</strong> This is an AI-powered interview platform. Your responses will be recorded and analyzed automatically.</p>

        <p>Best of luck!</p>
        
        <hr>
        <p style="font-size: 12px; color: #666;">
          This is an automated message. Please do not reply to this email.
          If you have any questions, please contact the hiring team directly.
        </p>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Error sending interview invitation:', error);
    throw new Error('Failed to send interview invitation');
  }
}; 