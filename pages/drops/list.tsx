import Head from 'next/head';
import { Grid, Container, Card } from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import Box from '@mui/material/Box';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams,
} from '@mui/x-data-grid';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import Footer from '@/components/Footer';
import NextLink from 'next/link';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import { ALL_DROPS } from '@/graphql/store.graphql';
import Label from '@/components/Label';

function Logs() {
  const {
    loading, data, error,
  } = useQuery(ALL_DROPS);
  const getStatusLabel = (props: GridRenderCellParams<String>) => {
    // console.log(options);
    const { hasFocus, value } = props;
    let color : 'black' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
    const options = {
      error: ['revised'], success: ['active'], warning: ['pending'],
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const key in options) {
      // console.log('🚀 ~ file: enhancedTable.tsx ~ line 300 ~ getStatusLabel ~ text', text);
      // console.log('🚀 ~ file: enhancedTable.tsx
      //  ~ line 300 ~ getStatusLabel ~ options[key]', options[key]);
      if (options[key].includes(value.toLowerCase())) {
        color = key as typeof color;
      }
    }
    return <Label color={color} className="text-capitalize">{value}</Label>;
  };

  const columns: GridColDef[] = [

    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: getStatusLabel,
    },
    {
      field: 'shortUrl',
      headerName: 'Link',
      width: 230,
      renderCell: (params: GridValueGetterParams) => <NextLink href={params.row.shortUrl} passHref target="_blank">{params.row.shortUrl}</NextLink>,
    },
    {
      field: 'customerDetail.firstName',
      headerName: 'Name',
      width: 150,
      // eslint-disable-next-line max-len
      valueGetter: (params: GridValueGetterParams) => ((params.row.customerDetail.firstName !== null) ? params.row.customerDetail.firstName : params.row.customerDetail.fullName),
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 210,
      valueGetter: (params: GridValueGetterParams) => new Date(
        params.row.createdAt,
      ).toLocaleString(),
    },
    {
      field: 'discountCode.title',
      headerName: 'Discount Code',
      width: 170,
      valueGetter: (params: GridValueGetterParams) => params.row.discountCode?.title || '',
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
              <Box sx={{ height: 1150, width: '100%' }}>
                {loading && <LinearIndeterminate />}
                <DataGrid
                  rows={data?.dropsGroupshops ?? []}
                  columns={columns}
                  pageSize={20}
                  rowsPerPageOptions={[5, 10, 25]}
                  disableSelectionOnClick
                  experimentalFeatures={{ newEditingApi: true }}
                />
              </Box>
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
