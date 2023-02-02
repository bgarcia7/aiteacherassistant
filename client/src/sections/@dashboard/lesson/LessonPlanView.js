import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
// form
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
// @mui
import { Box, Stack } from '@mui/material';
// components
import PropTypes from 'prop-types';
import { getLessonPlan } from 'src/pages/api/Lesson';
import { useSnackbar } from '../../../components/snackbar';
import { useDispatch } from '../../../redux/store';
import { ModuleCard } from '../components';

LessonPlanView.propTypes = {
  id: PropTypes.string,
};

export default function LessonPlanView(props) {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [lessonPlan, setLessonPlan] = useState(null);
  const [modules, setModules] = useState([]);

  useEffect(() => {
    (async () => {
      const newLessonPlan = await getLessonPlan(props.id);
      console.log('Got lesson plan: ', newLessonPlan);
      setLessonPlan(newLessonPlan);
      setModules(newLessonPlan.modules);
      setLoading(false);
    })();
  }, []);

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(modules);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setModules(items);
  };

  const updateModule = (module) => {
    console.log('updateModule was called in LessonPlanView.js');
    const ix = modules.map((m) => m.id).indexOf(module.id);
    const newModules = [...modules.slice(0, ix), module, ...modules.slice(ix + 1)];
    const newEvent = {
      title: lessonPlan.title,
      learning_objective: lessonPlan.learning_objective,
      textColor: lessonPlan.textColor,
      allDay: lessonPlan.allDay,
      start: '2023-02-21T07:30:33.067Z',
      end: '2023-02-21T09:00:33.067Z',
      modules: newModules,
      id: lessonPlan.id,
    };
    // onCreateUpdateEvent(newEvent);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
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
                        <ModuleCard updateModule={updateModule} key={index} module={module} />
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
  );
}
