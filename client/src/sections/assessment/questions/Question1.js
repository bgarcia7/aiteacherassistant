import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';

const Question1 = ({ handleSelections }) => {
  const OPTIONS = [
    { value: 'Entire Curriculum', label: '1' },
    { value: 'Single Lesson', label: '2' },
  ];

  const [selectedAnswer, setSelectedAnswer] = useState({ generation_type: '' });

  const handleChange = (event) => {
    setSelectedAnswer({ generation_type: event.target.value });
    handleSelections({ generation_type: event.target.value });
  };
  return (
    <Box>
      <Typography variant="h6" gutterBottom component="div" textAlign={'center'}>
        Would you like to schedule the entire curriculum or a single lesson?
      </Typography>

      <Box display={'flex'}>
        {OPTIONS.map((option) => (
          <Box
            display={'flex'}
            flexDirection={'column'}
            alignItems={'center'}
            maxWidth={1}
            margin={'0 auto'}
            key={option.label}
            sx={{
              borderRadius: 1,
              p: 2,
              my: 2,
            }}
          >
            <Button
              variant={selectedAnswer.generation_type === option.value ? 'contained' : 'outlined'}
              color="primary"
              size="large"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                minHeight: 240,
                minWidth: 240,
                display: 'flex',
                flexDirection: 'column',
                pt: 2,
              }}
              value={option.value}
              onClick={handleChange}
            >
              {option.value}
              {option.label === '1' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 2,
                  }}
                >
                  <CalendarTodayIcon sx={{ fontSize: 80 }} />
                </Box>
              )}
              {option.label === '2' && (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mt: 2,
                  }}
                >
                  <DescriptionIcon sx={{ fontSize: 80 }} />
                </Box>
              )}
            </Button>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Question1;
