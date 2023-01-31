// @mui
import { Alert, Tooltip, Stack, Typography, Box, Button } from '@mui/material';
// auth
import { useAuthContext } from '../../auth/useAuthContext';
// layouts
import LoginLayout from '../../layouts/login';

// ----------------------------------------------------------------------

export default function LoginAuth0() {
  const { method } = useAuthContext();

  const { login } = useAuthContext();

  const handleLoginAuth0 = async () => {
    try {
      await login();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <LoginLayout>
      <Stack spacing={2} sx={{ mb: 5, position: 'relative' }}>
        <Typography variant="h4">Sign in to Teachers Plan</Typography>
      </Stack>

      <Button
        fullWidth
        size="large"
        variant="contained"
        onClick={handleLoginAuth0}
      >
        Login
      </Button>
    </LoginLayout>
  );
}
