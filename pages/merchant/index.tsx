/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable max-len */
// import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, Box, Tab, Typography, Alert, Button,

} from '@mui/material';
// import Alert from '@mui/joy/Alert';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import NotificationsNoneTwoToneIcon from '@mui/icons-material/NotificationsNoneTwoTone';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ALL_STORES, ALL_USERS, UPDATE_ADMIN_USER } from '@/graphql/store.graphql';
import { useMutation, useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import {
  Dashboard, RemoveRedEyeOutlined, VideoCameraFront, AlarmOn,
} from '@mui/icons-material';
// import { IStore } from '@/types/groupshop';
import { NextPage } from 'next';
import { useContext, useEffect, useState } from 'react';
import usePermission from '@/hooks/usePermission';
import { AuthContext } from '@/contexts/auth.context';
import { StoreContext } from '@/store/store.context';
import Tabs from '@/components/Tabs/tabs';
import FavouriteStore from './FavouriteStore';

interface THeader {
  id: string;

}
const StoreList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const { userPermissions } = usePermission();
  const { user } = useContext(AuthContext);
  const { store, dispatch } = useContext(StoreContext);
  // console.log('merchant', userPermission);

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
        <Grid
          container
          direction="row"
          justifyContent="start"
          alignItems="center"
          spacing={1}
          mb={0}
          style={{ marginTop: '10px' }}
        >
          <Grid
            item
            xs={12}
            mb={1}
            direction="row"
            justifyContent="start"
            alignItems="center"
          >
            {/* <Button color="success" variant="contained" startIcon={<NotificationsActiveIcon />}>
              Live Alert
            </Button> */}
            <IconButton size="medium" >
              <NotificationsActiveIcon
                color="success"
              />
              <Typography variant="h4" sx={{ my: 2 }} ml={2}>
                Live Alert
              </Typography>
              <Typography ml={1} color="neutral" fontSize="xs">(5)</Typography>
            </IconButton>
          </Grid>

          <Container maxWidth="lg">
            <Tabs
              tabList={[
                {
                  label: 'Active Store (4)',
                  value: '1',
                  component:
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
        <Typography variant="h4" sx={{ my: 2 }} ml={2}>
          Active Store
        </Typography>
      </Card>
    </Grid>
  </Grid>,
                },

                {
                  label: 'Billing Status (1)',
                  value: '2',
                  component:
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
        <Typography variant="h4" sx={{ my: 2 }} ml={2}>
          Billing Status of Stores
        </Typography>
        <Alert severity={meta.billingStatus ? 'info' : 'warning'}>
          Billing status is
          {' '}
          {meta.billingStatus ? 'true' : 'false'}
          !
        </Alert>
        {' '}
        {' '}

      </Card>
    </Grid>
  </Grid>,
                },

                {
                  label: 'New Drops (0) ',
                  value: '3',
                  component:
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
        <Typography variant="h4" sx={{ my: 2 }} ml={2}>
          New Drops
        </Typography>
      </Card>
    </Grid>
  </Grid>,
                },

                {
                  label: 'Discount Code (0)',
                  value: '4',
                  component:
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
        <Typography variant="h4" sx={{ my: 2 }} ml={2}>
          Discount Code
        </Typography>
      </Card>
    </Grid>
  </Grid>,
                },
              ]}
            />
          </Container>
        </Grid>
      </Container>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'All Store',
              value: '1',
              component:
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
  </Grid>,
            },
            {
              label: 'Favourite Store',
              value: '2',
              component: <FavouriteStore stores={data?.stores ?? []} loading={loading} />,
            },
          ]}
        />
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
