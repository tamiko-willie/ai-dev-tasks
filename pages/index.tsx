import { useState } from 'react';
import { 
  Container, 
  Typography, 
  Button, 
  Box, 
  Grid,
  Card,
  CardContent,
  CardActions,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { useRouter } from 'next/router';
import Head from 'next/head';

export default function Home() {
  const theme = useTheme();
  const router = useRouter();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [isLoading, setIsLoading] = useState(false);

  const handleEmployerSignup = () => {
    setIsLoading(true);
    router.push('/employer/register');
  };

  return (
    <>
      <Head>
        <title>Virtual Interview Platform - AI-Powered Interviews</title>
        <meta name="description" content="Conduct asynchronous video interviews with AI-powered insights. Perfect for remote hiring and candidate assessment." />
      </Head>

      <Box 
        component="main" 
        id="main-content"
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          pt: { xs: 4, md: 8 }
        }}
      >
        <Container maxWidth="lg">
          {/* Hero Section */}
          <Grid container spacing={4} alignItems="center" sx={{ mb: 8 }}>
            <Grid item xs={12} md={6}>
              <Typography 
                variant="h1" 
                component="h1"
                sx={{ 
                  fontSize: { xs: '2rem', md: '3rem' },
                  mb: 2
                }}
              >
                Transform Your Hiring Process with AI-Powered Interviews
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ mb: 4 }}
                color="text.secondary"
              >
                Conduct efficient, asynchronous video interviews and receive AI-generated insights to make better hiring decisions.
              </Typography>
              <Button
                variant="contained"
                size="large"
                onClick={handleEmployerSignup}
                disabled={isLoading}
                aria-label="Sign up as an employer"
                sx={{ mr: 2 }}
              >
                Get Started
              </Button>
              <Button
                variant="outlined"
                size="large"
                href="#features"
                aria-label="Learn more about our features"
              >
                Learn More
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              {/* Add hero image here */}
            </Grid>
          </Grid>

          {/* Features Section */}
          <Box id="features" component="section" sx={{ mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2"
              align="center"
              sx={{ mb: 4 }}
            >
              Key Features
            </Typography>
            <Grid container spacing={4}>
              {[
                {
                  title: 'AI-Powered Analysis',
                  description: 'Get detailed insights on candidate responses, body language, and communication skills.'
                },
                {
                  title: 'Flexible Scheduling',
                  description: 'Candidates can complete interviews at their convenience within your specified timeframe.'
                },
                {
                  title: 'Team Collaboration',
                  description: 'Share interviews with team members and collect structured feedback.'
                }
              ].map((feature, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card 
                    sx={{ height: '100%' }}
                    role="article"
                    aria-labelledby={`feature-title-${index}`}
                  >
                    <CardContent>
                      <Typography 
                        variant="h5" 
                        component="h3"
                        id={`feature-title-${index}`}
                        gutterBottom
                      >
                        {feature.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {feature.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        onClick={() => router.push('/employer/register')}
                      >
                        Learn More
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
} 