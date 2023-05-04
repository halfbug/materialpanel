/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-undef */
/* eslint-disable max-len */
import LinearIndeterminate from '@/components/Progress/Linear';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { UPDATE_ADMIN_USER } from '@/graphql/store.graphql';
import usePermission from '@/hooks/usePermission';
import { StoreContext } from '@/store/store.context';
import { useMutation } from '@apollo/client';
import { Dashboard, RemoveRedEyeOutlined, VideoCameraFront } from '@mui/icons-material';
import { Card, Grid, IconButton } from '@mui/material';
import React, { useState, useEffect, useContext } from 'react';

const FavouriteStore = ({
  stores, loading, changeTab,
}: any) => {
  const { userPermissions } = usePermission();
  const { store, dispatch } = useContext(StoreContext);

  const [favouriteStore, setFavouriteStore] = useState<any>([]);

  const [adminUserUpdate, { data: updatedAdminUserData }] = useMutation<any>(UPDATE_ADMIN_USER);

  useEffect(() => {
    if (updatedAdminUserData?.updateAdminUser) {
      dispatch({ type: 'USER_DATA', payload: updatedAdminUserData?.updateAdminUser });
      if (!updatedAdminUserData?.updateAdminUser?.favouriteStore.length) {
        changeTab('1');
      }
    }
  }, [updatedAdminUserData]);

  useEffect(() => {
    if (stores && store?.userData) {
      const tempFavStore = stores?.filter((ele: any) => store.userData?.favouriteStore?.includes(ele?.id));
      setFavouriteStore(tempFavStore);
    }
  }, [stores, store]);

  const headCells: Array<HeadCell<typeof stores>> = [
    {
      id: 'shop',
      disablePadding: false,
      label: '',
      type: 'custom',
      options: [
        { favourite: true, callback: (eData: any) => handleRemoveFavourite(eData) },
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
      options: [
        { btn: <IconButton aria-label="delete" color="primary"><Dashboard /></IconButton>, link: '/merchant/load-dashboard', target: '_blank' },
        { btn: <IconButton aria-label="delete" color="primary"><VideoCameraFront /></IconButton>, link: '/store/videoupload' },
        { btn: <IconButton aria-label="delete" color="primary"><RemoveRedEyeOutlined /></IconButton>, link: '/discoverytools' },
        { btn: '', link: '/drops', changeIcon: true },
      ],
    },
  ];
  const [columnData, setColumnData] = useState(headCells);

  const handleRemoveFavourite = (data: any) => {
    (async () => {
      const FavStoreData = store?.userData?.favouriteStore?.filter((favStore: any) => favStore !== data.id);
      await adminUserUpdate({
        variables: {
          updateAdminUserInput: {
            id: store?.userData?.id,
            favouriteStore: FavStoreData,
          },
        },
      });
    })();
  };

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

  return (
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

          <EnhancedTable headCells={columnData ?? []} rows={favouriteStore} orderByFieldName="brandName" allUser={store?.userData?.favouriteStore} />
        </Card>
      </Grid>
    </Grid>
  );
};

export default FavouriteStore;
