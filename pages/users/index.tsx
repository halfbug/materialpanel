/* eslint-disable @typescript-eslint/no-floating-promises */
import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, Snackbar, Alert,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ADMIN_ACTIVITY, ALL_USERS, REMOVE_USER } from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import {
  Dashboard, DeleteForeverOutlined, EditRounded,
} from '@mui/icons-material';
// import { IStore } from '@/types/groupshop';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState, useContext } from 'react';
import usePermission from '@/hooks/usePermission';
import { useRouter } from 'next/router';
import useAuditLogsQuery from '@/hooks/useAuditLogsQuery';
import RemoveIdsModal from '@/models/RemoveIdsModal';
import { StoreContext } from '@/store/store.context';
import Tabs from '@/components/Tabs/tabs';
import { AuthContext } from '@/contexts/auth.context';
import DynamicAuditHistory from '@/components/forms/dynamicAuditHistory';

const UserList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const { dispatch, store } = useContext(StoreContext);
  const [deleteIdModal, setDeleteIdModal] = useState(false);
  const [columnData, setColumnData] = useState([]);
  const [filters, setFilters] = useState('All Fields');
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });

  const { user: cuser } = useContext(AuthContext);
  const isDrops = false;
  const router = useRouter();
  const currentRoute = router.pathname;
  const { userPermissions } = usePermission();
  const {
    loading, data, error, refetch,
  } = useQuery(ALL_USERS);

  const [removeAdminUser, {
    data: updatedDropsCategoryData,
    loading: removeAdminUserLoading,
  }] = useMutation<any>(
    REMOVE_USER,
  );

  useEffect(() => {
    refetch();
  }, []);

  const {
    auditActivity, activityFilters,
  } = useAuditLogsQuery(currentRoute, '', filters, isDrops);

  useEffect(() => {
    setActivityLogs(auditActivity);
  }, [auditActivity]);

  const optionData = () => {
    const tempOption = [];
    if (userPermissions?.includes('/users/edit')) {
      tempOption.push({ btn: <IconButton aria-label="delete" color="primary"><EditRounded /></IconButton>, link: '/users/edit' });
    }
    if (userPermissions?.includes('/users/delete')) {
      tempOption.push({ removeUser: <IconButton aria-label="delete" color="primary" onClick={() => setDeleteIdModal(true)}><DeleteForeverOutlined /></IconButton> });
    }
    return tempOption;
  };

  const headCells: Array<HeadCell<typeof data>> = [
    {
      id: 'firstName',
      disablePadding: false,
      label: 'First Name',
    },
    {
      id: 'lastName',
      disablePadding: false,
      label: 'Last Name',
    },
    {
      id: 'email',
      disablePadding: false,
      label: 'Email',
    },
    {
      id: 'userRole.roleName',
      disablePadding: false,
      label: 'Role',
    },
    {
      id: 'status',
      disablePadding: false,
      type: 'status',
      statusOptions: { success: ['active'], warning: ['inActive'] },
      label: 'Status',
    },
    {
      id: 'createdAt',
      type: 'datetime',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'lastLogin',
      type: 'datetime',
      disablePadding: false,
      label: 'Last Login',
    },
    {
      id: 'options',
      disablePadding: false,
      type: 'custom',
      label: 'options',
      options: optionData(),
    },
  ];

  useEffect(() => {
    if (userPermissions?.length > 0) {
      if (!userPermissions?.includes('/users/edit') && !userPermissions?.includes('/users/delete')) {
        headCells.splice(6, 1);
        setColumnData(headCells);
      } else {
        setColumnData(headCells);
      }
    } else {
      setColumnData(headCells);
    }
  }, [userPermissions, router.pathname]);

  const handleRemoveUser = (close: any) => {
    (async () => {
      if (close) {
        await removeAdminUser({
          variables: {
            userId: cuser?.userId,
            id: store?.removeUserData?.id,
          },
        });
      } else {
        setDeleteIdModal(false);
      }
      dispatch({ type: 'REMOVE_USERDATA', payload: {} });
    })();
  };

  useEffect(() => {
    if (updatedDropsCategoryData?.removeAdminUser?.status) {
      setSuccessToast({ toastTog: true, toastMessage: 'User deleted successfully!' });
      refetch();
      setDeleteIdModal(false);
    }
  }, [updatedDropsCategoryData]);

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
          {successToast.toastMessage}
        </Alert>
      </Snackbar>
      <Head>
        <title>Users</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Users" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Users List',
              value: '1',
              component:
  <>
    {((userPermissions?.includes('/users/add'))) && (
    <Grid item xs={12}>
      <p><NextLink href="/users/add" passHref>Add User </NextLink></p>
    </Grid>
    )}
    <Grid
      container
      direction="row"
      justifyContent="center"
      alignItems="stretch"
      spacing={3}
      style={{ marginTop: '0px' }}
    >
      <Grid item xs={12}>

        <Card sx={{ padding: 3 }}>
          {loading && <LinearIndeterminate />}

          <EnhancedTable headCells={columnData} rows={data?.getAdminUsers ?? []} orderByFieldName="firstName" />
        </Card>
      </Grid>
    </Grid>
  </>,
            },
            {
              label: 'Audit Logs',
              value: '2',
              component:
  <Grid item xs={12}>
    <DynamicAuditHistory
      activityLogs={activityLogs}
      setfilters={setFilters}
      activityFilters={activityFilters}
    />
  </Grid>,
            },
          ]}
        />
        {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(close: any) => handleRemoveUser(close)} removedDropsCategoryLoading={removeAdminUserLoading} /> : ''}
      </Container>
      <Footer />
    </>
  );
};

UserList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default UserList;
