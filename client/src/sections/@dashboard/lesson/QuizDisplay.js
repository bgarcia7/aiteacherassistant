import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { Typography } from '@mui/material';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
QuizDisplay.propTypes = {
  quizContent: PropTypes.arrayOf(
    PropTypes.shape({
      question: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired,
    })
  ),
};

export default function QuizDisplay(props) {
  useEffect(() => {
    console.log('QUIZ GOT', props, props.quizContent);
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {props.quizContent.map((question) => {
        return (
          <div>
            <Typography variant="h4">{question.question}</Typography>
            {question.options.map((option, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
                <RadioButtonUncheckedIcon fontSize="small" />{' '}
                <span style={{ marginLeft: '2px' }}>{option}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}
