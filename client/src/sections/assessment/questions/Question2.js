import * as React from 'react';
import { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Stack } from '@mui/system';
import { Divider } from '@mui/material';
// form
import * as Yup from 'yup';
import FormProvider, { RHFTextField } from 'src/components/hook-form';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
// algolia search bar
import AlgoliaSearch from './components/AlgoliaSearch';

const Question2 = ({ handleSelections }) => {
  const defaultValues = {
    title: '',
    lesson_description: '',
  };

  const EventSchema = Yup.object().shape({
    title: Yup.string().max(255).required('Title is required'),
    learning_objective: Yup.string().max(255).required('Learning objective is required'),
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
            <Divider>
              <Typography variant="h6" color={'#919EAB'}>
                OR
              </Typography>
            </Divider>
          </Stack>
        </FormProvider>
        <Box py={3} px={3}>
          <AlgoliaSearch />
        </Box>
      </Box>
    </Box>
  );
};

export default Question2;
