/* eslint-disable max-len */
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Button,
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  Snackbar,
  Alert,
} from '@mui/material';
import Footer from '@/components/Footer';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useVideoUpload from '@/hooks/useVideoUpload';
import LinearIndeterminate from '@/components/Progress/Linear';
import 'react-data-grid/lib/styles.css';
import { AgGridReact } from 'ag-grid-react';
import { useRef } from 'react';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';

function Videoupload() {
  const gridRef = useRef();
  const {
    rows,
    errFlag,
    selectVideo,
    handleChangeVideo,
    handleClick,
    videoError,
    isLoading,
    fileName,
    toastData,
    toastClose,
    columnDefs,
    defaultColDef,
    isRowSelectable,
    onRowDragMove,
    onFirstDataRendered,
    onGridSizeChanged,
    getRowNodeId,
    onSelectionChanged,
    storeData,
    handleChangeDrops,
    DropsEnabledMessage,
  } = useVideoUpload(gridRef);

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={toastData.toastTog}
        onClose={() => toastClose()}
        autoHideDuration={5000}
        style={{ marginTop: '65px' }}
      >
        <Alert
          onClose={() => toastClose()}
          sx={{
            width: '100%',
            background: toastData.toastMessage === DropsEnabledMessage ? '#DC3545' : '#287431',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              display: 'none',
            },
            '& .MuiAlert-action': {
              color: '#FFFFFF',
            },
          }}
        >
          {toastData.toastMessage}
        </Alert>
      </Snackbar>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <PageTitleWrapper>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <PageTitle
            heading={storeData?.brandName}
          />
          <FormControlLabel
            control={
              <Switch checked={!!storeData?.drops?.isVideoEnabled} onChange={(e) => handleChangeDrops(e)} name="gilad" size="medium" />
          }
            label="Drop"
            labelPlacement="start"
          />
        </div>
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
            <Card>
              <CardHeader title="Upload Video" />
              <Divider />
              <CardContent>
                {isLoading && <LinearIndeterminate />}
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  <TextField
                    onChange={(e) => handleChangeVideo(e)}
                    id="standard-helperText"
                    type="file"
                    inputProps={{
                      multiple: true,
                    }}
                    disabled={isLoading}
                    value={fileName}
                  />
                </Box>
                <div>
                  <div>
                    <div>
                      {errFlag && <span style={{ marginLeft: '12px', color: 'red' }}>{errFlag}</span>}
                    </div>
                    <div>
                      {videoError.map((ele: any) => (
                        <>
                          <span style={{ marginLeft: '12px', color: 'red' }}>{ele}</span>
                          <br />
                        </>
                      ))}
                    </div>
                  </div>
                  <div style={{ marginLeft: '12px', marginTop: '10px' }}>
                    {selectVideo.length}
                    {' '}
                    of 5 Video selected (Max 5)
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <Grid container xs={12} style={{ justifyContent: 'space-between' }}>
                <CardHeader title="Uploaded video List" />
                <Button sx={{ margin: 1 }} style={{ right: '10px' }} variant="contained" onClick={() => handleClick()} disabled={isLoading}>Submit</Button>
              </Grid>
              <Divider />
              <CardContent>
                {rows.length > 0 && (
                  <div style={{ height: '100%', width: '100%' }} className="ag-theme-alpine">
                    <AgGridReact
                      domLayout="autoHeight"
                      ref={gridRef}
                      rowData={rows}
                      columnDefs={columnDefs}
                      defaultColDef={defaultColDef}
                      immutableData
                      rowSelection="multiple"
                      suppressRowClickSelection
                      isRowSelectable={isRowSelectable}
                      rowDragManaged
                      animateRows
                      onRowDragMove={onRowDragMove}
                      onFirstDataRendered={onFirstDataRendered}
                      onGridSizeChanged={onGridSizeChanged}
                      getRowNodeId={getRowNodeId}
                      onSelectionChanged={onSelectionChanged}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Videoupload.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Videoupload;
