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
} from '@mui/material';
import Footer from '@/components/Footer';
import { DataGrid } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import useVideoUpload from '@/hooks/useVideoUpload';
import LinearIndeterminate from '@/components/Progress/Linear';

function Videoupload() {
  const {
    rows,
    errFlag,
    columns,
    selectVideo,
    handleChangeVideo,
    handleSelect,
    handleClick,
    videoError,
    isLoading,
    store,
  } = useVideoUpload();

  return (
    <>
      <Head>
        <title>Forms - Components</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading={store?.brandName ?? ''}
        />
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
                    id="standard-helperText"
                    type="file"
                    onChange={(e) => handleChangeVideo(e)}
                    inputProps={{
                      multiple: true,
                    }}
                    disabled={isLoading}
                  />
                </Box>
                {errFlag && <span style={{ color: 'red' }}>{errFlag}</span>}
                {videoError.map((ele:any) => (
                  <>
                    <span style={{ color: 'red' }}>{ele}</span>
                    <br />
                  </>
                ))}
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
                  <div style={{ height: 400, width: '100%' }}>
                    <DataGrid
                      rows={rows}
                      columns={columns}
                      pageSize={5}
                      rowsPerPageOptions={[5]}
                      checkboxSelection
                      onSelectionModelChange={(e: any) => handleSelect(e)}
                      selectionModel={selectVideo}
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
