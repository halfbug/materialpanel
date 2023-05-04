/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable max-len */
import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, Box, Tab,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ALL_STORES, ALL_USERS, UPDATE_ADMIN_USER } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import {
  Dashboard, RemoveRedEyeOutlined, VideoCameraFront,
} from '@mui/icons-material';
// import { IStore } from '@/types/groupshop';
import { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import usePermission from '@/hooks/usePermission';
import { TabContext, TabList, TabPanel } from '@mui/lab';
import { AuthContext } from '@/contexts/auth.context';
import { StoreContext } from '@/store/store.context';
import FavouriteStore from './FavouriteStore';

interface THeader {
  id: string;

}
const StoreList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const { userPermissions } = usePermission();
  const { user } = useContext(AuthContext);
  const { store, dispatch } = useContext(StoreContext);
  // console.log('merchant', userPermission);

  const [tab, setTab] = useState<string>('1');

  const {
    loading, data, error, refetch,
  } = useQuery(ALL_STORES);

  const {
    data: allUserData, refetch: getAllUser,
  } = useQuery(ALL_USERS);

  const [adminUserUpdate, { data: updatedAdminUserData }] = useMutation<any>(UPDATE_ADMIN_USER);

  useEffect(() => {
    refetch();
    getAllUser();
  }, []);

  useEffect(() => {
    if (updatedAdminUserData?.updateAdminUser) {
      dispatch({ type: 'USER_DATA', payload: updatedAdminUserData?.updateAdminUser });
    }
  }, [updatedAdminUserData]);

  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ data', data);
  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ loading', loading);
  console.log('🚀 ~ file: index.tsx ~ line 27 ~ meta', meta);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headCells: Array<HeadCell<typeof data>> = [
    {
      id: 'shop',
      disablePadding: false,
      label: '',
      type: 'custom',
      options: [
        { favourite: true, callback: (fData: any) => handleUserFav(fData, store?.userData) },
      ],
    },
    {
      id: 'shop',
      disablePadding: false,
      label: 'Store Name',
    },
    {
      id: 'brandName',
      disablePadding: false,
      label: 'brand Name',
    },
    {
      id: 'createdAt',
      type: 'timestamp',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'planResetDate',
      type: 'datetime',
      disablePadding: false,
      label: 'Plan Reset',
    },
    {
      id: 'status',
      disablePadding: false,
      type: 'status',
      statusOptions: { error: ['uninstalled'], success: ['active'], warning: ['inActive'] },
      label: 'Status',
    },
    {
      id: 'subscription.status',
      disablePadding: false,
      type: 'status',
      statusOptions: { error: ['declined'], success: ['active', 'zero trial'], warning: ['pending'] },
      label: 'Billing',
    },
    {
      id: 'options',
      disablePadding: false,
      type: 'custom',
      label: 'options',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-return-await
      options: [
        { btn: <IconButton aria-label="delete" color="primary"><Dashboard /></IconButton>, link: '/merchant/load-dashboard', target: '_blank' }, // { icon: <Dashboard />, callback: loginStore, perm: 'shop' },
        { btn: <IconButton aria-label="delete" color="primary"><VideoCameraFront /></IconButton>, link: '/store/videoupload' },
        { btn: <IconButton aria-label="delete" color="primary"><RemoveRedEyeOutlined /></IconButton>, link: '/discoverytools' },
        { btn: '', link: '/drops', changeIcon: true },
      ],
    },
  ];
  const [columnData, setColumnData] = useState(headCells);

  useEffect(() => {
    setColumnData(headCells);
  }, [userPermissions, store?.userData]);

  useEffect(() => {
    if (columnData.length > 0 && !!userPermissions) {
      const optionHead = headCells[7].options;
      if (!userPermissions.includes('/drops')) {
        optionHead.splice(4, 1);
      }
      if (!userPermissions.includes('/discoverytools')) {
        optionHead.splice(3, 1);
      }
      if (!userPermissions.includes('/store/videoupload')) {
        optionHead.splice(2, 1);
      }
      if (!userPermissions.includes('/merchant/load-dashboard')) {
        optionHead.splice(1, 1);
      }
      if (columnData[7].options.length < 1) {
        columnData[7].options = optionHead;
        setColumnData([...columnData]);
      }
    }
  }, [columnData, userPermissions]);

  const handleChangeTab = (_: any, newValue: any) => {
    setTab(newValue);
  };

  useEffect(() => {
    if (allUserData?.getAdminUsers) {
      const tempFavStore = allUserData.getAdminUsers?.find((ele: any) => ele?.email === user?.email);
      dispatch({ type: 'USER_DATA', payload: tempFavStore });
      setColumnData(headCells);
    }
  }, [allUserData, user]);

  const handleUserFav = (fav: any, userFavStore: any) => {
    (async () => {
      if (userFavStore) {
        let FavStoreData = [];
        if (userFavStore?.favouriteStore) {
          if (userFavStore?.favouriteStore.includes(fav.id)) {
            FavStoreData = userFavStore.favouriteStore.filter((favStore: any) => favStore !== fav.id);
          } else {
            FavStoreData = [...userFavStore.favouriteStore, fav.id];
          }
        } else {
          FavStoreData = [fav.id];
        }
        await adminUserUpdate({
          variables: {
            updateAdminUserInput: {
              id: userFavStore.id,
              favouriteStore: FavStoreData,
            },
          },
        });
      }
    })();
  };

  return (
    <>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader meta={meta} pagetitle="" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={tab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
                <Tab label="All Store" value="1" />
                <Tab label="Favourite Store" value="2" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Grid
                container
                direction="row"
                justifyContent="center"
                alignItems="stretch"
                spacing={3}
                style={{ marginTop: '10px' }}
              >
                <Grid item xs={12}>

                  <Card sx={{ padding: 3 }}>
                    {loading && <LinearIndeterminate />}
                    <EnhancedTable headCells={columnData ?? []} rows={data?.stores ?? []} orderByFieldName="brandName" allUser={store?.userData?.favouriteStore} />
                  </Card>
                </Grid>
              </Grid>
            </TabPanel>
            <TabPanel value="2">
              <FavouriteStore stores={data?.stores ?? []} loading={loading} changeTab={setTab} />
            </TabPanel>
          </TabContext>
        </Box>
      </Container>
      <Footer />
    </>
  );
};

StoreList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default StoreList;
export const getServerSideProps = async (context: any) => {
  const url = `${process.env.API_URL}/billing-status`;
  const requestOptions = {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const res = await fetch(url, requestOptions);
  const resJson = await res.json();
  console.log('🚀 ~ file: index.tsx ~ line 116 ~ getServerSideProps ~ resJson', resJson);
  return {
    props: {
      // meta: { billingStatus: false },
      meta: { billingStatus: resJson.billingStatus !== 'false' },
    },
  };
};
