/* eslint-disable @next/next/no-img-element */
import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, TextField, Box,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import axios from 'axios';
import { GET_DROP_BANNER, UPDATE_DROPS_BANNER, REMOVE_DROP_BANNER } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useContext, useEffect, useState } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { v4 as uuid } from 'uuid';

const Settings = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [imagefeedback, setImagefeedback] = useState<null | string>(null);
  const [progress, setprogress] = useState<boolean>(false);

  const {
    loading, data, refetch,
  } = useQuery(GET_DROP_BANNER);

  const [updateStore, { data: dropsUpdateData }] = useMutation<any>(UPDATE_DROPS_BANNER, {
    fetchPolicy: 'network-only',
  });

  const [removeDropBanner, { data: removeBannerImage }] = useMutation<any>(REMOVE_DROP_BANNER, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    setImageUrl(data?.getDropBanner?.settings?.dropBanner);
  }, [data]);

  const updateBanner = async (banner: string) => {
    await updateStore({
      variables: {
        updateStoreInput: {
          id: data?.getDropBanner?.id,
          settings: {
            dropBanner: banner,
          },
        },
      },
    });
  };

  const handleRemoveBanner = () => {
    const config = {
      headers: { 'Content-Type': 'multipart/form-data;boundary=None' },
    };
    const lastElement = imageUrl.split('/').pop();
    axios.delete(`${process.env.API_URL}/image/bannerimage?key=${lastElement}`, config)
      .then(async (res) => {
        if (res.data.message) {
          await updateStore({
            variables: {
              updateStoreInput: {
                id: data?.getDropBanner?.id,
                settings: {
                  dropBanner: null,

                },
              },
            },
          });
          setImageUrl(null);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleFileUpload = (event) => {
    try {
      console.log('im in upload');
      if (event.target.files) {
        setprogress(true);
        const files:any = Array.from(event.target.files);
        const config = {
          headers: { 'Content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' },
        };
        const fileType = files[0].type;
        const fileSize = files[0].size;
        if ((fileType === 'image/png' || fileType === 'image/jpg' || fileType === 'image/jpeg') && fileSize < 515515) {
          const file = event.target.files[0];
          const imgExt = files[0].name.split('.');
          const imgExt1 = imgExt[imgExt.length - 1];
          const uniqueId = uuid();
          const uniqueLimitId = uniqueId.substring(uniqueId.length - 12);
          const fd = new FormData();
          fd.append('image', files[0], `${uniqueLimitId}${'-'}${imgExt1}`);
          axios.post(`${process.env.API_URL}/image`, fd, config)
            .then((res) => {
              const fileS3Url: string = res.data.data.Location;
              setImageUrl(fileS3Url);
              setprogress(false);
              setImagefeedback('');
              updateBanner(fileS3Url);
            })
            .catch((err) => console.log(err));
        } else {
          if (fileSize > 515515) setImagefeedback('Please upload image under 500kb.');
          if (fileType !== 'image/png' && fileType !== 'image/jpg' && fileType !== 'image/jpeg') setImagefeedback('Please upload png, jpg, jpeg format only.');
        }
      }
    } catch (ex) {
      console.log(ex);
      setImagefeedback(JSON.stringify(ex));
    }
  };

  return (
    <>
      <Head>
        <title>App  Settings</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="App  Settings" />
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
            <Box
              component="form"
              sx={{
                '& .MuiTextField-root': { m: 1, width: '25ch' },
              }}
              noValidate
              autoComplete="off"
            >
              <TextField
                inputProps={{
                  multiple: false,
                  accept: 'image/*',
                }}
                className="d-none"
                id="logoImage"
                name="logoImage"
                onChange={handleFileUpload}
                type="file"
              />
            </Box>
            <div style={{ position: 'relative' }}>
              <div style={{ display: 'flex', width: '300px', justifyContent: 'space-between' }}>
                {imageUrl !== null && <CancelIcon style={{ position: 'absolute', left: '285px', top: '-15px' }} onClick={() => handleRemoveBanner()} /> }
                {imageUrl !== null && <img src={imageUrl} alt="banner" width="300" />}
              </div>
              <div className="permissiom-error">{imagefeedback}</div>
            </div>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

Settings.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default Settings;
