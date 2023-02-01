import PropTypes from 'prop-types';
import { useState, useRef, useEffect } from 'react';
import * as Yup from 'yup';
import merge from 'lodash/merge';
import { isBefore } from 'date-fns';
// form
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
// @mui
import { Box, Stack, Button, Tooltip, TextField, IconButton, DialogActions } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { MobileDateTimePicker } from '@mui/x-date-pickers';
// components
import Iconify from '../../../components/iconify';
import { ColorSinglePicker } from '../../../components/color-utils';
import FormProvider, { RHFTextField, RHFSwitch } from '../../../components/hook-form';
import { ModuleCard } from '../components';

// ----------------------------------------------------------------------

const getInitialValues = (event, range) => {
  const initialEvent = {
    title: '',
    description: '',
    textColor: '#1890FF',
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

CalendarForm.propTypes = {
  event: PropTypes.object,
  range: PropTypes.object,
  onCancel: PropTypes.func,
  onDeleteEvent: PropTypes.func,
  onCreateUpdateEvent: PropTypes.func,
  colorOptions: PropTypes.arrayOf(PropTypes.string),
};

export default function CalendarForm({
  event,
  range,
  colorOptions,
  onCreateUpdateEvent,
  onDeleteEvent,
  onCancel,
  modules,
}) {
  const hasEventData = !!event;

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    learning_objective: Yup.string().max(5000).required('Learning objective is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: getInitialValues(event, range),
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  useEffect(() => {
    reset(getInitialValues(event, range));
  }, [event, range, reset, modules]);

  const values = watch();

  const onSubmit = async (data) => {
    try {
      const newEvent = {
        title: data.title,
        learning_objective: data.learning_objective,
        textColor: data.textColor,
        allDay: data.allDay,
        start: data.start,
        end: data.end,
      };
      onCreateUpdateEvent(newEvent);
      // onCancel();
      // reset();
    } catch (error) {
      console.error(error);
    }
  };

  const isDateError =
    !values.allDay && values.start && values.end
      ? isBefore(new Date(values.end), new Date(values.start))
      : false;

  // drag and drop

  const [components, setComponents] = useState([]);
  console.log(modules);
  useEffect(() => {
    const draggableComponents =
      modules.length > 0 &&
      modules[0].map((module, index) => ({
        id: module.id,
        content: <ModuleCard key={index} module={module} />,
      }));
    setComponents(draggableComponents);
    console.log('components:', components);
  }, [modules]);

  // create a draggable component for each module in generatedModules

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const items = Array.from(components);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setComponents(items);
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

        <Controller
          name="textColor"
          control={control}
          render={({ field }) => (
            <ColorSinglePicker
              value={field.value}
              onChange={field.onChange}
              colors={colorOptions}
            />
          )}
        />
      </Stack>

      <DialogActions>
        {hasEventData && (
          <Tooltip title="Delete Event">
            <IconButton onClick={onDeleteEvent}>
              <Iconify icon="eva:trash-2-outline" />
            </IconButton>
          </Tooltip>
        )}

        <Box sx={{ flexGrow: 1 }} />

        <Button variant="outlined" color="inherit" onClick={onCancel}>
          Cancel
        </Button>

        <LoadingButton type="submit" variant="contained" loading={isSubmitting}>
          {hasEventData ? 'Save' : 'Generate'}
        </LoadingButton>
      </DialogActions>
    </FormProvider>
  );
}
