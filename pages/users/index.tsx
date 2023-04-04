import Head from 'next/head';
import {
  Grid, Container, Card, IconButton,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ALL_USERS } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import {
  Dashboard, EditRounded,
} from '@mui/icons-material';
// import { IStore } from '@/types/groupshop';
import { NextPage } from 'next';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import usePermission from '@/hooks/usePermission';
import { useRouter } from 'next/router';

const UserList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const [columnData, setColumnData] = useState([]);
  const router = useRouter();
  const { getPermissions } = usePermission();
  const {
    loading, data, error, refetch,
  } = useQuery(ALL_USERS);

  useEffect(() => {
    refetch();
  }, []);

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
      id: 'userRole',
      disablePadding: false,
      label: 'Role',
    },
    {
      id: 'status',
      disablePadding: false,
      type: 'status',
      statusOptions: { success: ['Active'], warning: ['inActive'] },
      label: 'Status',
    },
    {
      id: 'createdAt',
      type: 'datetime',
      disablePadding: false,
      label: 'Created At',
    },
    {
      id: 'options',
      disablePadding: false,
      type: 'custom',
      label: 'options',
      // eslint-disable-next-line @typescript-eslint/no-misused-promises, no-return-await
      options: [
        { btn: <IconButton aria-label="delete" color="primary"><EditRounded /></IconButton>, link: '/users/edit' },
      ],
    },
  ];

  useEffect(() => {
    if (!getPermissions().includes('/users/edit')) {
      headCells.splice(6, 1);
      setColumnData(headCells);
    } else {
      setColumnData(headCells);
    }
  }, [getPermissions, router.pathname]);

  return (
    <>
      <Head>
        <title>Users</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader pagetitle="Users" />
      </PageTitleWrapper>
      <Container maxWidth="lg">
        {((getPermissions().includes('/users/add'))) && (
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
        >
          <Grid item xs={12}>

            <Card sx={{ padding: 3 }}>
              {loading && <LinearIndeterminate />}

              <EnhancedTable headCells={columnData} rows={data?.getAdminUsers ?? []} orderByFieldName="firstName" />
            </Card>
          </Grid>
        </Grid>
      </Container>
      <Footer />
    </>
  );
};

UserList.getLayout = (page) => (
  <SidebarLayout>{page}</SidebarLayout>
);

export default UserList;
