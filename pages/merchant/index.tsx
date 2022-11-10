import Head from 'next/head';
import {
  Grid, Container, Card, IconButton,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ALL_STORES } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import { Dashboard, VideoCameraFront } from '@mui/icons-material';
import { IStore } from 'types/groupshop';

interface THeader {
  id: string;

}
function StoreList() {
  const {
    loading, data, error,
  } = useQuery(ALL_STORES);
  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ data', data);
  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ loading', loading);
  const headCells: Array<HeadCell<typeof data>> = [
    {
      id: 'brandName',
      disablePadding: false,
      label: 'brand Name',
    },
    {
      id: 'createdAt',
      type: 'timestamp',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'planResetDate',
      type: 'datetime',
      disablePadding: false,
      label: 'Plan Reset',
    },
    {
      id: 'status',
      disablePadding: false,
      type: 'status',
      statusOptions: { error: ['uninstalled'], success: ['active'], warning: ['inActive'] },
      label: 'Status',
    },
    {
      id: 'subscription.status',
      disablePadding: false,
      type: 'status',
      statusOptions: { error: ['declined'], success: ['active', 'zero trial'], warning: ['pending'] },
      label: 'Billing',
    },
    {
      id: 'options',
      disablePadding: false,
      type: 'custom',
      label: 'options',
      options: [{ btn: <IconButton aria-label="delete" color="primary"><Dashboard /></IconButton>, link: '/dashboard' }, { btn: <IconButton aria-label="delete" color="primary"><VideoCameraFront /></IconButton>, link: '/store/videoupload' }],
    },
  ];
  return (
    <>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader />
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

              <EnhancedTable headCells={headCells} rows={data?.stores ?? []} orderByFieldName="brandName" />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

StoreList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default StoreList;
