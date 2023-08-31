/* eslint-disable no-shadow */
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
  useState, useEffect, useContext,
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
  CircularProgress,
} from '@mui/material';
import Footer from '@/components/Footer';
import {
  DEFAULT_DISCOUNT, DROPS_CATEGORY_REMOVE, DROPS_CATEGORY_UPDATE, DROPS_UPDATE, FIND_LATEST_LOG, GET_DROPS_CATEGORY, GET_INVENTORY_BY_ID, GET_STORE_DETAILS, GET_UPDATE_CODES_STATUS, SYNC_DISCOUNT_CODES, DROPS_ACTIVITY, SYNC_COLLECTIONS, GET_UPDATE_COLLECTION_STATUS, GET_APP_LOGGER_DATA_VIA_CONTEXT, GET_DISCOUNT_LOGGER_DATA_VIA_CONTEXT, GET_SYNC_BTN_DATE_VIA_CONTEXT, GET_COLLECTION_LIST,
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
import { BESTSELLERSKEY, CategoryStatus } from 'configs/constant';
import SortableTree from 'react-sortable-tree';
import SectionModal from '@/models/SectionModal';
import CollectionTable from '@/models/CollectionTable';
import RemoveIdsModal from '@/models/RemoveIdsModal';
import Tabs from '@/components/Tabs/tabs';
import { AuthContext } from '@/contexts/auth.context';
import DynamicAuditHistory from '@/components/forms/dynamicAuditHistory';
import CollectionManagement from '@/components/forms/collectionManagement';
import moment from 'moment';
import useAuditLogsQuery from '@/hooks/useAuditLogsQuery';
import useAutoGenerateCollections from '@/hooks/useAutoGenerateCollections';
import DropKlaviyoForm from '../../src/components/forms/klaviyoForm';
import DynamicCartRewards from '../../src/components/forms/dynamicCartRewards';

// eslint-disable-next-line no-shadow
export enum CodeUpdateStatusTypeEnum {
  none = 'none',
  inprogress = 'inprogress',
  completed = 'completed',
}

export enum CollectionStatusTypeEnum {
  PROGRESS = 'PROGRESS',
  COMPLETE = 'COMPLETE',
}

interface CronTime {
  lastAutoSync: string;
  nextAutoSync: string;
  lastCollectionUpdate: string;
}

interface CollectioList {
  collectionTitle: string;
  collectionId: string;
  isSynced: boolean;
  productCount: boolean;
}

const Drops = () => {
  const router = useRouter();
  const currentRoute = router.pathname;
  const { sid } = router.query;
  const { user } = useContext(AuthContext);
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
  const collectionOrderChangeError = 'Please select an active category to create a sub-category.';

  const [storeData, setStoreData] = useState<any>({});
  const [lastSync, setlastsync] = useState<any>(null);
  const [codeUpdateStatus, setcodeUpdateStatus] = useState<CodeUpdateStatusTypeEnum>(CodeUpdateStatusTypeEnum.none);
  const [collectionStatus, setCollectionStatus] = useState<CollectionStatusTypeEnum>(CollectionStatusTypeEnum.COMPLETE);
  const [intervalID, setIntervalID] = useState<any>('');
  const [collectionIntervalID, setCollectionIntervalID] = useState<any>('');
  const [dropsCount, setdropsCount] = useState<number>(0);
  const [sectionData, setSectionData] = useState<any[]>([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [collectionEditData, setCollectionEditData] = useState<any>('');
  const [sectionModal, setSectionModal] = useState<boolean>(false);
  const [notDisable, setnotDisable] = useState<boolean>(false);
  const [deleteIdModal, setDeleteIdModal] = useState<boolean>(false);
  const [removeNavigationMngData, setRemoveNavigationMngData] = useState<any>('');
  const [lastCollectionUpdate, setLastCollectionUpdate] = useState<any>('');
  const [lastAutoSync, setLastAutoSync] = useState<any>('');
  const [syncCollectionButtonDate, setSyncCollectionButtonDate] = useState<any>('');
  const [cronTime, setCronTime] = useState<CronTime>({
    lastCollectionUpdate: '',
    nextAutoSync: '',
    lastAutoSync: '',
  });
  const [cronDiscountTime, setCronDiscountTime] = useState<CronTime>({
    lastCollectionUpdate: '',
    nextAutoSync: '',
    lastAutoSync: '',
  });
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
    codeUpdateStatus: CodeUpdateStatusTypeEnum.none,
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
  const [collectionData, setCollectionData] = useState<CollectioList[]>([]);
  const [latestLogMSG, setlatestLogMSG] = useState<string[]>(['']);
  const [latestLogDate, setlatestLogDate] = useState<string>('');
  const [getByIdFlag, setGetByIdFlag] = useState<string>('');
  const [filters, setFilters] = useState('All Fields');
  const [allCollectionSync, setAllCollectionSync] = useState(false);
  const isDrops = true;

  const {
    auditActivity, activityFilters,
  } = useAuditLogsQuery(currentRoute, sid, filters, isDrops);

  useEffect(() => {
    setActivityLogs(auditActivity);
  }, [auditActivity]);

  const {
    data: getByInventoryId, refetch: getByInventoryIdRefetch, loading: getByInventoryLoading,
  } = useQuery(GET_INVENTORY_BY_ID, {
    skip: !getByIdFlag,
    variables: {
      id: getByIdFlag,
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
  });

  const [syncDiscountCodes, { data: syncDiscountCodesData }] = useMutation<any>(
    SYNC_DISCOUNT_CODES,
    {
      variables: {
        storeId: sid,
        userId: user?.userId,
      },
    },
  );

  const { data: latestLogData, refetch: findLatestLog } = useQuery(FIND_LATEST_LOG, {
    skip: !sid,
    variables: {
      storeId: sid,
      context: 'DROPS_COLLECTION_UPDATED',
    },
    fetchPolicy: 'network-only',
  });

  const [syncCollections, { data: syncCollectionsData }] = useLazyQuery(SYNC_COLLECTIONS, {
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (latestLogData?.findLatestLog) {
      const arr = latestLogData?.findLatestLog.message.split('\n');
      arr.shift();
      setlatestLogMSG(arr);
      setlatestLogDate(moment(latestLogData?.findLatestLog.createdAt).format('LLL'));
    }
  }, [latestLogData]);

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

  // const { data: collectionProgressStatusData, refetch: collectionProgressStatus } = useQuery(GET_UPDATE_COLLECTION_STATUS, {
  //   skip: !sid,
  //   // skip: (!sid && collectionStatus === CollectionStatusTypeEnum.PROGRESS),
  //   variables: {
  //     storeId: sid,
  //   },
  //   fetchPolicy: 'network-only',
  //   onError() {
  //     setCollectionStatus(CollectionStatusTypeEnum.COMPLETE);
  //     clearInterval(collectionIntervalID);
  //   },
  // });

  const [collectionProgressStatus, { data: collectionProgressStatusData }] = useLazyQuery(GET_UPDATE_COLLECTION_STATUS, {
    fetchPolicy: 'network-only',
    onError: () => {
      setCollectionStatus(CollectionStatusTypeEnum.COMPLETE);
      clearInterval(collectionIntervalID);
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

  const { data: autoSyncData } = useQuery(GET_APP_LOGGER_DATA_VIA_CONTEXT, {
    variables: { context: ['SYNC_COLLECTION_CRON', 'COLLECTION_UPDATE_RECEIVE'] },
  });

  const { data: autoSyncDiscoutAfterColUpdate } = useQuery(GET_DISCOUNT_LOGGER_DATA_VIA_CONTEXT, {
    variables: { context: 'SYNC_DISCOUNT_AFTER_COLLECTION_UPDATE' },
  });
  const { data: syncColBtnDate } = useQuery(GET_SYNC_BTN_DATE_VIA_CONTEXT, {
    variables: { context: 'COLLECTIONTOUPDATBULK' },
  });

  const [updateStore, { data: dropsUpdateData, loading: dropsUpdateLoading }] = useMutation<any>(DROPS_UPDATE, {
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
  const {
    autoGenerateCollectionDataInAllProducts,
  } = useAutoGenerateCollections(getDropsCategoryData, setting.settingData);
  // COLLECTION MANAGEMENT CODE START

  useEffect(() => {
    console.log('getStoreData', getStoreData);
  }, [getStoreData]);
  const { shop } = router.query;
  const {
    data, refetch: fetchAgain,
  } = useQuery(
    GET_COLLECTION_LIST,
    {
      variables: {
        shop,
      },
      skip: !shop,
      fetchPolicy: 'network-only',
      notifyOnNetworkStatusChange: true,
    },
  );

  useEffect(() => {
    if (data && getStoreData) {
      const { getCollectionList } = data;
      const collArray = [...getCollectionList.collections, ...getCollectionList.collectionsToUpdate];

      const uniqueArray = collArray.filter((item, index, self) => {
        if (item.productCount <= 0) {
          return false;
        }

        const firstIndex = self.findIndex((i) => i.collectionId === item.collectionId);

        return index === firstIndex;
      });

      const temp = uniqueArray.slice()
        .sort(
          (
            { isSynced: stateA = false },
            { isSynced: stateB = false },
          ) => Number(stateA) - Number(stateB),
        );
      const arr = temp.map((ele) => {
        if (!ele.productCount) {
          return { ...ele, productCount: 0 };
        }
        return ele;
      });
      console.log('🚀 ~ file: index.tsx:321 ~ arr ~ arr:', arr);
      const isAllCollectionSynced = arr.filter((ele) => ele.isSynced === false);
      setAllCollectionSync(!isAllCollectionSynced.length);
      setCollectionData(arr);
    }
  }, [data, getStoreData]);

  // COLLECTION MANAGEMENT CODE END

  useEffect(() => {
    if (autoSyncData) {
      const { getAppLoggerData: { lastAutoSync } } = autoSyncData;
      const autoSyncTImeOriginal = moment(lastAutoSync?.find((ele) => ele.context === 'SYNC_COLLECTION_CRON')?.createdAt);
      const autoSyncTIme = autoSyncTImeOriginal.format('LLL');
      const nextAutoSync = moment(autoSyncTIme).add(1, 'h').format('LLL');
      const temp = lastAutoSync?.find((ele) => ele.context === 'COLLECTION_UPDATE_RECEIVE')?.createdAt;
      const lastCollectionUpdate = temp ? moment(temp).format('LLL') : '-';
      setCronTime({
        lastAutoSync: autoSyncTIme,
        nextAutoSync,
        lastCollectionUpdate,
      });
      setLastAutoSync(autoSyncTIme);
      setLastCollectionUpdate(temp);
    }
  }, [autoSyncData]);
  useEffect(() => {
    if (autoSyncDiscoutAfterColUpdate) {
      const id = autoSyncDiscoutAfterColUpdate.getDiscountLoggerData.id === 'null' ? null : autoSyncDiscoutAfterColUpdate.getDiscountLoggerData.id;
      const lastAutoSync = id
        ? moment(autoSyncDiscoutAfterColUpdate.getDiscountLoggerData.createdAt).format('LLL')
        : '--';
      const nextAutoSync = moment(autoSyncDiscoutAfterColUpdate.getDiscountLoggerData.createdAt).add(1, 'h').format('LLL');
      // const temp = lastAutoSync?.find((ele) => ele.context === 'COLLECTION_UPDATE_RECEIVE')?.createdAt;
      // const lastCollectionUpdate = temp ? moment(temp).format('LLL') : '-';
      setCronDiscountTime({
        lastAutoSync,
        nextAutoSync,
        lastCollectionUpdate: '',
      });
    } else {
      setCronDiscountTime({
        lastAutoSync: '',
        nextAutoSync: '',
        lastCollectionUpdate: '',
      });
    }
  }, [autoSyncDiscoutAfterColUpdate]);

  useEffect(() => {
    if (syncColBtnDate) {
      setSyncCollectionButtonDate(syncColBtnDate.getDiscountLoggerData.createdAt);
    }
  }, [syncColBtnDate]);
  useEffect(() => {
    if (removedDropsCategoryData?.removeDropsCategory) {
      getDropsCategory();
      setSuccessToast({ toastTog: true, toastMessage: removeSectionMessage, toastColor: 'success' });
    }
  }, [removedDropsCategoryData]);

  useEffect(() => {
    if (syncDiscountCodesData?.syncDiscountCodes?.codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress) {
      setcodeUpdateStatus(CodeUpdateStatusTypeEnum.inprogress);
    }
  }, [syncDiscountCodesData]);

  useEffect(() => {
    if (syncCollectionsData?.syncCollection[0]?.status === CollectionStatusTypeEnum.PROGRESS) {
      setCollectionStatus(CollectionStatusTypeEnum.PROGRESS);
    }
  }, [syncCollectionsData]);

  const syncDiscountCodesFun = () => {
    (async () => {
      try {
        await syncDiscountCodes();
      } catch (err) {
        console.log(err);
      }
    })();
  };

  const handleSyncCollections = () => {
    (async () => {
      await syncCollections({ variables: { storeId: sid } });
    })();
  };

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
    } else if (!getDropsCategoryData?.findByStoreId?.length) {
      setSectionData([]);
      setSetting({ flag: false, settingData: '' });
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
        setlastsync(moment(rdata?.getUpdateDiscountStatus?.lastSync).format('LLL'));
        clearInterval(intervalID);
      }
    }
  }, [JSON.stringify(rdata)]);

  useEffect(() => {
    if (collectionProgressStatusData?.getUpdateCollectionStatus?.collectionUpdateStatus === CollectionStatusTypeEnum.COMPLETE) {
      setCollectionStatus(CollectionStatusTypeEnum.COMPLETE);
      clearInterval(collectionIntervalID);
      fetchAgain();
    }
  }, [JSON.stringify(collectionProgressStatusData)]);

  useEffect(() => {
    if (codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress) {
      const myIntervalID = setInterval(progressFunction, 5000);
      setIntervalID(myIntervalID);
    }
  }, [codeUpdateStatus]);

  useEffect(() => {
    if (collectionStatus === CollectionStatusTypeEnum.PROGRESS) {
      const myIntervalID = setInterval(collectionProgressFunction, 5000);
      setCollectionIntervalID(myIntervalID);
    }
  }, [collectionStatus]);

  const progressFunction = () => {
    progressStatus();
  };

  const collectionProgressFunction = () => {
    collectionProgressStatus({ variables: { storeId: sid } });
  };

  const handleForm = (field: string, value: string) => {
    setFieldValue(field, value);
    updateStoreCall();
  };

  useEffect(() => {
    if (getStoreData?.store) {
      setAllCollectionSync(!getStoreData?.store?.collectionsToUpdate.length);
      setlastsync(moment(getStoreData?.store?.drops?.lastSync).format('LLL'));
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
    handleSubmit, values, handleChange, touched, errors, setFieldValue, setFieldError,
  }: FormikProps<DropsForm> = useFormik<DropsForm>({
    initialValues: dropsIds,
    validationSchema,
    enableReinitialize: true,
    validateOnChange: true,
    onSubmit: async (value) => {
      setGetByIdFlag(`gid://shopify/Collection/${value?.bestSellers}`);
      getByInventoryIdRefetch();
    },
  });

  const mileStoneApiCall = async () => {
    try {
      await updateStore({
        variables: {
          updateStoreInput: {
            id: sid,
            userId: user?.userId,
            activity: 'Drops Milestone Management',
            drops: {
              ...storeData?.drops,
              cartRewards: storeData?.drops?.cartRewards ?? [],
              codeUpdateStatus: storeData?.drops?.codeUpdateStatus ?? 'none',
              status: storeData?.drops?.status ?? status,
              collections: [{ name: BESTSELLERSKEY, shopifyId: `gid://shopify/Collection/${values.bestSellers}` }],
              rewards: {
                baseline: `${values.M1Discount}`,
                average: `${values.M2Discount}`,
                maximum: `${values.M3Discount}`,
              },
            },
          },
        },
      });
    } catch (error) {
      console.error('An unexpected error happened:', error);
    }
  };

  useEffect(() => {
    if (getByInventoryId?.findById?.length > 0) {
      mileStoneApiCall();
    } else if (getByInventoryId?.findById?.length < 1) {
      setFieldError('bestSellers', 'Collection ID is either incorrect or not synced.');
    }
  }, [getByInventoryId]);

  const updateStoreCall = async () => {
    await updateStore({
      variables: {
        updateStoreInput: {
          id: sid,
          userId: user?.userId,
          activity: 'Klaviyo Integration',
          drops: {
            ...storeData?.drops,
            codeUpdateStatus: storeData.drops?.codeUpdateStatus ?? CodeUpdateStatusTypeEnum.none,
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
        codeUpdateStatus: storeData.drops?.codeUpdateStatus ?? 0,
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
    }
  }, [dropsUpdateData]);

  const handleChangeStatus = (e: any) => {
    if (getDropsCategoryData?.findByStoreId.find((ele: any) => ele.status === CategoryStatus.ACTIVE) && storeData?.drops?.collections.find((col: any) => col.name === BESTSELLERSKEY)) {
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
          userId: user?.userId,
          drops: {
            ...storeData.drops,
            status: value,
          },
        },
      },
    });
  };

  const handleTreeChange = (newTreeData: any) => {
    setnotDisable(true);
    const tempData = newTreeData.map((ele: any) => {
      if (ele.status === CategoryStatus.DRAFT) {
        if (ele?.children?.length) {
          return false;
        }
        return true;
      }
      return true;
    }).filter((el: any) => el === false).length;
    if (!tempData) {
      setSectionData(newTreeData);
    } else {
      setSuccessToast({
        toastTog: true,
        toastMessage: collectionOrderChangeError,
        toastColor: 'error',
      });
    }
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
        const tempDeleteCateNames = [];
        removeNavigationMngData?.children?.length > 0 && removeNavigationMngData.children.forEach((ele: any) => {
          tempDeleteIds.push(ele.categoryId);
          tempDeleteCateNames.push(ele.title);
        });
        tempDeleteIds.push(removeNavigationMngData.categoryId);
        tempDeleteCateNames.push(removeNavigationMngData.title);
        // LOGS WORK
        let collectionUpdateMsg = `${sid}\n`;
        if (tempDeleteCateNames.length === 1) {
          collectionUpdateMsg = collectionUpdateMsg.concat('', `Removed Category/Subcategory: ${tempDeleteCateNames[0]}`);
        } else {
          collectionUpdateMsg = collectionUpdateMsg.concat('Removed Category and Subcategory/Subcategories: ', tempDeleteCateNames.toString());
        }
        try {
          await removeDropsCategory({
            variables: {
              id: tempDeleteIds,
              userId: user?.userId,
              storeId: sid,
              collectionUpdateMsg,
            },
          }).then(() => {
            findLatestLog();
          });
          const CollectionData = autoGenerateCollectionDataInAllProducts('remove', '', [], removeNavigationMngData.categoryId);
          updateDropsCategory({
            variables: {
              CreateDropsCategoryForFront: {
                id: sid,
                userId: user?.userId,
                activity: 'Drops Navigation Management',
                categoryData: CollectionData,
                collectionUpdateMsg: '',
              },
            },
          }).then(() => { }).catch((err) => {
            console.log(err);
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
    } else if (data === 'visible') {
      setSuccessToast({ toastTog: true, toastMessage: editCollectionMessage, toastColor: 'success' });
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
              userId: user?.userId,
              activity: 'Update Sorting Order',
              categoryData: updatedCategoryData,
            },
          },
        });
      } catch (err) {
        console.log(err);
      }
    })();
  };

  const findLatestLogFun = () => {
    (async () => {
      try {
        await findLatestLog();
      } catch (err) {
        console.log(err);
      }
    })();
  };

  const handleChangeId = (e: any) => {
    setFieldError('shopifyId', '');
    const tempVal = e.target.value.trim();
    if (/^[0-9]+$/.test(tempVal) || !tempVal) {
      setFieldValue(e.target.name, tempVal);
    }
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
      <Container maxWidth="lg" style={{ marginBottom: '35px' }}>
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
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <h4 style={{ whiteSpace: 'nowrap' }}>
                  <>
                    Discount Code Update -
                    {' '}
                    {codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress ? 'In Progress' : 'Completed '}
                    {codeUpdateStatus !== CodeUpdateStatusTypeEnum.inprogress && lastSync ? `(${lastSync})` : ''}
                    {codeUpdateStatus !== CodeUpdateStatusTypeEnum.inprogress && dropsCount ? `(${dropsCount})` : ''}

                  </>
                </h4>
                <Button
                  variant="contained"
                  disabled={!!(codeUpdateStatus === CodeUpdateStatusTypeEnum.inprogress || (latestLogDate < lastSync))}
                  // cronDiscountTime.lastAutoSync
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                  onClick={syncDiscountCodesFun}
                >
                  Sync Discount Codes

                </Button>
              </div>
              <div>
                <h4>
                  Last discount code auto synced on:
                  {' '}
                  {cronDiscountTime.lastAutoSync}

                </h4>
                <h4>
                  <>
                    Next discount code auto sync on:
                    {' '}
                    {cronDiscountTime.nextAutoSync}
                  </>
                </h4>

              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4 style={{ whiteSpace: 'nowrap' }}>
                    <>
                      Last update in collection ids
                      {latestLogDate ? ` - (${latestLogDate})` : ''}
                    </>
                  </h4>
                </div>
                <p>{latestLogMSG.map((m) => <div key={m}>{m}</div>)}</p>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg" style={{ marginBottom: '20px' }}>
        <Grid
          container
          direction="row"
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>
            <Card style={{ padding: '10px 20px' }}>
              {collectionStatus === CollectionStatusTypeEnum.PROGRESS && <LinearIndeterminate />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                <Grid xs={8}>
                  <h4>
                    Last collection auto synced on:
                    {' '}
                    {cronTime.lastAutoSync ?? '-'}
                  </h4>
                  <h4>
                    Next collection auto sync on:
                    {' '}
                    {cronTime.nextAutoSync ?? '-'}
                  </h4>
                  <h4>
                    Last collection update recieved on:
                    {' '}
                    {cronTime.lastCollectionUpdate ?? '-'}
                  </h4>
                  <h4>
                    Manual Sync Collection:
                    {' '}
                    {moment(syncCollectionButtonDate).format('LLL') ?? '-'}
                  </h4>
                </Grid>
                <Button
                  variant="contained"
                  disabled={!!(collectionStatus === CollectionStatusTypeEnum.PROGRESS || (new Date(lastCollectionUpdate).getTime() < new Date(lastAutoSync).getTime()) || (syncCollectionButtonDate > lastCollectionUpdate && syncCollectionButtonDate > lastAutoSync) || allCollectionSync)}
                  style={{ marginTop: '10px', marginBottom: '10px' }}
                  onClick={handleSyncCollections}
                >
                  Sync Collections
                </Button>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Milestone management',
              value: '1',
              component:
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
            placeholder="Please enter Bestseller"
            value={values.bestSellers}
            onChange={(e) => handleChangeId(e)}
            error={touched.M3Discount && Boolean(errors.bestSellers)}
            helperText={touched.bestSellers && errors.bestSellers}
            style={{ width: '300px' }}
            autoComplete="off"
          />
        </div>
        <Button variant="contained" style={{ marginTop: '10px', height: '40px', width: '75px' }} type="submit">
          {(getByInventoryLoading || dropsUpdateLoading) ? <CircularProgress style={{ color: '#ffffff' }} size="0.875rem" /> : 'Save'}
        </Button>
      </Card>
    </form>
  </Grid>,
            },
            {
              label: 'Klaviyo Integration',
              value: '2',
              component:
  <Grid item xs={6}>
    <DropKlaviyoForm
      storeData={storeData}
      setSubscriberListId={setSubscriberListId}
      setFieldValue={setFieldValue}
      handleForm={handleForm}
    />
  </Grid>,
            },
            {
              label: 'Navigation management',
              value: '3',
              component:
  <Grid container spacing={2}>
    <Grid item xs={6}>
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
        {sectionData.length && notDisable ? <Button variant="contained" style={{ marginTop: '10px', marginLeft: '10px' }} onClick={() => handleSectionSave()}>Update Sorting Order</Button> : ''}
      </Card>
    </Grid>
    <Grid item xs={6}>
      {setting.flag ? <CollectionTable settingData={setting.settingData} saveData={(data: string) => handleSaveCollectionId(data)} findLatestLog={findLatestLogFun} userRole={user?.userId} /> : ''}
    </Grid>
  </Grid>,
            },
            {
              label: 'Cart Rewards management',
              value: '4',
              component:
  <Grid item xs={6}>
    <DynamicCartRewards storeData={storeData} getStore={refetch} showToast={setSuccessToast} userRole={user?.userId} />
  </Grid>,
            },
            {
              label: 'Collection Management',
              value: '5',
              component:
  <Grid item xs={6}>
    <CollectionManagement data={collectionData} />
  </Grid>,
            },
            {
              label: 'Audit Logs',
              value: '6',
              component:
  <Grid item xs={6}>
    <DynamicAuditHistory activityLogs={activityLogs} setfilters={setFilters} filters={filters} activityFilters={activityFilters} />
  </Grid>,
            },
          ]}
        />
      </Container>
      <Footer />
      {sectionModal ? <SectionModal show={sectionModal} close={(data: any) => handleSectionModal(data)} sectionData={sectionData} collectionEditData={collectionEditData} userRole={user?.userId} /> : ''}
      {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(data: any) => hanleRemove(data)} childData={removeNavigationMngData?.children} removedDropsCategoryLoading={removedDropsCategoryLoading} /> : ''}
    </>
  );
};

Drops.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Drops;
