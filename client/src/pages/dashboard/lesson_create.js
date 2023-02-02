// next
import Head from 'next/head';
// @mui
import { Container } from '@mui/material';
// redux
// routes
import { PATH_DASHBOARD } from '../../routes/paths';
// utils
// layouts
import DashboardLayout from '../../layouts/dashboard';
// components
import CustomBreadcrumbs from '../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../components/settings';

import { LessonForm } from 'src/sections/@dashboard/lesson';
// sections
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

LessoCreatePage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function LessoCreatePage() {
  const { themeStretch } = useSettingsContext();

  return (
    <>
      <Head>
        <title> Lesson Create </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Lesson Creation"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Lesson Creation',
            },
          ]}
        />

        <LessonForm />
      </Container>
    </>
  );
}
