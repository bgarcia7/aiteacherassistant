// next
import Head from 'next/head';
// @mui
import { Box, Switch, Container, Typography, Stack } from '@mui/material';
// _mock_
import { _pricingPlans } from '../_mock/arrays';
// layouts
import SimpleLayout from '../layouts/simple';
// sections
import { PricingPlanCard } from '../sections/pricing';
import { LinearStepper, CardOption } from '../sections/assessment';

// ----------------------------------------------------------------------

PricingPage.getLayout = (page) => <SimpleLayout>{page}</SimpleLayout>;

// ----------------------------------------------------------------------

export default function PricingPage() {
  return (
    <>
      <Head>
        <title> Teacher's Assistant - Assessment </title>
      </Head>

      <Container
        sx={{
          pt: 15,
          pb: 10,
          minHeight: 1,
        }}
      >
        <Typography align="center" sx={{ color: 'text.secondary', mb: 4 }}>
          Let's ask you a couple of questions...
        </Typography>

        <LinearStepper />
      </Container>
    </>
  );
}
