import { useState } from 'react';
import { Box, Step, Paper, Button, Stepper, StepLabel, Typography } from '@mui/material';
import LoadingScreen from 'src/components/loading-screen/LoadingScreen';
import { useAuthContext } from 'src/auth/useAuthContext';
// Question pages
import AssessmentQuestion from './AssessmentQuestion';
// ----------------------------------------------------------------------

const steps = ['Generation Type', 'Select standards', 'Finshing up'];

export default function LinearStepper() {
  const [activeStep, setActiveStep] = useState(0);
  const [skipped, setSkipped] = useState(new Set());
  const [allAnswers, setAllAnswers] = useState([]);
  const [questionAnswers, setQuestionAnswers] = useState([]);

  // stoe answers in state for each individual question
  const handleSelections = (answers) => {
    setQuestionAnswers(answers);
  };

  // store all selections in state on next
  const handleAllAnswers = (answers) => {
    setAllAnswers([
      ...allAnswers,
      {
        question: activeStep,
        answer: answers,
      },
    ]);
    // reset questionAnswers
    setQuestionAnswers([]);
  };

  const isStepOptional = (step) => step === 1;

  const isStepSkipped = (step) => skipped.has(step);

  const handleNext = () => {
    let newSkipped = skipped;

    handleAllAnswers(questionAnswers);

    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    setSkipped(newSkipped);

    // REQUEST TO GENERATE LESSON FROM API WITH ANSWERS -> DIRECT USER TO LOGIN SCREEN WHILE GENERATING TAKES PLACE
    if (activeStep === steps.length - 1) {
      // convert allAnswers to object
      const answers = allAnswers.reduce((acc, curr) => {
        acc[curr.question] = curr.answer;
        return acc;
      }, {});
      console.log('generating lesson with this: ', answers);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  // const handleSkip = () => {
  //   if (!isStepOptional(activeStep)) {
  //     throw new Error("You can't skip a step that isn't optional.");
  //   }

  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  //   setSkipped((prevSkipped) => {
  //     const newSkipped = new Set(prevSkipped.values());
  //     newSkipped.add(activeStep);
  //     return newSkipped;
  //   });
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  return (
    <>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => {
          const stepProps = {};
          const labelProps = {};

          if (isStepSkipped(index)) {
            stepProps.completed = false;
          }
          return (
            <Step key={label} {...stepProps}>
              <StepLabel {...labelProps}>{label}</StepLabel>
            </Step>
          );
        })}
      </Stepper>

      {activeStep === steps.length ? (
        <LoadingScreen />
      ) : (
        <>
          <Paper
            sx={{
              p: 3,
              my: 3,
              minHeight: 120,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Box>
              <AssessmentQuestion activeStep={activeStep} handleSelections={handleSelections} />
            </Box>
          </Paper>
        </>
      )}
      <Box sx={{ display: 'flex' }}>
        {activeStep !== steps.length - 1 && (
          <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        <Box sx={{ flexGrow: 1 }} />
        <Button variant="contained" onClick={handleNext}>
          Next
        </Button>
      </Box>
    </>
  );
}
