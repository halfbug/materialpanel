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
  Modal,
  Box,
} from '@mui/material';
import Footer from '@/components/Footer';
import {
  DEFAULT_DISCOUNT, DROPS_UPDATE, GET_STORE_DETAILS,
} from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { DropsForm } from '@/types/groupshop';
import IconButton from '@mui/material/IconButton';

const Drops = () => {
  const router = useRouter();
  const { sid } = router.query;

  const dropsUpdatedMessage = 'Drops updated successfully!';
  const dropsUpdatedError = 'First fill all field';

  const [storeData, setStoreData] = useState<any>({});

  const {
    data: getStoreData, refetch,
  } = useQuery(GET_STORE_DETAILS, {
    skip: !sid,
    variables: { id: sid },
  });

  useEffect(() => {
    if (getStoreData?.store) {
      setStoreData(getStoreData?.store);
    }
  }, [getStoreData]);

  const { data: findDrops } = useQuery(DEFAULT_DISCOUNT, {
    variables: { type: 'drops' },
  });

  const [updateStore, { data: dropsUpdateData }] = useMutation<any>(
    DROPS_UPDATE,
  );
  const [dropsIds, setDropsIds] = useState<any>({
    M1Discount: '',
    M2Discount: '',
    M3Discount: '',
    spotlightDiscountTitle: '',
    spotlightDiscountPercentage: '',
    spotlightDiscountPriceRuleId: '',
    allProducts: '',
    latestProducts: '',
    bestSellers: '',
    spotlightProducts: '',
    collections: [],
  });
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });
  const [status, setStatus] = useState<string>('');
  const [addFieldPopup, setAddFieldPopup] = useState<boolean>(false);
  const [addField, setAddField] = useState('');

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
    collections: yup.array().of(
      yup.object().shape({
        shopifyId: yup
          .string()
          .matches(/^\d+$/, 'Please enter only numbers')
          .required('Required shopify collection id'),
      }),
    ),
    // spotlightDiscountPercentage: yup
    //   .string()
    //   .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
    //   .required('spotlight discount is required'),
    allProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('all products is required'),
    latestProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('latest products is required'),
    bestSellers: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('best sellers is required'),
    // spotlightProducts: yup
    //   .string()
    //   .required('spotlight products is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, errors, setFieldValue,
  }: FormikProps<DropsForm> = useFormik<DropsForm>({
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
                ...storeData?.drops,
                status: storeData?.drops?.status ?? status,
                collections: [
                  { name: 'All Products', shopifyId: `gid://shopify/Collection/${value.allProducts}` },
                  { name: 'Bestsellers', shopifyId: `gid://shopify/Collection/${value.bestSellers}` },
                  { name: 'Latest Products', shopifyId: `gid://shopify/Collection/${value.latestProducts}` },
                  ...value.collections.map((col) => ({
                    ...col,
                    shopifyId: `gid://shopify/Collection/${col.shopifyId}`,
                  })),
                ],
                spotlightColletionId: value.spotlightProducts ? `gid://shopify/Collection/${value.spotlightProducts}` : '',
                spotlightDiscount: {
                  title: value.spotlightDiscountTitle,
                  percentage: value.spotlightDiscountPercentage,
                  priceRuleId: value.spotlightDiscountPriceRuleId,
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
    if (storeData && sid) {
      setDropsIds({
        ...dropsIds,
        M1Discount: storeData.drops?.rewards?.baseline ?? findDrops?.findDrops?.details.baseline,
        M2Discount: storeData.drops?.rewards?.average ?? findDrops?.findDrops?.details.average,
        M3Discount: storeData.drops?.rewards?.maximum ?? findDrops?.findDrops?.details.maximum,
        spotlightDiscountTitle: storeData.drops?.spotlightDiscount?.title,
        spotlightDiscountPercentage: storeData.drops?.spotlightDiscount?.percentage,
        spotlightDiscountPriceRuleId: storeData.drops?.spotlightDiscount?.priceRuleId,
        allProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'All Products')?.shopifyId?.split('/')[4],
        bestSellers: storeData.drops?.collections?.find((el: any) => el?.name === 'Bestsellers')?.shopifyId?.split('/')[4],
        latestProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'Latest Products')?.shopifyId?.split('/')[4],
        spotlightProducts: storeData.drops?.spotlightColletionId?.split('/')[4] ?? '',
        collections: storeData.drops?.collections?.filter((el: any) => el?.name !== 'All Products' && el?.name !== 'Bestsellers' && el?.name !== 'Latest Products')
          .map((colle: any) => ({ ...colle, shopifyId: colle?.shopifyId?.split('/')[4] })) ?? [],
      });
      setStatus(storeData.drops?.status ? storeData.drops.status : 'InActive');
    }
  }, [storeData, findDrops]);

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      refetch();
      setSuccessToast({ toastTog: true, toastMessage: dropsUpdatedMessage });
    }
  }, [dropsUpdateData]);

  const handleChangeStatus = (e: any) => {
    if (storeData.drops) {
      if (e.target.value === '1') {
        setStatus('Active');
        updateStatus('Active');
      } else {
        setStatus('InActive');
        updateStatus('InActive');
      }
    } else {
      setSuccessToast({ toastTog: true, toastMessage: dropsUpdatedError });
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

  const style = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    // border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  const handleClose = () => {
    setAddFieldPopup(false);
    setAddField('');
  };

  const handleSave = () => {
    if (addField) {
      values?.collections?.push({ name: addField, shopifyId: '' });
      handleClose();
    }
  };

  const handleRemove = (index: number) => {
    setDropsIds({
      ...dropsIds,
      collections: dropsIds.collections.filter((_: any, i: number) => i !== index),
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
            background: successToast?.toastMessage === dropsUpdatedError ? '#DC3545' : '#287431',
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
                    id="spotlightDiscountPercentage"
                    name="spotlightDiscountPercentage"
                    placeholder="Please enter spotlight discount"
                    value={values.spotlightDiscountPercentage}
                    onChange={handleChange}
                    error={touched.spotlightDiscountPercentage
                      && Boolean(errors.spotlightDiscountPercentage)}
                    helperText={touched.spotlightDiscountPercentage
                      && errors.spotlightDiscountPercentage}
                    style={{ width: '300px' }}
                    disabled
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
                    disabled
                  />
                </div>
                {values?.collections?.length
                  ? values?.collections.map((item:any, index:number) => {
                    const errText:any = errors?.collections?.length && errors?.collections[index];
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={item.name}>
                        <h4 className="lable" style={{ width: '135px' }}>{item.name}</h4>
                        <TextField
                          id={item.shopifyId}
                          name={item.shopifyId}
                          placeholder={`Please enter ${item.name}`}
                          value={item.shopifyId}
                          onChange={(e) => setFieldValue(`collections.${index}.shopifyId`, e.target.value)}
                          error={touched?.collections && touched?.collections[index]
                          && touched?.collections[index]?.shopifyId
                          && errors?.collections?.length && errors?.collections[index]
                          && Boolean(errors?.collections[index])}
                          helperText={touched?.collections && touched?.collections[index]
                          && touched?.collections[index]?.shopifyId
                          && errText?.shopifyId}
                          style={{ width: '300px' }}
                        />
                        <IconButton aria-label="delete" color="error" onClick={() => handleRemove(index)}><CancelOutlinedIcon /></IconButton>
                      </div>
                    );
                  })
                  : '' }
                <Button variant="contained" type="submit" style={{ marginTop: '10px' }}>Save</Button>
                <Button variant="contained" style={{ marginTop: '10px', marginLeft: '50px' }} onClick={() => setAddFieldPopup(true)}>Add Section</Button>
              </Card>
            </form>
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <Modal
        open={addFieldPopup}
        onClose={() => handleClose()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <TextField
            name="addField"
            placeholder="Please enter field name"
            value={addField}
            onChange={(e) => setAddField(e.target.value)}
            style={{ width: '300px' }}
          />
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleSave()}>Save</Button>
        </Box>
      </Modal>
    </>
  );
};

Drops.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Drops;
