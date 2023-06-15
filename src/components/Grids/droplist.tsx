import Head from 'next/head';
import {
  Grid, Container, Card, Button, Typography,
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
import getWeeks from '@/utils/getWeeks';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import Paper from '@mui/material/Paper';
import { makeStyles } from '@material-ui/core/styles';
import Tabs from '../Tabs/tabs';

const useStyles = makeStyles({
  container: {
    height: '1150px', // Set a fixed height for the container
    overflowY: 'auto', // Add a vertical scrollbar when content exceeds the container height
  },
  button: {
    '&:focus': {
      backgroundColor: '#A7C737', // Customize the background color for the active state
    },
  },
});

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

function DropsList({
  pagination, onPageChange, drops, loading, pageInfo,
  onPageSizeChange, onFilterModelChange, onSortModelChange, onHandleDate,

}) {
  const weeksDrops = getWeeks();
  useEffect(() => {
    const date = weeksDrops[0];
    onHandleDate(date);
    console.log('🚀 ~ file: droplist.tsx:30 ~ useEffect ~ date:', date);
  }, []);
  console.log('🚀 ~ file: droplist.tsx:26 ~ weeksDrops:', weeksDrops);
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
  const classes = useStyles();

  return (
    <>
      <Head>
        <title>Drops</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Drops List" />
      </PageTitleWrapper>
      <Container maxWidth="xl">
        <Button variant="contained" style={{ marginBottom: '25px' }}>Drops List</Button>

        <Box sx={{ width: 1 }}>
          <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>
            <Box gridColumn="span 1">
              <div className={classes.container} style={{ width: '100%' }}>
                { weeksDrops.map((item) => (
                  <Grid item ml={0} pl={0}>
                    <Button
                      className={classes.button}
                      color="primary"
                      focusVisibleClassName={classes.button}
                      size="medium"
                      style={{ marginBottom: '10px' }}
                      variant="contained"
                      onClick={() => onHandleDate(item)}
                    >
                      <Typography variant="body2" style={{ fontSize: '12px' }}>
                        {item.split(' - ')[0]}
                        {' '}
                        <br />
                        {item.split(' - ')[1]}
                        {' '}
                      </Typography>
                    </Button>
                  </Grid>
                )) }
                {' '}

              </div>

            </Box>
            <Box gridColumn="span 11">
              <Item>
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
              </Item>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </>
  );
}

export default DropsList;
