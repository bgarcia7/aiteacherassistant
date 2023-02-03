import { Box, Paper } from '@mui/material';
// Questions
import Question1 from './questions/Question1';
import Question2 from './questions/Question2';
import Question3 from './questions/Question3';

const Questions = ({ activeStep, handleSelections, handleNext, handleBack }) => {
  switch (activeStep) {
    case 0:
      return (
        <Question1
          activeStep={activeStep}
          handleSelections={handleSelections}
          handleNext={handleNext}
        />
      );
    case 1:
      return (
        <Question2
          activeStep={activeStep}
          handleSelections={handleSelections}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    case 2:
      return (
        <Question3
          activeStep={activeStep}
          handleSelections={handleSelections}
          handleNext={handleNext}
          handleBack={handleBack}
        />
      );
    default:
      <Question1 />;
  }
};

const AssessmentQuestion = ({ activeStep, handleSelections, handleNext, handleBack }) => {
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
          <Questions
            activeStep={activeStep}
            handleSelections={handleSelections}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        </Box>
      </Paper>
    </>
  );
};

export default AssessmentQuestion;
