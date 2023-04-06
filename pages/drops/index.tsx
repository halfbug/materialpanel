/* eslint-disable no-unused-expressions */
/* eslint-disable no-param-reassign */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable @next/next/no-img-element */
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
} from '@mui/material';
import Footer from '@/components/Footer';
import {
  DEFAULT_DISCOUNT, DROPS_CATEGORY_REMOVE, DROPS_CATEGORY_UPDATE, DROPS_UPDATE, GET_DROPS_CATEGORY, GET_STORE_DETAILS, GET_UPDATE_CODES_STATUS,
} from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import { useRouter } from 'next/router';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { useFormik, FormikProps } from 'formik';
import * as yup from 'yup';
import { DropsForm } from '@/types/groupshop';
import IconButton from '@mui/material/IconButton';
import LinearIndeterminate from '@/components/Progress/Linear';
import { BESTSELLERSKEY, CategoryStatus } from 'configs/constant';
import getDMYFormatedDate from '@/utils/getDMYFormatedDate';
import SortableTree from 'react-sortable-tree';
import SectionModal from '@/models/SectionModal';
import { v4 as uuid } from 'uuid';
import CollectionTable from '@/models/CollectionTable';
import RemoveIdsModal from '@/models/RemoveIdsModal';
import DropKlaviyoForm from '../components/forms/klaviyoForm';

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
  const addSectionMessage = 'Section added successfully';
  const updateSectionMessage = 'Section updated successfully';
  const removeSectionMessage = 'Section removed successfully';
  const sectionOrderMessage = 'Section sorting order updated successfully';
  const addCollectionMessage = 'Collection added successfully';
  const editCollectionMessage = 'Collection updated successfully';
  const removeCollectionMessage = 'Collection removed successfully';
  const collectionOrderMessage = 'Collection sorting order updated successfully';

  const [storeData, setStoreData] = useState<any>({});
  const [lastSync, setlastsync] = useState<any>(null);
  const [codeUpdateStatus, setcodeUpdateStatus] = useState<CodeUpdateStatusTypeEnum>(CodeUpdateStatusTypeEnum.none);
  const [intervalID, setIntervalID] = useState<any>('');
  const [dropsCount, setdropsCount] = useState<number>(0);
  const [sectionData, setSectionData] = useState<any[]>([]);
  const [collectionEditData, setCollectionEditData] = useState<any>('');
  const [sectionModal, setSectionModal] = useState<boolean>(false);
  const [deleteIdModal, setDeleteIdModal] = useState<boolean>(false);
  const [removeNavigationMngData, setRemoveNavigationMngData] = useState<any>('');
  const [setting, setSetting] = useState<any>({
    flag: false,
    settingData: '',
  });
  const [dropsIds, setDropsIds] = useState<any>({
    M1Discount: '',
    M2Discount: '',
    M3Discount: '',
    bestSellers: '',
    publicKey: '',
    privateKey: '',
    listId: '',
    subscriberListId: '',
    signup1: '',
    signup2: '',
    signup3: '',
    signup4: '',
  });
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
    toastColor: '',
  });
  const [status, setStatus] = useState<string>('');
  const [subscriberListId, setSubscriberListId] = useState('');

  const { data: rdata, refetch: progressStatus } = useQuery(GET_UPDATE_CODES_STATUS, {
    skip: !sid,
    variables: {
      storeId: sid,
    },
    fetchPolicy: 'network-only',
    onError() {
      setcodeUpdateStatus(CodeUpdateStatusTypeEnum.none);
      clearInterval(intervalID);
    },
  });

  const {
    data: getStoreData, refetch,
  } = useQuery(GET_STORE_DETAILS, {
    skip: !sid,
    variables: { id: sid },
    fetchPolicy: 'network-only',
  });

  const { data: findDrops } = useQuery(DEFAULT_DISCOUNT, {
    variables: { type: 'drops' },
  });

  const [updateStore, { data: dropsUpdateData }] = useMutation<any>(DROPS_UPDATE, {
    fetchPolicy: 'network-only',
  });

  const [updateDropsCategory, { data: updatedDropsCategoryData }] = useMutation<any>(
    DROPS_CATEGORY_UPDATE,
  );

  const [removeDropsCategory, { data: removedDropsCategoryData, loading: removedDropsCategoryLoading }] = useMutation<any>(
    DROPS_CATEGORY_REMOVE,
  );

  const {
    data: getDropsCategoryData, refetch: getDropsCategory,
  } = useQuery(GET_DROPS_CATEGORY, {
    skip: !sid,
    variables: { storeId: sid },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (removedDropsCategoryData?.removeDropsCategory) {
      getDropsCategory();
      setSuccessToast({ toastTog: true, toastMessage: removeSectionMessage, toastColor: 'success' });
    }
  }, [removedDropsCategoryData]);

  useEffect(() => {
    if (getDropsCategoryData?.findByStoreId?.length > 0) {
      const parentData = getDropsCategoryData.findByStoreId.filter((el: any) => !el.parentId).sort((a: any, b: any) => a.sortOrder - b.sortOrder);
      setSectionData(parentData.map((ele: any) => ({
        ...ele,
        expanded: true,
        children: getDropsCategoryData.findByStoreId.filter((child: any) => child.parentId === ele.categoryId).sort((a: any, b: any) => a.sortOrder - b.sortOrder),
      })));
      const settingDataFind = getDropsCategoryData?.findByStoreId?.find((ele: any) => ele?.categoryId === setting?.settingData?.categoryId);
      if (setting.flag && settingDataFind) {
        setSetting({ ...setting, settingData: settingDataFind });
      } else {
        setSetting({ flag: false, settingData: '' });
      }
    }
  }, [getDropsCategoryData]);

  useEffect(() => {
    if (updatedDropsCategoryData?.updateDropsCategory?.length > 0) {
      setSuccessToast({ toastTog: true, toastMessage: sectionOrderMessage, toastColor: 'success' });
      getDropsCategory();
    }
  }, [updatedDropsCategoryData]);

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

  const handleForm = (field: string, value: string) => {
    setFieldValue(field, value);
    updateStoreCall();
  };

  useEffect(() => {
    if (getStoreData?.store) {
      setlastsync(getDMYFormatedDate(getStoreData?.store?.drops?.lastSync));
      setdropsCount(getStoreData?.store?.drops?.dropsCount ?? 0);
      setcodeUpdateStatus(getStoreData?.store?.drops?.codeUpdateStatus ?? CodeUpdateStatusTypeEnum.none);
      setStoreData(getStoreData?.store);
    }
  }, [getStoreData]);

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
    bestSellers: yup
      .string()
      .required('Bestseller is required'),
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
                codeUpdateStatus: storeData?.drops?.codeUpdateStatus ?? 'none',
                status: storeData?.drops?.status ?? status,
                collections: [{ name: BESTSELLERSKEY, shopifyId: `gid://shopify/Collection/${value.bestSellers}` }],
                rewards: {
                  baseline: `${value.M1Discount}`,
                  average: `${value.M2Discount}`,
                  maximum: `${value.M3Discount}`,
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

  const updateStoreCall = async () => {
    await updateStore({
      variables: {
        updateStoreInput: {
          id: sid,
          drops: {
            ...storeData?.drops,
            klaviyo: {
              publicKey: values.publicKey,
              privateKey: values.privateKey,
              listId: values.listId,
              subscriberListId,
              signup1: values.signup1,
              signup2: values.signup2,
              signup3: values.signup3,
              signup4: values.signup4,
            },
          },
        },
      },
    });
  };

  useEffect(() => {
    if (storeData && sid) {
      setDropsIds({
        ...dropsIds,
        M1Discount: storeData.drops?.rewards?.baseline ?? findDrops?.findDrops?.details.baseline,
        M2Discount: storeData.drops?.rewards?.average ?? findDrops?.findDrops?.details.average,
        M3Discount: storeData.drops?.rewards?.maximum ?? findDrops?.findDrops?.details.maximum,
        bestSellers: storeData?.drops?.collections?.find((ele: any) => ele.name === BESTSELLERSKEY)?.shopifyId?.split('/')[4],
        publicKey: storeData.drops?.klaviyo?.publicKey,
        privateKey: storeData.drops?.klaviyo?.privateKey,
        listId: storeData.drops?.klaviyo?.listId,
        subscriberListId: storeData.drops?.klaviyo?.subscriberListId ?? subscriberListId,
        signup1: storeData.drops?.klaviyo?.signup1,
        signup2: storeData.drops?.klaviyo?.signup2,
        signup3: storeData.drops?.klaviyo?.signup3,
        signup4: storeData.drops?.klaviyo?.signup4,
      });
      setStatus(storeData.drops?.status ? storeData.drops.status : 'InActive');
    }
  }, [storeData, findDrops]);

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      refetch();
      setSuccessToast({ toastTog: true, toastMessage: dropsUpdatedMessage, toastColor: 'success' });
      if (dropsUpdateData?.updateStore?.drops?.codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress) {
        setcodeUpdateStatus(CodeUpdateStatusTypeEnum.inprogress);
      }
    }
  }, [dropsUpdateData]);

  const handleChangeStatus = (e: any) => {
    if (getDropsCategoryData?.findByStoreId.find((ele: any) => ele.status === CategoryStatus.ACTIVE)) {
      if (e.target.value === '1') {
        setStatus('Active');
        updateStatus('Active');
      } else {
        setStatus('InActive');
        updateStatus('InActive');
      }
    } else {
      setSuccessToast({ toastTog: true, toastMessage: dropsUpdatedError, toastColor: 'error' });
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

  const handleTreeChange = (newTreeData: any) => {
    setSectionData(newTreeData);
  };

  useEffect(() => () => {
    setSectionData([]);
  }, []);

  const handleSectionModal = (data: any) => {
    if (data) {
      if (data === 'Add') {
        setSuccessToast({ toastTog: true, toastMessage: addSectionMessage, toastColor: 'success' });
      } else if (data === 'Edit') {
        setSuccessToast({ toastTog: true, toastMessage: updateSectionMessage, toastColor: 'success' });
      }
      getDropsCategory();
    }
    setCollectionEditData('');
    setSectionModal(false);
  };

  const handleRemoveNavigation = (data: any) => {
    setRemoveNavigationMngData(data);
    setDeleteIdModal(true);
  };

  const hanleRemove = (data: any) => {
    (async () => {
      if (data === 'delete') {
        const tempDeleteIds = [];
        removeNavigationMngData?.children?.length > 0 && removeNavigationMngData.children.forEach((ele: any) => tempDeleteIds.push(ele.categoryId));
        tempDeleteIds.push(removeNavigationMngData.categoryId);
        try {
          await removeDropsCategory({
            variables: {
              id: tempDeleteIds,
            },
          });
        } catch (err) {
          console.log(err);
        }
      }
      setRemoveNavigationMngData('');
      setDeleteIdModal(false);
    })();
  };

  const handleSaveCollectionId = (data: string) => {
    if (data === 'edit') {
      setSuccessToast({ toastTog: true, toastMessage: editCollectionMessage, toastColor: 'success' });
    } else if (data === 'delete') {
      setSuccessToast({ toastTog: true, toastMessage: removeCollectionMessage, toastColor: 'success' });
    } else if (data === 'add') {
      setSuccessToast({ toastTog: true, toastMessage: addCollectionMessage, toastColor: 'success' });
    } else if (data === 'updateOrder') {
      setSuccessToast({ toastTog: true, toastMessage: collectionOrderMessage, toastColor: 'success' });
    }
    getDropsCategory();
  };

  const handleSectionSave = () => {
    (async () => {
      const tempData = sectionData.map((el: any, i: number) => ({
        ...el,
        sortOrder: i + 1,
        children: el?.children?.length > 0 ? el.children.map((child: any, index: number) => ({
          ...child,
          sortOrder: index + 1,
        })) : [],
      }));
      const updatedCategoryData = [];
      tempData.forEach((item) => {
        item.children.forEach((ell: any) => {
          delete ell.children;
          delete ell.expanded;
          updatedCategoryData.push({ ...ell, parentId: item.categoryId });
        });
        delete item.children;
        delete item.expanded;
        updatedCategoryData.push({ ...item, parentId: null });
      });
      try {
        await updateDropsCategory({
          variables: {
            CreateDropsCategoryForFront: {
              id: sid,
              categoryData: updatedCategoryData,
            },
          },
        });
      } catch (err) {
        console.log(err);
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
          <Grid item xs={6}>
            <form noValidate onSubmit={handleSubmit}>
              <h2 style={{ alignItems: 'center' }}>Drops Milestone Management</h2>
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
                  <h4 className="lable" style={{ width: '135px' }}>Bestsellers</h4>
                  <TextField
                    id="bestSellers"
                    name="bestSellers"
                    type="number"
                    placeholder="Please enter Bestseller"
                    value={values.bestSellers}
                    onChange={handleChange}
                    error={touched.M3Discount && Boolean(errors.bestSellers)}
                    helperText={touched.bestSellers && errors.bestSellers}
                    style={{ width: '300px' }}
                  />
                </div>
                <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => handleSubmit()}>Save</Button>
              </Card>
              <h2>Drops Navigation Management</h2>
              <Card style={{ padding: '20px' }}>
                <div style={{ display: 'flex', maxHeight: '550px', overflow: 'auto' }}>
                  <SortableTree
                    treeData={sectionData}
                    onChange={handleTreeChange}
                    isVirtualized={false}
                    maxDepth={2}
                    generateNodeProps={({ node }: any) => ({
                      className: node.status === CategoryStatus.DRAFT ? 'default' : 'success',
                      buttons: [
                        <div className="section_navigation" style={{ display: 'flex', alignItems: 'center' }}>
                          <div tabIndex={0} role="button" onClick={() => setSetting({ flag: true, settingData: node })}>
                            <IconButton aria-label="delete"><img src="/settings.svg" alt="setting" /></IconButton>
                          </div>
                          <div>
                            <IconButton aria-label="delete" color="error" onClick={() => handleRemoveNavigation(node)}><img src="/close.svg" alt="close" /></IconButton>
                          </div>
                          <div>
                            <IconButton aria-label="delete" onClick={() => { setCollectionEditData(node); setSectionModal(true); }}><img src="/edit.svg" alt="edit" /></IconButton>
                          </div>
                        </div>,
                      ],
                    })}
                  />
                </div>
                <Button variant="contained" style={{ marginTop: '10px' }} onClick={() => setSectionModal(true)}>Add Navigation</Button>
                {sectionData.length ? <Button variant="contained" style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => handleSectionSave()}>Update Sorting Order</Button> : ''}
              </Card>
            </form>
          </Grid>

          <Grid item xs={6}>
            <DropKlaviyoForm
              storeData={storeData}
              setSubscriberListId={setSubscriberListId}
              setFieldValue={setFieldValue}
              handleForm={handleForm}
            />
            { setting.flag ? <CollectionTable settingData={setting.settingData} saveData={(data: string) => handleSaveCollectionId(data)} /> : '' }
          </Grid>
        </Grid>
      </Container>
      <Footer />
      <SectionModal show={sectionModal} close={(data: any) => handleSectionModal(data)} sectionData={sectionData} collectionEditData={collectionEditData} />
      {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(data: any) => hanleRemove(data)} childData={removeNavigationMngData?.children} removedDropsCategoryLoading={removedDropsCategoryLoading} /> : ''}
    </>
  );
};

Drops.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Drops;
