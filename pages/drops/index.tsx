/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import {
  useState, useEffect,
} from 'react';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  ToggleButtonGroup,
  ToggleButton,
  Button,
  Snackbar,
  Alert,
  TextField,
} from '@mui/material';
import Footer from '@/components/Footer';
import { DEFAULT_DISCOUNT, DROPS_UPDATE, GET_STORE_DETAILS } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { DropsForm } from '@/types/groupshop';

const Drops = () => {
  const router = useRouter();
  const { sid } = router.query;

  const {
    data,
  } = useQuery(GET_STORE_DETAILS, {
    variables: { id: sid },
  });

  const { data: findDrops } = useQuery(DEFAULT_DISCOUNT, {
    variables: { type: 'drops' },
  });

  const [updateStore, { data: dropsUpdateData }] = useMutation<any>(
    DROPS_UPDATE,
  );
  const [dropsIds, setDropsIds] = useState({
    M1Discount: '',
    M2Discount: '',
    M3Discount: '',
    spotlightDiscount: '',
    allProducts: '',
    latestProducts: '',
    bestSellers: '',
    spotlightProducts: '',
  });
  const [storeData, setStoreData] = useState<any>({});
  const [successToast, setSuccessToast] = useState<boolean>(false);
  const [status, setStatus] = useState<string>('');

  console.log('storeData🎈', storeData);
  console.log('status🎈', status);

  const validationSchema = yup.object({
    M1Discount: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('Milestore1 discount is required'),
    M2Discount: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('Milestore2 discount is required'),
    M3Discount: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('Milestore3 discount is required'),
    spotlightDiscount: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('spotlight discount is required'),
    allProducts: yup
      .string()
      .required('all products is required'),
    latestProducts: yup
      .string()
      .required('latest products is required'),
    bestSellers: yup
      .string()
      .required('best sellers is required'),
    spotlightProducts: yup
      .string()
      .required('spotlight products is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, errors,
  }:FormikProps<DropsForm> = useFormik<DropsForm>({
    initialValues: dropsIds,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      try {
        await updateStore({
          variables: {
            updateStoreInput: {
              id: sid,
              drops: {
                ...storeData.drops,
                status: storeData?.drops?.status ?? status,
                allProductsCollectionId: value.allProducts,
                bestSellerCollectionId: value.bestSellers,
                latestCollectionId: value.latestProducts,
                spotlightColletionId: value.spotlightProducts,
                spotlightDiscount: {
                  percentage: value.spotlightDiscount,
                },
                rewards: {
                  baseline: value.M1Discount,
                  average: value.M2Discount,
                  maximum: value.M3Discount,
                },
              },
            },
          },
        });
      } catch (error) {
        console.error('An unexpected error happened:', error);
      }
    },
  });

  useEffect(() => {
    if (data?.store) {
      setStoreData(data.store);
    }
  }, [data]);

  useEffect(() => {
    if (storeData) {
      setDropsIds({
        M1Discount: storeData.drops?.rewards?.baseline ?? findDrops?.findDrops?.details.baseline,
        M2Discount: storeData.drops?.rewards?.average ?? findDrops?.findDrops?.details.average,
        M3Discount: storeData.drops?.rewards?.maximum ?? findDrops?.findDrops?.details.maximum,
        spotlightDiscount: storeData.drops?.spotlightDiscount?.percentage,
        allProducts: storeData.drops?.allProductsCollectionId,
        bestSellers: storeData.drops?.bestSellerCollectionId,
        latestProducts: storeData.drops?.latestCollectionId,
        spotlightProducts: storeData.drops?.spotlightColletionId,
      });
      setStatus(storeData.drops?.status ? storeData.drops.status : 'InActive');
    }
  }, [storeData, findDrops]);

  useEffect(() => {
    if (dropsUpdateData) {
      setSuccessToast(true);
    }
  }, [dropsUpdateData]);

  const handleChangeStatus = (e: any) => {
    if (e.target.value === '1') {
      setStatus('Active');
      updateStatus('Active');
    } else {
      setStatus('InActive');
      updateStatus('InActive');
    }
  };

  const updateStatus = async (value: string) => {
    await updateStore({
      variables: {
        updateStoreInput: {
          id: sid,
          drops: {
            ...storeData.drops,
            status: value,
          },
        },
      },
    });
  };

  return (
    <>
      <Snackbar
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        open={successToast}
        onClose={() => setSuccessToast(false)}
        message="Drops updated successfully!"
        autoHideDuration={5000}
        style={{ marginTop: '65px' }}
      >
        <Alert
          onClose={() => setSuccessToast(false)}
          sx={{
            width: '100%',
            background: '#287431',
            color: '#FFFFFF',
            '& .MuiAlert-icon': {
              display: 'none',
            },
            '& .MuiAlert-action': {
              color: '#FFFFFF',
            },
          }}
        >
          Drops updated successfully!
        </Alert>
      </Snackbar>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <PageTitleWrapper>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PageTitle
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            heading={`DROPS - ${storeData?.brandName ? storeData?.brandName : ''}`}
          />
          {status ? (
            <div className="align-items-center" style={{ display: 'flex', gap: '5px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Status</span>
              <ToggleButtonGroup
                color="primary"
                value={status}
                exclusive
                onChange={(e) => handleChangeStatus(e)}
                aria-label="Platform"
                style={{ gap: '10px' }}
              >
                <ToggleButton value={1} className={status === 'Active' ? 'enablebtn_active' : 'enablebtn'}>
                  <CheckCircleOutlineRoundedIcon />
                  {' '}
                  Enabled
                </ToggleButton>
                <ToggleButton value={0} className={status === 'InActive' ? 'disablebtn_active' : 'disablebtn'}>
                  <CancelOutlinedIcon />
                  {' '}
                  Disabled
                </ToggleButton>
              </ToggleButtonGroup>
            </div>
          ) : ''}
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
            <form noValidate onSubmit={handleSubmit}>
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Milestore1 Discount</h4>
                  <TextField
                    id="M1Discount"
                    name="M1Discount"
                    placeholder="Please enter M1 Discount"
                    value={values.M1Discount}
                    onChange={handleChange}
                    error={touched.M1Discount && Boolean(errors.M1Discount)}
                    helperText={touched.M1Discount && errors.M1Discount}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Milestore2 Discount</h4>
                  <TextField
                    id="M2Discount"
                    name="M2Discount"
                    placeholder="Please enter M2 Discount"
                    value={values.M2Discount}
                    onChange={handleChange}
                    error={touched.M2Discount && Boolean(errors.M2Discount)}
                    helperText={touched.M2Discount && errors.M2Discount}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Milestore3 Discount</h4>
                  <TextField
                    id="M3Discount"
                    name="M3Discount"
                    placeholder="Please enter M3 Discount"
                    value={values.M3Discount}
                    onChange={handleChange}
                    error={touched.M3Discount && Boolean(errors.M3Discount)}
                    helperText={touched.M3Discount && errors.M3Discount}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Spotlight Discount</h4>
                  <TextField
                    id="spotlightDiscount"
                    name="spotlightDiscount"
                    placeholder="Please enter spotlight discount"
                    value={values.spotlightDiscount}
                    onChange={handleChange}
                    error={touched.spotlightDiscount
                      && Boolean(errors.spotlightDiscount)}
                    helperText={touched.spotlightDiscount && errors.spotlightDiscount}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>All Products</h4>
                  <TextField
                    id="allProducts"
                    name="allProducts"
                    placeholder="Please enter all productId"
                    value={values.allProducts}
                    onChange={handleChange}
                    error={touched.allProducts && Boolean(errors.allProducts)}
                    helperText={touched.allProducts && errors.allProducts}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Latest Products</h4>
                  <TextField
                    id="latestProducts"
                    name="latestProducts"
                    placeholder="Please enter latest productId"
                    value={values.latestProducts}
                    onChange={handleChange}
                    error={touched.latestProducts && Boolean(errors.latestProducts)}
                    helperText={touched.latestProducts && errors.latestProducts}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Bestsellers</h4>
                  <TextField
                    id="bestSellers"
                    name="bestSellers"
                    placeholder="Please enter best sellerId"
                    value={values.bestSellers}
                    onChange={handleChange}
                    error={touched.bestSellers && Boolean(errors.bestSellers)}
                    helperText={touched.bestSellers && errors.bestSellers}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Spotlight Products</h4>
                  <TextField
                    id="spotlightProducts"
                    name="spotlightProducts"
                    placeholder="Please enter spotlight productId"
                    value={values.spotlightProducts}
                    onChange={handleChange}
                    error={touched.spotlightProducts
                      && Boolean(errors.spotlightProducts)}
                    helperText={touched.spotlightProducts && errors.spotlightProducts}
                    style={{ width: '300px' }}
                  />
                </div>
                <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Save</Button>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

Drops.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Drops;
