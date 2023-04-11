import Head from 'next/head';
import {
  Grid, Container, Card, IconButton,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import { ALL_ADMIN_USERS_ROLES } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import { EditRounded } from '@mui/icons-material';
import {
  DataGrid, GridColDef, GridValueGetterParams,
} from '@mui/x-data-grid';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import usePermission from '@/hooks/usePermission';

const RoleList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const [columnData, setColumnData] = useState([]);
  const { userPermissions } = usePermission();
  const {
    loading, data, error, refetch,
  } = useQuery(ALL_ADMIN_USERS_ROLES);

  useEffect(() => {
    refetch();
  }, []);

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
              |
              {' '}
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
      width: 100,
      // eslint-disable-next-line jsx-a11y/control-has-associated-label
      renderCell: (params: GridValueGetterParams) => (<a href={`/roles/edit?sid=${params.row.id}`}><EditRounded /></a>),
      type: 'string',
    },
  ];

  useEffect(() => {
    if (userPermissions?.length > 0) {
      if (!userPermissions.includes('/roles/edit')) {
        columns.splice(3, 1);
        setColumnData(columns);
      } else {
        setColumnData(columns);
      }
    } else {
      setColumnData(columns);
    }
  }, [userPermissions]);

  return (
    <>
      <Head>
        <title>Roles</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Admin User Roles" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
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
        >
          <Grid item xs={12}>

            <Card sx={{ padding: 3 }}>
              {loading && <LinearIndeterminate />}
              <div style={{ display: 'flex', height: '70vh' }}>
                <div style={{ flexGrow: 1 }}>
                  <DataGrid
                    rows={data?.getAdminRoles ?? []}
                    columns={columnData}
                    pageSize={5}
                    rowsPerPageOptions={[5, 10, 25]}
                  />
                </div>
              </div>
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

RoleList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default RoleList;
