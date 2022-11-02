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

function Discoverytools() {
  return (
    <>
      <Head>
        <title>Discovery Tools</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Discovery Tools"
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
              <CardHeader title="Tools" />
              <Divider />
              <CardContent>
                <Box
                  component="form"
                  sx={{
                    '& .MuiTextField-root': { m: 1, width: '25ch' },
                  }}
                  noValidate
                  autoComplete="off"
                >
                  {/* <TextField
                    id="standard-helperText"
                    type="file"
                    onChange={(e) => handleChangeVideo(e)}
                    inputProps={{
                      multiple: true,
                    }}
                  /> */}
                </Box>
                {/* {errFlag && <span style={{ color: 'red' }}>{errFlag}</span>} */}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
}

Discoverytools.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Discoverytools;
