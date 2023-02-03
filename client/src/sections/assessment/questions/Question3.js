import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { SeoIllustration } from 'src/assets/illustrations';
import LoginAuth0 from 'src/sections/auth/LoginAuth0';

const Question3 = () => {
  return (
    <Box>
      {/* <LoginAuth0 /> */}
      <Typography variant="h6" gutterBottom component="div" textAlign={'center'}>
        Awesome, we&apos;re almost done!
      </Typography>
      <Box display={'flex'} justifyContent={'center'} alignItems={'center'} py={5}>
        <SeoIllustration
          sx={{
            p: 3,
            width: 360,
            margin: { xs: 'auto', md: 'inherit' },
          }}
        />
      </Box>
      <Typography variant="h6" gutterBottom component="div" textAlign={'center'}>
        We&apos;re putting everything together for you. 
      </Typography>
    </Box>
  );
};

export default Question3;
