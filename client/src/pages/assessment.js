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
        <Typography align="center" sx={{ color: 'text.secondary' }}>
          Let's ask you a couple of questions...
        </Typography>

        <Typography variant="h3" align="center" paragraph>
          Do you want to generate plans for your entire curriculum or start with a single lesson
          plan?
        </Typography>

        <Box gap={3} display="grid" gridTemplateColumns={{ md: 'repeat(3, 1fr)' }}>
          {_pricingPlans.map((card, index) => (
            <PricingPlanCard key={card.subscription} card={card} index={index} />
          ))}
        </Box>
      </Container>
    </>
  );
}
