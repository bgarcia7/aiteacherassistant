import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
// form
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Question2 = () => {
  const defaultValues = {
    title: '',
    lesson_description: '',
  };

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    learning_objective: Yup.string().max(5000).required('Learning objective is required'),
  });

  const methods = useForm({
    resolver: yupResolver(EventSchema),
    defaultValues: defaultValues,
  });

  const {
    reset,
    watch,
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

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
        <FormProvider methods={methods}>
          <Stack spacing={3} sx={{ px: 3 }}>
            <RHFTextField name="title" label="Lesson Title" />
            <RHFTextField
              name="learning_objective"
              label="Learning objective"
              fullWidth
              multiline
              rows={4}
            />
          </Stack>
        </FormProvider>
      </Box>
    </Box>
  );
};

export default Question2;
