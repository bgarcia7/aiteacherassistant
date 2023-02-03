import { Box, Paper } from '@mui/material';
// Questions
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';

const Questions = ({ activeStep, handleSelections }) => {
  switch (activeStep) {
    case 0:
      return <Question1 handleSelections={handleSelections} />;
    case 1:
      return <Question2 handleSelections={handleSelections} />;
    case 2:
      return <Question3 handleSelections={handleSelections} />;
    default:
      <Question1 />;
  }
};

const AssessmentQuestion = ({ activeStep, handleSelections }) => {
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
          <Questions activeStep={activeStep} handleSelections={handleSelections} />
        </Box>
      </Paper>
    </>
  );
};

export default AssessmentQuestion;
