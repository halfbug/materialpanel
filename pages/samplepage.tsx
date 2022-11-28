import Head from 'next/head';
import { Grid, Container, Card } from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';

function SamplePage() {
  return (
    <>
      <Head>
        <title>Sample Title</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title="sample page" />
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
              the children come here
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

SamplePage.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default SamplePage;
