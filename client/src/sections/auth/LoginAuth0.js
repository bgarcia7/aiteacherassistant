// @mui
import { Alert, Tooltip, Stack, Typography, Box, Button } from '@mui/material';
import { Container } from '@mui/system';
// auth
import { useAuthContext } from '../../auth/useAuthContext';

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
    <Container
      maxWidth="sm"
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          mb: 5,
        }}
      ></Box>
      <Box
        sx={{
          my: 10,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          p: 5,
          height: '100%',
          boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.1)',
          borderRadius: 1,
        }}
      >
        <Stack
          spacing={2}
          sx={{
            mb: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          <Typography variant="h4">Your lesson is ready! </Typography>
          <Typography variant="subtitle2" sx={{ color: 'text.secondary' }}>
            Login or Create an account to view your lesson plan
          </Typography>
        </Stack>

        <Button size="large" variant="contained" onClick={handleLoginAuth0}>
          View my lesson
        </Button>
      </Box>
    </Container>
  );
}
