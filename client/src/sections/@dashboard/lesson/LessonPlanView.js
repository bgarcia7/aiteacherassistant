import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// form
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// @mui
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Container,
  Stack,
  Typography,
} from '@mui/material';
// components
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import PropTypes from 'prop-types';
import { useAuthContext } from 'src/auth/useAuthContext';
import LoadingIcon from 'src/components/loading-screen/LoadingIcon';
import { useSettingsContext } from 'src/components/settings';
import {
  checkAudio,
  generateAudio,
  generateQuiz,
  generateSlides,
  getLessonPlan,
} from 'src/pages/api/Lesson';
import { useSnackbar } from '../../../components/snackbar';
import { useDispatch } from '../../../redux/store';
import { ModuleCard } from '../components';
import ReactGoogleSlides from './GoogleSlides';
import QuizDisplay from './QuizDisplay';

LessonPlanView.propTypes = {
  id: PropTypes.string,
};

export default function LessonPlanView(props) {
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuthContext();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [modules, setModules] = useState([]);
  const [isGeneratingSlides, setIsGeneratingSlides] = useState(false);
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [isGeneratingAudio, setIsGeneratingAudio] = useState(null);
  const { themeStretch } = useSettingsContext();
  const [audioFileLink, setAudioFileLink] = useState(null);

  const refreshLessonPlan = async () => {
    const newLessonPlan = await getLessonPlan(props.id);
    console.log('Got lesson plan: ', newLessonPlan);
    setLessonPlan(newLessonPlan);
    setModules(newLessonPlan.modules);
    setLoading(false);
  };

  useEffect(() => {
    console.log('USERS', user);
  }, []);

  useEffect(() => {
    refreshLessonPlan();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModules(items);
  };

  const handleGenerateQuiz = async () => {
    try {
      enqueueSnackbar('Generating your quiz, it takes around a minute');

      console.log('Start generating quiz');
      setIsGeneratingQuiz(true);
      const newQuiz = await generateQuiz(lessonPlan.id);
      console.log('Generated Quiz', newQuiz);
      await refreshLessonPlan();
    } catch (err) {
      enqueueSnackbar('Error Generating Quiz', { variant: 'error' });
    }

    setIsGeneratingQuiz(false);
  };

  const handleGenerateSlides = async () => {
    try {
      enqueueSnackbar('Generating your slides, it takes around a minute');
      console.log('Generating slides');
      setIsGeneratingSlides(true);
      const newSlides = await generateSlides(lessonPlan.id);
      console.log('Generated Slides', newSlides);
      await refreshLessonPlan();
    } catch (err) {
      enqueueSnackbar('Error Generating Slides', { variant: 'error' });
    }

    setIsGeneratingSlides(false);

    try {
      // enqueueSnackbar('Generating your audio, it takes around a minute');
      const audioTask = await generateAudio(lessonPlan.id);
      console.log('Generated audioTask', audioTask);
      setIsGeneratingAudio(audioTask.audio_task_id);
    } catch (err) {
      console.log('ERRR', err);
      enqueueSnackbar('Error Generating Audio', { variant: 'error' });
    }
  };

  useEffect(() => {
    if (isGeneratingAudio) {
      const interval = setInterval(async () => {
        const audio = await checkAudio(isGeneratingAudio);
        console.log('Checking audio', audio, audio.outputs.audio);
        if (audio.status === 'COMPLETE') {
          setIsGeneratingAudio(false);
          console.log('Successfully generated audio');
          clearInterval(interval);
          await refreshLessonPlan();
          setAudioFileLink(audio.outputs.audio);
        }
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isGeneratingAudio]);

  const handleDownloadQuiz = async () => {
    if (!lessonPlan.quiz) {
      enqueueSnackbar('Please generate the quiz first', { variant: 'error' });
      return;
    }

    if (typeof window !== 'undefined') {
      window.open(lessonPlan.quiz.pdf_url, '_blank');
    } else {
      enqueueSnackbar('Failed to open link', { variant: 'error' });
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
        <LoadingIcon />
      </div>
    );
  }

  return (
    <Container maxWidth={themeStretch ? false : 'xl'}>
      {/* LessonPlan */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h3">Lesson Plan</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={3} sx={{ px: 3 }}>
            <DragDropContext onDragEnd={onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided) => (
                  <Box ref={provided.innerRef} {...provided.droppableProps}>
                    {modules.length > 0 &&
                      modules.map((module, index) => (
                        <Draggable key={module.id} draggableId={module.id} index={index}>
                          {(provided) => (
                            <Box
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              sx={{
                                marginBottom: 3,
                              }}
                            >
                              <ModuleCard
                                refreshLessonPlan={refreshLessonPlan}
                                key={index}
                                module={module}
                              />
                            </Box>
                          )}
                        </Draggable>
                      ))}
                    {provided.placeholder}
                  </Box>
                )}
              </Droppable>
            </DragDropContext>
          </Stack>
        </AccordionDetails>
      </Accordion>

      {/* Slides */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h3">Slides</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isGeneratingSlides ? (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <LoadingIcon />
            </div>
          ) : lessonPlan.slide_deck ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Button
                  variant="contained"
                  onClick={() => window.open(lessonPlan.slide_deck.drive_url, '_blank')}
                  disabled={isGeneratingSlides}
                >
                  Open in Google Slides
                </Button>

                <Button
                  variant="contained"
                  onClick={handleGenerateSlides}
                  disabled={isGeneratingSlides}
                >
                  Regenerate Slides
                </Button>
              </div>
              <div style={{ height: '16px' }} />
              <ReactGoogleSlides
                width="100%"
                height="640px"
                slidesLink={lessonPlan.slide_deck.drive_url}
                position={0}
                showControls
              />
              {audioFileLink && (
                <Button variant="contained" onClick={() => window.open(audioFileLink, '_blank')}>
                  Open Audio File
                </Button>
              )}
            </div>
          ) : (
            <Button
              variant="contained"
              onClick={handleGenerateSlides}
              disabled={isGeneratingSlides}
            >
              Generate Slides
            </Button>
          )}
        </AccordionDetails>
      </Accordion>

      {/* Quiz */}
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h3">Quiz</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {isGeneratingQuiz ? (
            <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
              <LoadingIcon />
            </div>
          ) : lessonPlan.quiz ? (
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div
                style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}
              >
                <Button
                  variant="contained"
                  onClick={handleDownloadQuiz}
                  disabled={isGeneratingQuiz}
                >
                  Download PDF
                </Button>
                <Button
                  variant="contained"
                  onClick={handleGenerateQuiz}
                  disabled={isGeneratingQuiz}
                >
                  Regenerate Quiz
                </Button>
              </div>
              <div style={{ height: '16px' }} />
              <QuizDisplay quizContent={lessonPlan.quiz.content} />
            </div>
          ) : (
            <>
              <Button variant="contained" onClick={handleGenerateQuiz} disabled={isGeneratingQuiz}>
                Generate Quiz
              </Button>
            </>
          )}
        </AccordionDetails>
      </Accordion>
    </Container>
  );
}
