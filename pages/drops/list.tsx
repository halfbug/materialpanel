import Head from 'next/head';
import { Grid, Container, Card } from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import Footer from '@/components/Footer';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import { ALL_DROPS } from '@/graphql/store.graphql';

function Logs() {
  const {
    loading, data, error,
  } = useQuery(ALL_DROPS);
  console.log('🚀 ~ file: list.tsx:17 ~ Logs ~ data', data);

  const headCells: Array<HeadCell<typeof data>> = [
    {
      id: 'status',
      disablePadding: false,
      type: 'status',
      statusOptions: {
        error: ['revised'], success: ['active'], warning: ['pending'],
      },
      label: 'Status',
    },
    {
      id: 'shortUrl',
      type: 'link',
      disablePadding: false,
      label: 'Link',
    },
    {
      id: 'createdAt',
      type: 'datetime',
      disablePadding: false,
      label: 'Created At',
    },

  ];

  return (
    <>
      <Head>
        <title>Drops</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title="Drops List" />
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

              {loading && <LinearIndeterminate />}
              <EnhancedTable headCells={headCells} rows={data?.dropsGroupshops ?? []} orderByFieldName="createdAt" />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Logs.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Logs;
