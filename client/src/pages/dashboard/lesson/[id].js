// next
import Head from 'next/head';
import { useEffect } from 'react';
// @mui
import { Container } from '@mui/material';
// redux
// routes
import { PATH_DASHBOARD } from '../../../routes/paths';
// utils
// layouts
import DashboardLayout from '../../../layouts/dashboard';
// components
import { useRouter } from 'next/router';
import LessonPlanView from 'src/sections/@dashboard/lesson/LessonPlanView';
import CustomBreadcrumbs from '../../../components/custom-breadcrumbs';
import { useSettingsContext } from '../../../components/settings';
// sections
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

LessonPage.getLayout = (page) => <DashboardLayout>{page}</DashboardLayout>;

// ----------------------------------------------------------------------

export default function LessonPage() {
  const { themeStretch } = useSettingsContext();
  const router = useRouter();
  const { id } = router.query;

  useEffect(() => {
    console.log('Detected id', id);
  }, []);

  return (
    <>
      <Head>
        <title> Lesson Plan </title>
      </Head>

      <Container maxWidth={themeStretch ? false : 'xl'}>
        <CustomBreadcrumbs
          heading="Lesson Plan"
          links={[
            {
              name: 'Dashboard',
              href: PATH_DASHBOARD.root,
            },
            {
              name: 'Lesson Plan',
            },
          ]}
        />

        <LessonPlanView id={id} />
      </Container>
    </>
  );
}
