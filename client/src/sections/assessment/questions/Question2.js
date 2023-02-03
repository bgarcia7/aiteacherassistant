import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { Divider, TextField } from '@mui/material';

import AlgoliaSearch from './components/AlgoliaSearch';

const Question2 = ({ handleSelections }) => {
  const [title, setTitle] = useState('');
  const [learningObjective, setLearningObjective] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === 'title') {
      setTitle(value);
    } else if (name === 'learning_objective') {
      setLearningObjective(value);
    }

    handleSelections({ title, learning_objective: learningObjective });
  };

  return (
    <Box
      display={'flex'}
      flexDirection="column"
      minWidth={{ xs: 300, sm: 400, md: 600, lg: 700, xl: 800 }}
      margin={'0 auto'}
    >
      <Typography variant="h4" gutterBottom component="div" textAlign={'center'}>
        What lesson would you like to plan?
      </Typography>
      <Box my={5}>
        <Stack spacing={3} sx={{ px: 3 }}>
          <TextField
            name="title"
            label="Lesson Title"
            fullWidth
            value={title}
            onChange={handleChange}
          />
          <TextField
            name="learning_objective"
            label="Learning objective"
            fullWidth
            multiline
            onChange={handleChange}
            value={learningObjective}
            rows={4}
          />
          <Divider>
            <Typography variant="h6" color={'#919EAB'}>
              OR
            </Typography>
          </Divider>
        </Stack>
        <Box py={3} px={3}>
          <AlgoliaSearch />
        </Box>
      </Box>
    </Box>
  );
};

export default Question2;
