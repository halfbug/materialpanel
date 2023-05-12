/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react/no-array-index-key */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import Head from 'next/head';
import SidebarLayout from '@/layouts/SidebarLayout';
import PageTitle from '@/components/PageTitle';
import {
  useState, useEffect, useRef, useContext,
} from 'react';
import PageTitleWrapper from '@/components/PageTitleWrapper';
import {
  Container,
  Grid,
  Card,
  CardHeader,
  CardContent,
  Divider,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import Footer from '@/components/Footer';
import Box from '@mui/material/Box';
import { ALL_STORES, DISCOVERYTOOLS_UPDATE, DROPS_ACTIVITY } from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import MenuTwoToneIcon from '@mui/icons-material/MenuTwoTone';
import { useRouter } from 'next/router';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { DiscoveryTools } from '@/types/groupshop';
import DraggableList from 'react-draggable-list';
import { StoreContext } from '@/store/store.context';
import Tabs from '@/components/Tabs/tabs';
import { AuthContext } from '@/contexts/auth.context';
import DynamicAuditHistory from '@/components/forms/dynamicAuditHistory';

const Item: any = ({ item, dragHandleProps }: any) => {
  const { onMouseDown, onTouchStart } = dragHandleProps;
  const { store, dispatch } = useContext(StoreContext);

  const handleClick = (data) => {
    if (data) {
      dispatch({ type: 'UPDATE_CLICK_DISCOVERBRAND', payload: { ...store, matchingBrandNameEvent: data } });
    }
  };

  return (
    <div
      className="disable-select"
      style={{
        border: '1px solid black',
        margin: '4px',
        padding: '10px',
        display: 'flex',
        justifyContent: 'space-between',
        background: '#fff',
        userSelect: 'none',
      }}
      onMouseDown={(e:any) => handleClick(e.target?.firstChild?.data)}
    >
      {item?.brandName}
      <MenuTwoToneIcon
        fontSize="small"
        className="disable-select dragHandle"
        style={{ cursor: 'pointer' }}
        onTouchStart={(e) => {
          e.preventDefault();
          onTouchStart(e);
        }}
        onMouseDown={(e) => {
          onMouseDown(e);
        }}
      />
    </div>
  );
};

const Discoverytools = () => {
  const router = useRouter();
  const { sid } = router.query;
  const { user } = useContext(AuthContext);
  const [getAllStore, setGetAllStore] = useState<any>();
  const [activityLogs, setActivityLogs] = useState<any[]>([]);
  const [refetch] = useLazyQuery(ALL_STORES, {
    fetchPolicy: 'network-only',
    onCompleted: (allStore) => {
      setGetAllStore(allStore);
    },
  });
  const [discoveryToolsUpdate] = useMutation<DiscoveryTools>(
    DISCOVERYTOOLS_UPDATE,
  );
  const { store, dispatch } = useContext(StoreContext);
  const [brandName, setBrandName] = useState([]);
  const [matchingBrandName, setMatchingBrandName] = useState<any[]>([]);
  const [selectDiscoverBrandName, setSelectDiscoverBrandName] = useState<any>({});
  const [status, setStatus] = useState<string>('');
  const currentRoute = router.pathname;
  const containerRef = useRef();

  useEffect(() => {
    refetch();
  }, []);

  const [getActivity, { data: dataActivity }] = useLazyQuery(DROPS_ACTIVITY, {
    fetchPolicy: 'network-only',
    onCompleted: (allActivity) => {
      setActivityLogs(allActivity.dropsActivity);
    },
  });

  useEffect(() => {
    getActivity({ variables: { route: currentRoute, storeId: sid } });
  }, [sid, currentRoute]);

  useEffect(() => {
    if (store?.matchingBrandNameEvent) {
      const tempMatchingData: any = matchingBrandName.filter(
        (ele: any) => ele.brandName !== store?.matchingBrandNameEvent,
      );
      const tempBrandName: any = matchingBrandName.find(
        (ele: any) => ele.brandName === store?.matchingBrandNameEvent,
      );
      setMatchingBrandName(tempMatchingData);
      setBrandName([...brandName, tempBrandName]);
      temp(tempMatchingData, status);
      dispatch({ type: 'UPDATE_CLICK_DISCOVERBRAND', payload: { ...store, matchingBrandNameEvent: '' } });
    }
  }, [store]);

  useEffect(() => {
    if (getAllStore?.stores?.length > 0) {
      const selectedStore: any = getAllStore?.stores?.find((ele: any) => ele.id === sid);
      setBrandName(getAllStore.stores.filter((ele: any) => ele.status === 'Active' && ele?.subscription?.status?.toUpperCase() === 'ACTIVE' && ele.id !== sid).filter((item: any) => !selectedStore?.discoveryTool?.matchingBrandName?.map((ele: any) => ele?.id).includes(item.id)).map((el1: any) => ({ id: el1.id, brandName: el1.brandName })));
      setMatchingBrandName(selectedStore?.discoveryTool?.matchingBrandName ?? []);
      setSelectDiscoverBrandName(selectedStore);
    }
  }, [getAllStore]);

  useEffect(() => {
    if (selectDiscoverBrandName) {
      if (selectDiscoverBrandName?.discoveryTool?.status === 'Active') {
        setStatus('Active');
      } else {
        setStatus('InActive');
      }
    }
  }, [selectDiscoverBrandName]);

  const handleFirst = (data: any, index: number) => {
    const tempMatchingData: any = [...matchingBrandName, data];
    setBrandName(brandName.filter((_: any, ind: number) => index !== ind));
    setMatchingBrandName(tempMatchingData);
    temp(tempMatchingData, status);
  };

  const handleChange = (e: any) => {
    if (e.target.value === '1') {
      setStatus('Active');
      temp(matchingBrandName, 'Active');
    } else {
      setStatus('InActive');
      temp(matchingBrandName, 'InActive');
    }
  };

  const temp = (data: any, statusData: string) => {
    discoveryToolsUpdate({
      variables: {
        updateDiscoveryTools: {
          id: sid,
          userId: user?.userId,
          activity: 'Discovery Tools Management',
          discoveryTool: {
            matchingBrandName: data,
            status: statusData,
          },
        },
      },
    });
  };

  const handleRLDDChange = (newItems) => {
    temp(newItems, status);
    setMatchingBrandName(newItems);
  };

  return (
    <>
      <Head>
        <title>GSADMIN</title>
      </Head>
      <PageTitleWrapper>
        <div style={{ display: 'flex', gap: '10px' }}>
          <PageTitle
            heading={`Discovery Tools - ${selectDiscoverBrandName?.brandName ? selectDiscoverBrandName?.brandName : ''}`}
          />
          {status ? (
            <div className="align-items-center" style={{ display: 'flex', gap: '5px' }}>
              <span style={{ whiteSpace: 'nowrap' }}>Status</span>
              <ToggleButtonGroup
                color="primary"
                value={status}
                exclusive
                onChange={(e) => handleChange(e)}
                aria-label="Platform"
                style={{ gap: '10px' }}
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
      <Container maxWidth="lg">
        <Tabs
          tabList={[
            {
              label: 'Discovery List',
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
      <Card>
        <CardHeader title="Tools" />
        <Divider />
        <CardContent>
          <Box
            component="form"
            sx={{
              '& .MuiTextField-root': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          >
            <div
              style={{
                display: 'flex', gap: '10px', width: '100%', justifyContent: 'center', alignItems: 'center',
              }}
            >
              <div style={{ width: '30%' }}>
                <div style={{ textAlign: 'center' }}>
                  Master BrandName
                </div>
                <div style={{
                  height: '600px', border: '2px solid black', padding: '12px', overflow: 'auto',
                }}
                >
                  {brandName?.map((ele: any, index: number) => (
                    <div
                      className="disable-select"
                      style={{
                        border: '1px solid black',
                        margin: '4px',
                        padding: '10px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        background: '#fff',
                        userSelect: 'none',
                      }}
                      onClick={() => handleFirst(ele, index)}
                      key={index}
                    >
                      {ele?.brandName}
                    </div>
                  ))}
                </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-shuffle" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M0 3.5A.5.5 0 0 1 .5 3H1c2.202 0 3.827 1.24 4.874 2.418.49.552.865 1.102 1.126 1.532.26-.43.636-.98 1.126-1.532C9.173 4.24 10.798 3 13 3v1c-1.798 0-3.173 1.01-4.126 2.082A9.624 9.624 0 0 0 7.556 8a9.624 9.624 0 0 0 1.317 1.918C9.828 10.99 11.204 12 13 12v1c-2.202 0-3.827-1.24-4.874-2.418A10.595 10.595 0 0 1 7 9.05c-.26.43-.636.98-1.126 1.532C4.827 11.76 3.202 13 1 13H.5a.5.5 0 0 1 0-1H1c1.798 0 3.173-1.01 4.126-2.082A9.624 9.624 0 0 0 6.444 8a9.624 9.624 0 0 0-1.317-1.918C4.172 5.01 2.796 4 1 4H.5a.5.5 0 0 1-.5-.5z" />
                <path d="M13 5.466V1.534a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192zm0 9v-3.932a.25.25 0 0 1 .41-.192l2.36 1.966c.12.1.12.284 0 .384l-2.36 1.966a.25.25 0 0 1-.41-.192z" />
              </svg>
              <div style={{ width: '30%' }}>
                <div style={{ textAlign: 'center' }}>
                  Matching BrandName
                </div>
                <div style={{
                  height: '600px', border: '2px solid black', padding: '12px', overflow: 'auto',
                }}
                >
                  <div
                    ref={containerRef}
                    style={{ touchAction: 'pan-y' }}
                  >
                    <DraggableList
                      itemKey="id"
                      list={matchingBrandName}
                      onMoveEnd={(newList) => handleRLDDChange(newList)}
                      container={() => containerRef.current}
                      template={Item}
                    />
                  </div>
                </div>
              </div>
            </div>
          </Box>
        </CardContent>
      </Card>
    </Grid>
  </Grid>,
            },
            {
              label: 'Audit Logs',
              value: '5',
              component:
  <Grid item xs={6}>
    <DynamicAuditHistory activityLogs={activityLogs} />
  </Grid>,
            },
          ]}
        />
      </Container>
      <Footer />
    </>
  );
};

Discoverytools.getLayout = (page) => <SidebarLayout>{page}</SidebarLayout>;

export default Discoverytools;
