/* eslint-disable react/no-unescaped-entities */
import React, { useState } from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';

const Question = ({ option, onNext }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const theme = useTheme();

  const handleSubmit = (event) => {
    event.preventDefault();
    onNext(selectedAnswer);
    setSelectedAnswer(null);
  };

  const handleChange = (event) => {
    setSelectedAnswer(event.target.value);
  };

  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      alignItems={'center'}
      maxWidth={1}
      margin={'0 auto'}
      textAlign={'center'}
    >
      <form onSubmit={handleSubmit}>
        <Box
          display={'flex'}
          flexDirection={'row'}
          alignItems={'center'}
          maxWidth={1}
          margin={'0 auto'}
        >
          <Grid container spacing={1} justifyContent="center" alignItems="center">
            {option.map((answer) => (
              <Grid item xs={6} sm={3} md={2} key={answer.id}>
                <Box
                  display={'flex'}
                  flexDirection={'column'}
                  alignItems={'center'}
                  maxWidth={1}
                  margin={'0 auto'}
                  sx={{
                    borderRadius: 1,
                    p: 2,
                    my: 2,
                  }}
                >
                  <Button
                    variant={selectedAnswer === answer ? 'contained' : 'outlined'}
                    color="primary"
                    size="large"
                    sx={{
                      fontWeight: 700,
                      borderRadius: 2,
                      textTransform: 'none',
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        boxShadow: theme.shadows[8],
                      },
                    }}
                    value={answer}
                    onClick={handleChange}
                  >
                    {answer}
                  </Button>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Box>
        <Box
          display={'flex'}
          flexDirection={'row'}
          justifyContent={'center'}
          alignItems={'center'}
          maxWidth={1}
          margin={'0 auto'}
        >
          {selectedAnswer && (
            <Button
              variant="contained"
              color="primary"
              size="large"
              sx={{
                fontWeight: 700,
                borderRadius: 2,
                textTransform: 'none',
                boxShadow: theme.shadows[4],
                '&:hover': {
                  boxShadow: theme.shadows[8],
                },
              }}
              type="submit"
            >
              Next
            </Button>
          )}
        </Box>
      </form>
    </Box>
  );
};

export default Question;
