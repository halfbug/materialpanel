/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-useless-escape */
/* eslint-disable max-len */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/jsx-props-no-spreading */
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import { useEffect, useState } from 'react';

import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
} from '@mui/material';
import Footer from '@/components/Footer';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { v4 as uuid } from 'uuid';
import { useMutation, useQuery } from '@apollo/client';
import { VideoStore } from 'types/groupshop';
import { GET_ALL_VIDEOS, VIDEO_POST } from '@/graphql/store.graphql';
import { useRouter } from 'next/router';

function Videoupload() {
  const router = useRouter();
  const { sid } = router.query;
  const [errFlag, setErrFlag] = useState<boolean>(false);

  const [videoPost] = useMutation<VideoStore>(VIDEO_POST);
  const {
    data, refetch,
  } = useQuery(GET_ALL_VIDEOS, {
    variables: { storeId: sid },
  });

  useEffect(() => {
    if (sid) {
      refetch();
    }
  }, [sid]);

  const handleChangeVideo = (e: any) => {
    const videoType = ['video/mp4'];
    if (!(Array.from(e.target.files).map((ele: any) => videoType.includes(ele?.type)))
      .includes(false)) {
      setErrFlag(false);
      const files: any = Array.from(e.target.files);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const fd = new FormData();

      files.forEach((a: any) => {
        const imgExt = a.name.split('.');
        const imgExt1 = imgExt[imgExt.length - 1];
        const uniqueId = uuid();
        const uniqueLimitId = uniqueId.substring(uniqueId.length - 12);
        fd.append('video', a, `${uniqueLimitId}.${imgExt1}`);
      });

      axios.post(`${process.env.NEXT_PUBLIC_API_URL}/image/video`, fd, config)
        .then((res) => {
          if (res?.data?.data && res.data.data.length > 0) {
            res.data.data.map(async (el: any) => {
              await videoPost({
                variables: {
                  createVideoInput: {
                    storeId: sid,
                    type: el.Location,
                    name: el.Key,
                    status: 'Active',
                  },
                },
              });
            });
            refetch();
          }
        })
        .catch((err) => console.log(err));
    } else {
      setErrFlag(true);
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Video URL', width: 480 },
    { field: 'status', headerName: 'Status', width: 200 },
  ];

  const [rows, setRows] = useState<any[]>([]);

  useEffect(() => {
    if (data?.videos?.length > 0) {
      const temp:any = data.videos.map((ite:any) => ({
        id: ite._id,
        name: ite.name,
        status: ite.status,
        storeId: ite.storeId,
        type: ite.type,
        createdAt: ite.createdAt ? new Date(parseInt(ite.createdAt)) : '',
        updatedAt: ite.updatedAt ? new Date(parseInt(ite.updatedAt)) : '',
      }));
      setRows(temp);
    }
  }, [data]);

  return (
    <>
      <Head>
        <title>Forms - Components</title>
      </Head>
      <PageTitleWrapper>
        <PageTitle
          heading="Video Upload"
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
                  />
                </Box>
                {errFlag && <span style={{ color: 'red' }}>Only mp4 video suppoted</span>}
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card>
              <CardHeader title="Uploaded video List" />
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
