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
import { ALL_LOGS } from '@/graphql/store.graphql';

function Logs() {
  const {
    loading, data, error,
  } = useQuery(ALL_LOGS);

  const headCells: Array<HeadCell<typeof data>> = [
    {
      id: 'level',
      disablePadding: false,
      type: 'status',
      statusOptions: { error: ['error'], success: ['log'], warning: ['warn', 'debug'] },
      label: 'level',
    },
    {
      id: 'context',
      disablePadding: false,
      label: 'Context',
    },
    {
      id: 'createdAt',
      type: 'datetime',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'message',
      disablePadding: false,
      label: 'Message',
    },

  ];
  // const columns: GridColDef[] = [
  //   { field: 'id', headerName: 'ID', width: 70 },
  //   { field: 'firstName', headerName: 'First name', width: 130 },
  //   { field: 'lastName', headerName: 'Last name', width: 130 },
  //   {
  //     field: 'age',
  //     headerName: 'Age',
  //     type: 'number',
  //     width: 90,
  //   },
  //   {
  //     field: 'fullName',
  //     headerName: 'Full name',
  //     description: 'This column has a value getter and is not sortable.',
  //     sortable: false,
  //     width: 160,
  //     valueGetter: (params: GridValueGetterParams) =>
  //  `${params.row.firstName || ''} ${params.row.lastName || ''}`,
  //   },
  // ];

  // const rows = [
  //   {
  //     id: 1, lastName: 'Snow', firstName: 'Jon', age: 35,
  //   },
  //   {
  //     id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42,
  //   },
  //   {
  //     id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45,
  //   },
  //   {
  //     id: 4, lastName: 'Stark', firstName: 'Arya', age: 16,
  //   },
  //   {
  //     id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null,
  //   },
  //   {
  //     id: 6, lastName: 'Melisandre', firstName: null, age: 150,
  //   },
  //   {
  //     id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44,
  //   },
  //   {
  //     id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36,
  //   },
  //   {
  //     id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65,
  //   },
  // ];
  // console.log('🚀 ~ file: logs.tsx:59 ~ Logs ~ rows', rows);
  return (
    <>
      <Head>
        <title>App Logs</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader title="Logs" />
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
              {/* <div style={{ display: 'flex', height: '70vh' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}

                  />
                </div>
              </div> */}
              {loading && <LinearIndeterminate />}
              <EnhancedTable headCells={headCells} rows={data?.apploggers ?? []} orderByFieldName="createdAt" />
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
