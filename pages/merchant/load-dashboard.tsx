import { useContext, useEffect } from 'react';
import Head from 'next/head';
import {
  Grid, Container, Card, CircularProgress,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import useDashboardLogin from '@/hooks/useDashboardLogin';
import { useRouter } from 'next/router';
import { AuthContext } from '@/contexts/auth.context';

function LoadDashboard() {
  const { loginStore } = useDashboardLogin();
  const { query: { sid } } = useRouter();
  console.log('🚀 ~ file: load-dashboard.tsx ~ line 16 ~ LoadDashboard ~ route', sid);
  const { token } = useContext(AuthContext);
  useEffect(() => {
    loginStore(sid as string);
  }, [loginStore, sid, token]);

  return (
    <>
      <Head>
        <title>...loading</title>
      </Head>
      <PageTitleWrapper>
        {/* <PageHeader /> */}
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card sx={{ padding: 3 }}>
              <CircularProgress color="secondary" />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

LoadDashboard.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default LoadDashboard;
