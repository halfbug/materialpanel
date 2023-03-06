/* eslint-disable no-plusplus */
/* eslint-disable max-len */
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
  DEFAULT_DISCOUNT, DROPS_UPDATE, GET_STORE_DETAILS, GET_UPDATE_CODES_STATUS,
} from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { DropsForm } from '@/types/groupshop';
import IconButton from '@mui/material/IconButton';
import LinearIndeterminate from '@/components/Progress/Linear';
import getDMYFormatedDate from '@/utils/getDMYFormatedDate';
import DropsCollectionIdsDrag from 'pages/components/modals/DropsCollectionIdsDrag';

// eslint-disable-next-line no-shadow
export enum CodeUpdateStatusTypeEnum {
  none = 'none',
  inprogress = 'inprogress',
  completed = 'completed',
}

const Drops = () => {
  const router = useRouter();
  const { sid } = router.query;

  const dropsUpdatedMessage = 'Drops updated successfully!';
  const dropsUpdatedError = 'First fill all field';

  const [storeData, setStoreData] = useState<any>({});
  const [lastSync, setlastsync] = useState<any>(null);
  const [codeUpdateStatus, setcodeUpdateStatus] = useState<CodeUpdateStatusTypeEnum>(CodeUpdateStatusTypeEnum.none);
  const [intervalID, setIntervalID] = useState<any>('');
  const [dropsCount, setdropsCount] = useState<number>(0);

  const { data: rdata, refetch: progressStatus } = useQuery(GET_UPDATE_CODES_STATUS, {
    variables: {
      storeId: sid,
    },
    fetchPolicy: 'network-only',
    onError() {
      setcodeUpdateStatus(CodeUpdateStatusTypeEnum.none);
      clearInterval(intervalID);
    },
  });

  useEffect(() => {
    if (rdata) {
      if (rdata?.getUpdateDiscountStatus?.codeUpdateStatus === CodeUpdateStatusTypeEnum.completed) {
        setcodeUpdateStatus(CodeUpdateStatusTypeEnum.completed);
        setdropsCount(rdata?.getUpdateDiscountStatus?.dropsCount ?? 0);
        setlastsync(getDMYFormatedDate(rdata?.getUpdateDiscountStatus?.lastSync));
        clearInterval(intervalID);
      }
    }
  }, [JSON.stringify(rdata)]);

  useEffect(() => {
    if (codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress) {
      const myIntervalID = setInterval(progressFunction, 5000);
      setIntervalID(myIntervalID);
    }
  }, [codeUpdateStatus]);

  const progressFunction = () => {
    progressStatus();
  };

  const {
    data: getStoreData, refetch,
  } = useQuery(GET_STORE_DETAILS, {
    skip: !sid,
    variables: { id: sid },
  });

  useEffect(() => {
    if (getStoreData?.store) {
      setlastsync(getDMYFormatedDate(getStoreData?.store?.drops?.lastSync));
      setdropsCount(getStoreData?.store?.drops?.dropsCount ?? 0);
      setcodeUpdateStatus(getStoreData?.store?.drops?.codeUpdateStatus ?? CodeUpdateStatusTypeEnum.none);
      setStoreData(getStoreData?.store);
    }
  }, [getStoreData]);

  const { data: findDrops } = useQuery(DEFAULT_DISCOUNT, {
    variables: { type: 'drops' },
  });

  const [updateStore, { data: dropsUpdateData, loading }] = useMutation<any>(
    DROPS_UPDATE,
  );
  const [dropsIds, setDropsIds] = useState<any>({
    M1Discount: '',
    M2Discount: '',
    M3Discount: '',
    spotlightDiscountTitle: '',
    spotlightDiscountPercentage: '',
    spotlightDiscountPriceRuleId: '',
    vaultDiscountTitle: '',
    vaultDiscountPercentage: '',
    vaultDiscountPriceRuleId: '',
    allProducts: '',
    latestProducts: '',
    bestSellers: '',
    vaultProducts: '',
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
  const [addFieldErr, setAddFieldErr] = useState({
    flag: false,
    msg: '',
  });
  const [dragFlag, setDragFlag] = useState(false);
  const [collectionData, setCollectionData] = useState<any[]>([]);

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
    vaultDiscountPercentage: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('Vault discount is required'),
    collections: yup.array().of(
      yup.object().shape({
        shopifyId: yup
          .string()
          .matches(/^\d+$/, 'Please enter only numbers')
          .required('Required shopify collection id'),
      }),
    ),
    spotlightDiscountPercentage: yup
      .string()
      .matches(/^[1-9]?[0-9]{1}$|^100$/, 'Please enter between 0 to 100')
      .required('spotlight discount is required'),
    allProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('All products is required'),
    latestProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('Latest products is required'),
    bestSellers: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('Best sellers is required'),
    vaultProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('Vault products is required'),
    spotlightProducts: yup
      .string()
      .matches(/^\d+$/, 'Please enter only numbers')
      .required('spotlight products is required'),
  });

  const {
    handleSubmit, values, handleChange, touched, errors, setFieldValue, setFieldTouched, validateForm,
  }: FormikProps<DropsForm> = useFormik<DropsForm>({
    initialValues: dropsIds,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      try {
        handleOrderSave([...collectionData.filter((el) => el.name !== 'All Products'), { name: 'All Products', shopifyId: `gid://shopify/Collection/${value.allProducts}` }]);
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
        spotlightDiscountPercentage: storeData.drops?.spotlightDiscount?.percentage ?? '',
        spotlightDiscountPriceRuleId: storeData.drops?.spotlightDiscount?.priceRuleId,
        vaultDiscountTitle: storeData.drops?.vaultDiscount?.title,
        vaultDiscountPercentage: storeData.drops?.vaultDiscount?.percentage ?? '',
        vaultDiscountPriceRuleId: storeData.drops?.vaultDiscount?.priceRuleId,
        allProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'All Products')?.shopifyId?.split('/')[4],
        bestSellers: storeData.drops?.collections?.find((el: any) => el?.name === 'Bestsellers')?.shopifyId?.split('/')[4],
        latestProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'Latest Products')?.shopifyId?.split('/')[4],
        vaultProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'Vault Products')?.shopifyId?.split('/')[4],
        spotlightProducts: storeData.drops?.collections?.find((el: any) => el?.name === 'Spotlight Products')?.shopifyId?.split('/')[4],
        collections: storeData.drops?.collections?.filter((el: any) => el?.name !== 'All Products' && el?.name !== 'Bestsellers' && el?.name !== 'Latest Products' && el?.name !== 'Vault Products' && el?.name !== 'Spotlight Products')
          .map((colle: any) => ({ ...colle, shopifyId: colle?.shopifyId?.split('/')[4] })) ?? [],
      });
      setStatus(storeData.drops?.status ? storeData.drops.status : 'InActive');
      setCollectionData(storeData.drops?.collections ?? []);
    }
  }, [storeData, findDrops]);

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      refetch();
      setSuccessToast({ toastTog: true, toastMessage: dropsUpdatedMessage });
      if (dropsUpdateData?.updateStore?.drops?.codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress) {
        setcodeUpdateStatus(CodeUpdateStatusTypeEnum.inprogress);
      }
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
    setAddFieldErr({ flag: false, msg: '' });
  };

  const handleSave = () => {
    const tempCollectionIds: string[] = ['all products', 'bestsellers', 'latest products', 'vault products', 'spotlight products'];
    if (addField && !values?.collections.find((cole) => cole.name.toLocaleLowerCase() === addField.toLocaleLowerCase()) && !tempCollectionIds.includes(addField.toLocaleLowerCase())) {
      setAddFieldErr({ flag: false, msg: '' });
      setDropsIds({ ...values, collections: [...values.collections, { name: addField, shopifyId: '' }] });
      setCollectionData([...collectionData, { name: addField, shopifyId: '' }]);
      handleClose();
    } else {
      setAddFieldErr({ flag: true, msg: 'Please Enter valid collection name' });
    }
  };

  const handleRemove = (index: number, name: string) => {
    setDropsIds({
      ...dropsIds,
      collections: dropsIds.collections.filter((_: any, i: number) => i !== index),
    });
    setCollectionData(collectionData.filter((cid: any) => cid.name !== name));
  };

  const handleOrderSave = (orderData: any) => {
    if (orderData.length) {
      const tempOrderData = orderData.map((coll: any) => {
        if (coll.name === 'Latest Products') {
          return { name: coll.name, shopifyId: `gid://shopify/Collection/${values.latestProducts}` };
        } if (coll.name === 'Bestsellers') {
          return { name: coll.name, shopifyId: `gid://shopify/Collection/${values.bestSellers}` };
        } if (coll.name === 'All Products') {
          return { name: coll.name, shopifyId: `gid://shopify/Collection/${values.allProducts}` };
        } if (coll.name === 'Vault Products') {
          return { name: coll.name, shopifyId: `gid://shopify/Collection/${values.vaultProducts}` };
        } if (coll.name === 'Spotlight Products') {
          return { name: coll.name, shopifyId: `gid://shopify/Collection/${values.spotlightProducts}` };
        }
        const temp = values.collections.find((co) => co.name === coll.name);
        return { name: temp.name, shopifyId: `gid://shopify/Collection/${temp.shopifyId}` };
      });
      setCollectionData(tempOrderData);
      updateStoreCall(tempOrderData);
    }
    setDragFlag(false);
  };

  const updateStoreCall = async (tempOrderData: any) => {
    try {
      await updateStore({
        variables: {
          updateStoreInput: {
            id: sid,
            drops: {
              ...storeData?.drops,
              codeUpdateStatus: storeData?.drops?.codeUpdateStatus ?? 'none',
              status: storeData?.drops?.status ?? status,
              collections: tempOrderData,
              spotlightDiscount: {
                title: values.spotlightDiscountTitle,
                percentage: `${values.spotlightDiscountPercentage}`,
                priceRuleId: values.spotlightDiscountPriceRuleId,
              },
              vaultDiscount: {
                title: values.vaultDiscountTitle,
                percentage: `${values.vaultDiscountPercentage}`,
                priceRuleId: values.vaultDiscountPriceRuleId,
              },
              rewards: {
                baseline: `${values.M1Discount}`,
                average: `${values.M2Discount}`,
                maximum: `${values.M3Discount}`,
              },
            },
          },
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  const handleChangeCollec = (e: any, index: number) => {
    setFieldValue(`collections.${index}.shopifyId`, e.target.value);
    const tempCond = collectionData.map((el:any) => el.name);
    if (tempCond.includes(e.target.id)) {
      const tempColl = collectionData.map((cid: any) => {
        if (cid.name === e.target.id) {
          return { name: cid.name, shopifyId: e.target.value ? `gid://shopify/Collection/${e.target.value}` : '' };
        } return cid;
      });
      setCollectionData(tempColl);
    } else {
      const tempColl = [...collectionData];
      tempColl.push({ name: e.target.id, shopifyId: e.target.value });
      setCollectionData(tempColl);
    }
  };

  const handleIds = (e: any) => {
    const { name, value } = e.target;
    setFieldValue(name, value);
    const tempNames = collectionData.map((el) => el.name);
    if (name === 'latestProducts' && !tempNames.includes('Latest Products')) {
      setCollectionData([...collectionData, { name: 'Latest Products', shopifyId: value }]);
    } else if (name === 'bestSellers' && !tempNames.includes('Bestsellers')) {
      setCollectionData([...collectionData, { name: 'Bestsellers', shopifyId: value }]);
    } else if (name === 'allProducts' && !tempNames.includes('All Products')) {
      setCollectionData([...collectionData, { name: 'All Products', shopifyId: value }]);
    } else if (name === 'vaultProducts' && !tempNames.includes('Vault Products')) {
      setCollectionData([...collectionData, { name: 'Vault Products', shopifyId: value }]);
    } else if (name === 'spotlightProducts' && !tempNames.includes('Spotlight Products')) {
      setCollectionData([...collectionData, { name: 'Spotlight Products', shopifyId: value }]);
    }
  };

  const handleDragColl = () => {
    (async () => {
      const valid: any = await validateForm();
      const tempData = collectionData.filter((el: any) => !el.shopifyId);
      if (!tempData.length && !Object.keys(valid).length) {
        setDragFlag(true);
      } else {
        Object.keys(valid).forEach((key: any) => {
          if (key === 'collections') {
            for (let i = 0; i < valid.collections.length; i++) {
              if (valid?.collections[i]?.shopifyId) {
                setFieldTouched(`collections.${i}.shopifyId`, true);
              }
            }
          } else {
            setFieldTouched(key, true);
          }
        });
      }
    })();
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
            background: successToast?.toastMessage === dropsUpdatedMessage ? '#287431' : '#DC3545',
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
                disabled={codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress}
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
      <Container maxWidth="lg" style={{ marginBottom: '20px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card style={{ paddingLeft: '20px', paddingRight: '20px' }}>
              {codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress && <LinearIndeterminate />}
              <h4 style={{ whiteSpace: 'nowrap' }}>
                <>
                  Discount Code Update -
                  {' '}
                  {codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress ? 'In Progress' : 'Completed '}
                  {codeUpdateStatus !== CodeUpdateStatusTypeEnum.inprogress && lastSync ? `(${lastSync})` : ''}
                  {codeUpdateStatus !== CodeUpdateStatusTypeEnum.inprogress && dropsCount ? `(${dropsCount})` : ''}
                </>
              </h4>
            </Card>
          </Grid>
        </Grid>
      </Container>
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
                    type="number"
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
                    type="number"
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
                    type="number"
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
                    type="number"
                    placeholder="Please enter spotlight discount"
                    value={values.spotlightDiscountPercentage}
                    onChange={handleChange}
                    error={touched.spotlightDiscountPercentage
                      && Boolean(errors.spotlightDiscountPercentage)}
                    helperText={touched.spotlightDiscountPercentage
                      && errors.spotlightDiscountPercentage}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Vault Discount</h4>
                  <TextField
                    id="vaultDiscountPercentage"
                    name="vaultDiscountPercentage"
                    type="number"
                    placeholder="Please enter vault discount"
                    value={values.vaultDiscountPercentage}
                    onChange={handleChange}
                    error={touched.vaultDiscountPercentage
                      && Boolean(errors.vaultDiscountPercentage)}
                    helperText={touched.vaultDiscountPercentage
                      && errors.vaultDiscountPercentage}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>All Products</h4>
                  <TextField
                    id="allProducts"
                    name="allProducts"
                    type="number"
                    placeholder="Please enter all productId"
                    value={values.allProducts}
                    onChange={(e) => handleIds(e)}
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
                    type="number"
                    placeholder="Please enter latest productId"
                    value={values.latestProducts}
                    onChange={(e) => handleIds(e)}
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
                    type="number"
                    placeholder="Please enter best sellerId"
                    value={values.bestSellers}
                    onChange={(e) => handleIds(e)}
                    error={touched.bestSellers && Boolean(errors.bestSellers)}
                    helperText={touched.bestSellers && errors.bestSellers}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Vault Products</h4>
                  <TextField
                    id="vaultProducts"
                    name="vaultProducts"
                    type="number"
                    placeholder="Please enter vault products"
                    value={values.vaultProducts}
                    onChange={(e) => handleIds(e)}
                    error={touched.vaultProducts && Boolean(errors.vaultProducts)}
                    helperText={touched.vaultProducts && errors.vaultProducts}
                    style={{ width: '300px' }}
                  />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <h4 className="lable" style={{ width: '135px' }}>Spotlight Products</h4>
                  <TextField
                    id="spotlightProducts"
                    name="spotlightProducts"
                    type="number"
                    placeholder="Please enter spotlight productId"
                    value={values.spotlightProducts}
                    onChange={(e) => handleIds(e)}
                    error={touched.spotlightProducts
                      && Boolean(errors.spotlightProducts)}
                    helperText={touched.spotlightProducts && errors.spotlightProducts}
                    style={{ width: '300px' }}
                  />
                </div>
                {values?.collections?.length
                  ? values?.collections.map((item:any, index:number) => {
                    const errText:any = errors?.collections?.length && errors?.collections[index];
                    return (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }} key={item.name}>
                        <h4 className="lable" style={{ width: '135px' }}>{item.name}</h4>
                        <TextField
                          id={item.name}
                          name={item.shopifyId}
                          type="number"
                          placeholder={`Please enter ${item.name}`}
                          value={item.shopifyId}
                          onChange={(e) => handleChangeCollec(e, index)}
                          error={touched?.collections && touched?.collections[index]
                          && touched?.collections[index]?.shopifyId
                          && errors?.collections?.length && errors?.collections[index]
                          && Boolean(errors?.collections[index])}
                          helperText={touched?.collections && touched?.collections[index]
                          && touched?.collections[index]?.shopifyId
                          && errText?.shopifyId}
                          style={{ width: '300px' }}
                        />
                        <IconButton aria-label="delete" color="error" onClick={() => handleRemove(index, item.name)}><CancelOutlinedIcon /></IconButton>
                      </div>
                    );
                  })
                  : '' }
                <Button variant="contained" type="submit" style={{ marginTop: '10px' }} disabled={codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress}>Save</Button>
                <Button variant="contained" style={{ marginTop: '10px', marginLeft: '50px' }} onClick={() => setAddFieldPopup(true)}>Add Section</Button>
                <Button variant="contained" style={{ marginTop: '10px', marginLeft: '50px' }} onClick={() => handleDragColl()} disabled={codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress}>Collection Ids Order</Button>
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
            error={addFieldErr.flag}
            helperText={addFieldErr.msg}
          />
          <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleSave()}>Save</Button>
        </Box>
      </Modal>
      <DropsCollectionIdsDrag dragFlag={dragFlag} close={(ordData: any) => handleOrderSave(ordData)} dropsIds={collectionData} />
    </>
  );
};

Drops.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Drops;
