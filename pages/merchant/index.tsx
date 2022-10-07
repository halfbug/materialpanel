import Head from 'next/head';
import { Grid, Container, Card } from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { EnhancedTable, HeadCell } from 'pages/components/tables/enhancedTable';
import { ALL_STORES } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';

interface THeader {
  id: string;

}
function StoreList() {
  const {
    loading, data,
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
      type: 'datetime',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'options',
      disablePadding: false,
      type: 'custom',
      label: '',
    },
  ];
  return (
    <>
      <Head>
        <title>Merchants</title>
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
