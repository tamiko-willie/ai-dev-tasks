import { useState } from 'react';
import {
  TextField,
  Button,
  Container,
  Typography,
  Box,
  Alert
} from '@mui/material';
import Head from 'next/head';
import { useRouter } from 'next/router';

export default function EmployerRegister() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    company: '',
    email: '',
    password: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, role: 'employer' })
      });
      if (!res.ok) {
        throw new Error('Registration failed');
      }
      router.push('/employer/dashboard');
    } catch (err) {
      setError('Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Employer Registration</title>
      </Head>
      <Container component="main" maxWidth="sm">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Employer Registration
          </Typography>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              label="First Name"
              name="firstName"
              required
              fullWidth
              margin="normal"
              value={form.firstName}
              onChange={handleChange}
            />
            <TextField
              label="Last Name"
              name="lastName"
              required
              fullWidth
              margin="normal"
              value={form.lastName}
              onChange={handleChange}
            />
            <TextField
              label="Company"
              name="company"
              required
              fullWidth
              margin="normal"
              value={form.company}
              onChange={handleChange}
            />
            <TextField
              label="Email"
              name="email"
              type="email"
              required
              fullWidth
              margin="normal"
              value={form.email}
              onChange={handleChange}
            />
            <TextField
              label="Password"
              name="password"
              type="password"
              required
              fullWidth
              margin="normal"
              value={form.password}
              onChange={handleChange}
            />
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isLoading}
              sx={{ mt: 2 }}
            >
              {isLoading ? 'Submitting...' : 'Register'}
            </Button>
          </Box>
        </Box>
      </Container>
    </>
  );
}
