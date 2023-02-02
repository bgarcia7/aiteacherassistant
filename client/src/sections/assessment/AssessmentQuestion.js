import { Box, Paper } from '@mui/material';
// Questions
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';

const AssessmentQuestion = ({ activeStep }) => {
  const Questions = () => {
    switch (activeStep) {
      case 0:
        return <Question1 />;
      case 1:
        return <Question2 />;
      case 2:
        return <Question3 />;
      default:
        return <Question1 />;
    }
  };

  return (
    <>
      <Paper
        sx={{
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Box>
          <Questions activeStep={activeStep} />
        </Box>
      </Paper>
    </>
  );
};

export default AssessmentQuestion;
