import { isBefore } from 'date-fns';
import merge from 'lodash/merge';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
// form
import { yupResolver } from '@hookform/resolvers/yup';
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd';
import { Controller, useForm } from 'react-hook-form';
// @mui
import { LoadingButton } from '@mui/lab';
import { Box, DialogActions, Stack, TextField } from '@mui/material';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components
import { createLessonPlan } from 'src/pages/api/Lesson';
import FormProvider, { RHFTextField } from '../../../components/hook-form';
import { useSnackbar } from '../../../components/snackbar';
import { useDispatch } from '../../../redux/store';
import { ModuleCard } from '../components';

// ----------------------------------------------------------------------

const getInitialValues = (event, range = null) => {
  const initialEvent = {
    title: '',
    description: '',
    allDay: false,
    start: range ? new Date(range.start).toISOString() : new Date().toISOString(),
    end: range ? new Date(range.end).toISOString() : new Date().toISOString(),
  };

  if (event || range) {
    return merge({}, initialEvent, event);
  }

  return initialEvent;
};

// ----------------------------------------------------------------------

LessonForm.propTypes = {};

export default function LessonForm() {
  const { enqueueSnackbar } = useSnackbar();
  const dispatch = useDispatch();

  const hasEventData = !!event;

  console.log('calendar:', event?.id);

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const LessonSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    learning_objective: Yup.string().max(5000).required('Learning objective is required'),
  });

  const methods = useForm({
    resolver: yupResolver(LessonSchema),
    defaultValues: getInitialValues({}),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  const values = watch();

  const onSubmit = async (data) => {
    try {
      console.log('On submit calendar form');
      const newLessonPlan = {
        title: data.title,
        learning_objective: data.learning_objective,
        textColor: data.textColor,
        allDay: data.allDay,
        start: '2023-02-21T07:30:33.067Z',
        end: '2023-02-21T09:00:33.067Z',
        modules: data.modules,
        id: data.id,
      };

      setLoading(true);
      const savedLesson = await createLessonPlan(newLessonPlan);
      setLoading(false);
      enqueueSnackbar('Create success!');
      console.log('CREATED', savedLesson);

      console.log('Going to', `/dashboard/lesson/${savedLesson.id}`);
      router.push(`/dashboard/lesson/${savedLesson.id}`);
      // onCancel();
      // reset();
    } catch (error) {
      console.error(error);
      enqueueSnackbar('Create error...');
    }
  };

  const isDateError =
    !values.allDay && values.start && values.end
      ? isBefore(new Date(values.end), new Date(values.start))
      : false;

  // drag and drop

  const [components, setComponents] = useState([]);
  useEffect(() => {
    const draggableComponents =
      event?.modules?.length > 0 &&
      event.modules.map((module, index) => ({
        id: module.id,
        content: <ModuleCard updateModule={updateModule} key={index} module={module} />,
      }));
    setComponents(draggableComponents);
    console.log('components:', components);
  }, [event?.modules]);

  // create a draggable component for each module in generatedModules

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
  };

  const updateModule = (module) => {
    console.log('updateModule was called in LessonForm.js');
    const ix = event.modules.map((m) => m.id).indexOf(module.id);
    const modules = [...event.modules.slice(0, ix), module, ...event.modules.slice(ix + 1)];
    const newEvent = {
      title: event.title,
      learning_objective: event.learning_objective,
      textColor: event.textColor,
      allDay: event.allDay,
      start: '2023-02-21T07:30:33.067Z',
      end: '2023-02-21T09:00:33.067Z',
      modules: modules,
      id: event.id,
    };
    onCreateUpdateEvent(newEvent);
  };

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3} sx={{ px: 3 }}>
        <RHFTextField name="title" label="Title" fullWidth />
        <RHFTextField
          name="learning_objective"
          label="Learning objective"
          fullWidth
          multiline
          rows={4}
        />
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <Box ref={provided.innerRef} {...provided.droppableProps}>
                {components.length > 0 &&
                  components.map((component, index) => (
                    <Draggable key={component.id} draggableId={component.id} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{
                            marginBottom: 3,
                          }}
                        >
                          {component.content}
                        </Box>
                      )}
                    </Draggable>
                  ))}
                {provided.placeholder}
              </Box>
            )}
          </Droppable>
        </DragDropContext>

        <Controller
          name="start"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              label="Start date"
              inputFormat="MM/dd/yyyy hh:mm a"
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          )}
        />

        <Controller
          name="end"
          control={control}
          render={({ field }) => (
            <MobileDateTimePicker
              {...field}
              onChange={(newValue) => field.onChange(newValue)}
              label="End date"
              inputFormat="MM/dd/yyyy hh:mm a"
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  error={!!isDateError}
                  helperText={isDateError && 'End date must be later than start date'}
                />
              )}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {/* {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )} */}

        <Box sx={{ flexGrow: 1 }} />

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Save' : 'Generate'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
