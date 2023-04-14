import Head from 'next/head';
import {
  Grid, Container, Card, IconButton,
} from '@mui/material';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageHeader from '@/content/Management/Transactions/PageHeader';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import Footer from '@/components/Footer';
import EnhancedTable, { HeadCell } from '@/components/tables/enhancedTable';
import { ALL_STORES } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import LinearIndeterminate from '@/components/Progress/Linear';
import {
  Dashboard, RemoveRedEyeOutlined, VideoCameraFront,
} from '@mui/icons-material';
// import { IStore } from '@/types/groupshop';
import { NextPage } from 'next';
import { useEffect, useState } from 'react';
import usePermission from '@/hooks/usePermission';
import { useRouter } from 'next/router';

interface THeader {
  id: string;

}
const StoreList: NextPage<{ meta?: any }> = ({ meta }: { meta: any }) => {
  const { userPermissions } = usePermission();
  // console.log('merchant', userPermission);
  const {
    loading, data, error, refetch,
  } = useQuery(ALL_STORES);

  useEffect(() => {
    refetch();
  }, []);

  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ data', data);
  console.log('🚀 ~ file: index.tsx ~ line 189 ~ SidebarMenu ~ loading', loading);
  console.log('🚀 ~ file: index.tsx ~ line 27 ~ meta', meta);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const headCells: Array<HeadCell<typeof data>> = [
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
  }, [userPermissions]);

  useEffect(() => {
    if (columnData.length > 0 && !!userPermissions) {
      const optionHead = headCells[6].options;
      if (!userPermissions.includes('/drops')) {
        optionHead.splice(3, 1);
      }
      if (!userPermissions.includes('/discoverytools')) {
        optionHead.splice(2, 1);
      }
      if (!userPermissions.includes('/store/videoupload')) {
        optionHead.splice(1, 1);
      }
      if (!userPermissions.includes('/merchant/load-dashboard')) {
        optionHead.splice(0, 1);
      }
      if (columnData[6].options.length < 1) {
        columnData[6].options = optionHead;
        setColumnData([...columnData]);
      }
    }
  }, [columnData, userPermissions]);

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
          justifyContent="center"
          alignItems="stretch"
          spacing={3}
        >
          <Grid item xs={12}>

            <Card sx={{ padding: 3 }}>
              {loading && <LinearIndeterminate />}

              <EnhancedTable headCells={columnData ?? []} rows={data?.stores ?? []} orderByFieldName="brandName" />
            </Card>
          </Grid>
        </Grid>
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
