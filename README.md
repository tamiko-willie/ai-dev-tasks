# Virtual Interview Platform

An AI-powered virtual interview platform that enables employers to conduct asynchronous video interviews and receive AI-generated insights.

## Project Status

🚧 **Under Construction** 🚧

We are currently rebuilding the project after some files were accidentally deleted. The following files need to be restored:

- [x] package.json
- [x] tsconfig.json
- [x] next.config.js
- [x] pages/_app.tsx
- [x] pages/index.tsx
- [x] pages/employer/register.tsx
- [x] pages/employer/dashboard.tsx
- [x] pages/candidate/interview/[id].tsx
- [x] pages/api/interviews/create.ts
- [x] pages/api/interviews/submit-recording.ts
- [x] styles/theme.ts
- [x] lib/createEmotionCache.ts
- [x] types/global.d.ts

## Features

### For Employers
- Create and manage interview sessions
- Invite team members to record questions
- Schedule interviews (deadline-based or specific date/time)
- Send automated email invitations to candidates
- Receive AI-powered analysis of candidate interviews

### For Candidates
- Test system compatibility and connection
- Participate in video interviews
- Receive AI-generated feedback
- Review interview performance

## Tech Stack

- Frontend: Next.js (React)
- Backend: Node.js/Express
- Database: MongoDB
- Video Processing: WebRTC
- Storage: AWS S3
- AI Analysis: OpenAI API
- Real-time Communication: Socket.io

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB (v4 or higher)
- Git

You'll also need accounts and API keys for:
- AWS (for S3 storage)
- OpenAI (for AI analysis)
- SMTP server (for email notifications)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/virtual-interview-platform.git
   cd virtual-interview-platform
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   MONGODB_URI=mongodb://localhost:27017/virtual-interview
   AWS_ACCESS_KEY=your_aws_access_key
   AWS_SECRET_KEY=your_aws_secret_key
   AWS_REGION=us-east-1
   AWS_BUCKET_NAME=virtual-interviews
   OPENAI_API_KEY=your_openai_api_key
   JWT_SECRET=your_jwt_secret_key
   SMTP_HOST=smtp.example.com
   SMTP_USER=your_smtp_username
   SMTP_PASS=your_smtp_password
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
/
├── components/       # React components
├── pages/           # Next.js pages and API routes
│   ├── api/         # Backend API endpoints
│   ├── employer/    # Employer-specific pages
│   └── candidate/   # Candidate-specific pages
├── public/          # Static assets
├── styles/          # CSS styles
├── lib/             # Utility functions
├── models/          # Database models
├── services/        # Business logic
└── config/          # Configuration files
```

## Accessibility

This platform is WCAG 2.2 AA compliant, featuring:
- Keyboard navigation
- Screen reader support
- High contrast mode
- Focus management
- ARIA attributes
- Semantic HTML

## Workflows

Detailed project workflows are documented in:

- `advanced-ba-workflow.md` – business analysis process
- `cursor-workflow.mdc` – end-to-end Cursor workflow covering prompt intake, design, QA, and CI integration

## License

This project is licensed under the MIT License - see the LICENSE file for details.
