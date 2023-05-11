import Head from 'next/head';
import {
  Grid, Container, Card, Select, MenuItem, Button, Snackbar, Alert,
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
import { useState, useEffect } from 'react';
import { LogsLevel } from 'configs/constant';
import usePermission from '@/hooks/usePermission';
import Tabs from '../Tabs/tabs';

function LogsList({
  pagination, onPageChange, logs, loading, pageInfo,
  onPageSizeChange, onFilterModelChange, onSortModelChange,
  clearLogs, clearLogsData,

}) {
  const { userPermissions } = usePermission();

  const [level, setLevel] = useState<string>('');
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
    toastColor: '',
  });

  useEffect(() => {
    if (clearLogsData?.removeAppLoggerByLevel?.message) {
      setLevel('');
      setSuccessToast({
        toastTog: true,
        toastMessage: clearLogsData.removeAppLoggerByLevel.message,
        toastColor: 'success',
      });
    }
  }, [clearLogsData]);

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

  const handleClearLog = () => {
    clearLogs({
      variables: {
        level,
      },
    });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={successToast.toastTog}
        onClose={() => setSuccessToast({ ...successToast, toastTog: false })}
        autoHideDuration={3000}
        style={{ marginTop: '65px' }}
      >
        <Alert
          onClose={() => setSuccessToast({ ...successToast, toastTog: false })}
          sx={{
            width: '100%',
            background: successToast?.toastColor === 'success' ? '#287431' : '#DC3545',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              display: 'none',
            },
            '& .MuiAlert-action': {
              color: '#FFFFFF',
            },
          }}
        >
          {successToast.toastMessage}
        </Alert>
      </Snackbar>
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
      {((userPermissions?.includes('/logs/delete'))) && (
      <div style={{ display: 'flex', justifyContent: 'end', marginBottom: '10px' }}>
        <Select
          id="level"
          displayEmpty
          name="level"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
          style={{ width: '200px' }}
        >
          <MenuItem value="">Please select level</MenuItem>
          <MenuItem value={LogsLevel.LOG}>{LogsLevel.LOG}</MenuItem>
          <MenuItem value={LogsLevel.ERROR}>{LogsLevel.ERROR}</MenuItem>
          <MenuItem value={LogsLevel.WARN}>{LogsLevel.WARN}</MenuItem>
        </Select>
        <Button variant="contained" style={{ marginLeft: '10px' }} disabled={!level} onClick={() => handleClearLog()}>Clear log</Button>
      </div>
      )}
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
