import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

export default function OptionButton({ option }) {
  return (
    <Button minWidth={'600px'}>
      <Box>
        <Typography variant="h6" gutterBottom component="div">
          {option}
        </Typography>
        <CalendarTodayIcon />
      </Box>
    </Button>
  );
}
