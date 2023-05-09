import Head from 'next/head';
import {
  Grid, Container, Card,
} from '@mui/material';
import Box from '@mui/material/Box';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams,
} from '@mui/x-data-grid';
import Footer from '@/components/Footer';
import LinearIndeterminate from '@/components/Progress/Linear';
import Label from '@/components/Label';
import Tabs from '../Tabs/tabs';

function LogsList({
  pagination, onPageChange, logs, loading, pageInfo,
  onPageSizeChange, onFilterModelChange, onSortModelChange,

}) {
  const getStatusLabel = (props: GridRenderCellParams<String>) => {
    const { value } = props;
    let color : 'black' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
    const options = {
      error: ['error'], success: ['log'], warning: ['warn'],
    };
    // eslint-disable-next-line no-restricted-syntax
    for (const key in options) {
      if (options[key].includes(value.toLowerCase())) {
        color = key as typeof color;
      }
    }
    return <Label color={color} className="text-capitalize">{value}</Label>;
  };

  const columns: GridColDef[] = [
    {
      field: 'level',
      headerName: 'Level',
      width: 90,
      renderCell: getStatusLabel,
    },
    {
      field: 'context',
      headerName: 'Context',
      width: 250,
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 200,
      valueGetter: (params: GridValueGetterParams) => new Date(
        params.row.createdAt,
      ).toLocaleString(),
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 550,
      valueGetter: (params: GridValueGetterParams) => params.row.message || '',
    },
  ];

  return (
    <>
      <Head>
        <title>App Logs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Logs" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Logs List',
              value: '1',
              component:
  <Grid
    container
    direction="row"
    justifyContent="center"
    alignItems="stretch"
    spacing={3}
    style={{ marginTop: '10px' }}
  >
    <Grid item xs={12}>
      <Card sx={{ padding: 3 }}>
        <Box sx={{ height: 1150, width: '100%' }}>
          {loading && <LinearIndeterminate />}

          <DataGrid
            rows={logs ?? []}
            columns={columns}
            rowsPerPageOptions={[25, 50, 100]}
            disableSelectionOnClick
            experimentalFeatures={{ newEditingApi: true }}
            pagination
            pageSize={pagination?.take ?? 25}
            rowCount={pageInfo?.total ?? 0}
            paginationMode="server"
            loading={loading}
            {...pageInfo}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            filterMode="server"
            onFilterModelChange={onFilterModelChange}
            sortingMode="server"
            onSortModelChange={onSortModelChange}
          />
        </Box>
      </Card>
    </Grid>
  </Grid>,
            },
          ]}
        />
      </Container>
      <Footer />
    </>
  );
}

export default LogsList;
