/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-console */
import Head from 'next/head';
import {
  Grid, Container, Card, IconButton, Snackbar, Alert,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import {
  ADMIN_ACTIVITY, ALL_ADMIN_USERS_ROLES, ALL_USERS, REMOVE_ROLE,
} from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import { DeleteForeverOutlined, EditRounded, PeopleOutlineOutlined } from '@mui/icons-material';
import {
  DataGrid, GridColDef, GridValueGetterParams,
} from '@mui/x-data-grid';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useContext, useEffect, useState } from 'react';
import { AuthContext } from '@/contexts/auth.context';
import DynamicAuditHistory from '@/components/forms/dynamicAuditHistory';
import usePermission from '@/hooks/usePermission';
import RemoveIdsModal from '@/models/RemoveIdsModal';
import Tabs from '@/components/Tabs/tabs';
import { useRouter } from 'next/router';

const RoleList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const [columnData, setColumnData] = useState([]);
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [deleteIdModal, setDeleteIdModal] = useState(false);
  const [deletePermissionId, setDeletePermissionId] = useState('');
  const [successToast, setSuccessToast] = useState<any>({
    toastTog: false,
    toastMessage: '',
    toastColor: '',
  });
  const { user: cuser } = useContext(AuthContext);
  const router = useRouter();
  const currentRoute = router.pathname;
  const { userPermissions } = usePermission();
  const {
    loading, data, error, refetch,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  const {
    data: allUserData,
  } = useQuery(ALL_USERS);

  const [removeAdminRole, {
    data: removeAdminRoleData,
    loading: removeAdminRoleLoading,
  }] = useMutation<any>(
    REMOVE_ROLE,
  );

  useEffect(() => {
    refetch();
  }, []);

  const [adminActivity, { data: dataActivity }] = useLazyQuery(ADMIN_ACTIVITY, {
    fetchPolicy: 'network-only',
    onCompleted: (allActivity) => {
      setActivityLogs(allActivity.adminActivity);
    },
  });

  useEffect(() => {
    adminActivity({ variables: { route: currentRoute } });
  }, [currentRoute]);

  const columns: GridColDef[] = [

    {
      field: 'rollName',
      headerName: 'Role Name',
      width: 150,
      renderCell: (params: GridValueGetterParams) => (params.row.roleName),
    },
    {
      field: 'permission',
      headerName: 'Permission',
      width: 500,
      // eslint-disable-next-line max-len
      renderCell: (params) => (
        <ul className="flex">
          {params.row.permission.map((role, index) => (
            <span>
              {role.name}
              {' '}
              {params.row.permission.length - 1 !== index && '| '}
            </span>
          ))}
        </ul>
      ),
      type: 'string',
    },
    {
      field: 'createdAt',
      headerName: 'Created at',
      width: 210,
      valueGetter: (params: GridValueGetterParams) => new Date(
        params.row.createdAt,
      ).toLocaleString(),
    },
    {
      field: 'edit',
      headerName: 'Option',
      width: 170,
      renderCell: (params: GridValueGetterParams) => (
        <div>
          {userPermissions?.includes('/roles/edit') && <NextLink href={`/roles/edit?sid=${params.row.id}`} passHref><a><IconButton aria-label="delete" color="primary"><EditRounded /></IconButton></a></NextLink>}
          {userPermissions?.includes('/roles/delete') && <IconButton aria-label="delete" color="primary" onClick={() => handleDelete(params?.row)}><DeleteForeverOutlined /></IconButton>}
          <IconButton aria-label="delete" color="primary">
            <PeopleOutlineOutlined />
          </IconButton>
          (
          {allUserData?.getAdminUsers?.length > 0
            ? allUserData.getAdminUsers.filter(
              (ele: any) => ele?.userRole?.id === params.row.id,
            ).length
            : 0}
          )
        </div>
      ),
      type: 'string',
    },
  ];

  useEffect(() => {
    setColumnData(columns);
  }, [userPermissions, allUserData, data]);

  const handleDelete = (params: any) => {
    const isAssignRole = allUserData?.getAdminUsers?.filter(
      (ele: any) => ele?.userRole?.id === params.id,
    );
    if (!isAssignRole?.length) {
      setDeletePermissionId(params.id);
      setDeleteIdModal(true);
    } else if (isAssignRole.length) {
      setSuccessToast({ toastMessage: 'Role can\'t be deleted as it is assigned to an Active user.', toastTog: true, toastColor: 'error' });
    }
  };

  const handleRemoveUser = (close: any) => {
    (async () => {
      if (close) {
        await removeAdminRole({
          variables: {
            userId: cuser?.userId,
            id: deletePermissionId,
          },
        });
      } else {
        setDeleteIdModal(false);
      }
      setDeletePermissionId('');
    })();
  };

  useEffect(() => {
    if (removeAdminRoleData?.removeAdminRole?.roleName) {
      setSuccessToast({ toastMessage: 'Role deleted successfully', toastTog: true, toastColor: 'success' });
      refetch();
      setDeleteIdModal(false);
    }
  }, [removeAdminRoleData]);

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
        <title>Roles</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Admin User Roles" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Roles List',
              value: '1',
              component:
  <>
    {((userPermissions?.includes('/roles/add'))) && (
    <Grid item xs={12}>
      <p><NextLink href="/roles/add" passHref>Add Admin Role </NextLink></p>
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
          <div style={{ display: 'flex', height: '70vh' }}>
            <div style={{ flexGrow: 1 }}>
              <DataGrid
                rows={data?.getAdminRoles ?? []}
                columns={columnData}
                pageSize={25}
                rowsPerPageOptions={[5, 10, 25]}
              />
            </div>
          </div>
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
    <DynamicAuditHistory activityLogs={activityLogs} />
  </Grid>,
            },
          ]}
        />
      </Container>
      <Footer />
      {deleteIdModal ? <RemoveIdsModal show={deleteIdModal} close={(close: any) => handleRemoveUser(close)} removedDropsCategoryLoading={removeAdminRoleLoading} /> : ''}
    </>
  );
};

RoleList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default RoleList;
