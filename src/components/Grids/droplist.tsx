import Head from 'next/head';
import {
  Grid, Container, Card, Button,
} from '@mui/material';
import Box from '@mui/material/Box';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  DataGrid, GridColDef, GridRenderCellParams, GridValueGetterParams,
} from '@mui/x-data-grid';
import Footer from '@/components/Footer';
import NextLink from 'next/link';
import LinearIndeterminate from '@/components/Progress/Linear';
import Label from '@/components/Label';
import { useState, useEffect } from 'react';
import { random } from 'lodash';
import Tabs from '../Tabs/tabs';

function DropsList({
  pagination, onPageChange, drops, loading, pageInfo,
  onPageSizeChange, onFilterModelChange, onSortModelChange,

}) {
  const getStatusLabel = (props: GridRenderCellParams<String>) => {
    const { hasFocus, value } = props;
    let color : 'black' | 'primary' | 'secondary' | 'error' | 'warning' | 'success' | 'info';
    const options = {
      error: ['revised'], success: ['active'], warning: ['pending'],
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
      field: 'status',
      headerName: 'Status',
      width: 100,
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
      valueGetter: (params: GridValueGetterParams) => ((params.row.customerDetail.firstName !== null && params.row.customerDetail.firstName !== '') ? params.row.customerDetail.firstName : params.row.customerDetail.fullName),
    },
    {
      field: 'store',
      headerName: 'Store Name',
      width: 220,
      valueGetter: (params: GridValueGetterParams) => params.row.store?.shop || '',
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
        <PageHeader pagetitle="Drops List" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Drops List',
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
            rows={drops ?? []}
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

export default DropsList;
