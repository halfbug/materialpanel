/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/prefer-optional-chain */

import {
  ALL_STORES, DROPS_UPDATE, GET_ALL_VIDEOS, VIDEOS_UPDATE, VIDEO_POST,
} from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  useEffect, useState, useMemo, useCallback,
} from 'react';
import { VideoUpdate } from '@/types/groupshop';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';

const useVideoUpload = (gridRef: any) => {
  const router = useRouter();
  const { sid } = router.query;
  const [errFlag, setErrFlag] = useState<string>('');
  const [selectVideo, setSelectVideo] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [videoError, setVideoError] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [brandName, setBrandName] = useState('');
  const [fileName, setFileName] = useState<string>('');
  const [videoUploadSuccess, setVideoUploadSuccess] = useState<boolean>(false);
  const [dropsData, setDropsData] = useState<any>();

  console.log('dropsData🎈', dropsData);

  const columnDefs: any = [
    {
      field: '',
      checkboxSelection: (params) => {
        if (selectVideo.length > 4 && !params.node.selected) {
          return false;
        }
        return true;
      },
      showDisabledCheckboxes: true,
      maxWidth: 100,
      rowDrag: true,
    },
    {
      field: 'name',
      maxWidth: 500,
    },
    { field: 'status', maxWidth: 200 },
    {
      field: 'createdAt',
      maxWidth: 500,
      valueGetter: (params) => moment(params.data?.createdAt).format('MMM Do YYYY, HH:mm:ss'),
    },
  ];

  const defaultColDef = useMemo(() => ({
    flex: 1,
    minWidth: 100,
    sortable: true,
  }), []);

  const isRowSelectable = useCallback((params) => !!params.data, []);

  const [videoPost,
    { data: { createVideo } = { createVideo: {} } },
  ] = useMutation<any | null>(VIDEO_POST);

  const [videoStatusUpdate, { data, loading }] = useMutation<VideoUpdate>(VIDEOS_UPDATE);
  const getAllStore = useQuery(ALL_STORES);

  const [refetch] = useLazyQuery(GET_ALL_VIDEOS, {
    variables: { storeId: sid },
    fetchPolicy: 'network-only',
    onCompleted: (getVideo) => {
      const sortVideoList = SortingVideoOrder(getVideo?.videos);
      setVideoList(sortVideoList);
    },
  });

  const [updateStore,
    { data: dropsUpdateData }] = useMutation<any>(DROPS_UPDATE);

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      setDropsData(dropsUpdateData?.updateStore?.drops);
    }
  }, [dropsUpdateData]);

  const SortingVideoOrder = (VideoList: any) => {
    const VideosOrder0 = VideoList.filter((el) => el.orderId === 0);
    const videoOrderData = VideoList.filter((el) => el.orderId !== 0)
      .sort((a, b) => a.orderId - b.orderId);
    return [...videoOrderData, ...VideosOrder0];
  };

  useEffect(() => {
    if (getAllStore && getAllStore.data && getAllStore.data.stores?.length > 0 && sid) {
      const currentStore = getAllStore.data.stores.find((ele: any) => ele.id === sid);
      setBrandName(currentStore?.brandName);
      setDropsData(currentStore.drops);
    }
  }, [getAllStore, sid]);

  useEffect(() => {
    if (data) {
      const sortVideoList = SortingVideoOrder(data?.updateVideo);
      setVideoList(sortVideoList);
    }
  }, [data]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (createVideo && createVideo.status) {
      refetch();
      setVideoUploadSuccess(true);
    }
  }, [createVideo]);

  useEffect(() => {
    if (sid) {
      refetch();
    }
  }, [sid]);

  const handleChangeVideo = (e: any) => {
    setFileName(e.target.value);
    const videoType = ['video/mp4'];
    if (!(Array.from(e.target.files).map((ele: any) => videoType.includes(ele?.type)))
      .includes(false)) {
      setErrFlag('');
      const files: any = Array.from(e.target.files);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data;boundary=None' },
      };
      const fd = new FormData();
      const temp: any[] = [];
      files.forEach((b: any) => {
        if (((b.size / 1024) / 1024) > 11) {
          temp.push(`${b.name} is more than 10 MB`);
        }
      });
      setVideoError(temp);
      if (!temp.length) {
        files.forEach((a: any) => {
          const imgName = a.name.split('.');
          const imgExt = imgName.splice(imgName.length - 1, 1);
          const uniqueId = uuid();
          const uniqueLimitId = uniqueId.substring(uniqueId.length - 3);
          fd.append('video', a, `${imgName.join('.')}${uniqueLimitId}.${imgExt}`);
        });
        setLoading(true);
        axios.post(`${process.env.API_URL}/image/video`, fd, config)
          .then((res) => {
            if (res?.data?.data && res.data.data.length > 0) {
              res.data.data.map(async (el: any) => {
                await videoPost({
                  variables: {
                    createVideoInput: {
                      storeId: sid,
                      type: el.Location,
                      name: el.Key,
                      status: 'InActive',
                      orderId: 0,
                    },
                  },
                });
              });
            }
            setLoading(false);
            setFileName('');
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
            setFileName('');
          });
      }
    } else {
      setErrFlag(' Please upload the following file types: MP4');
    }
  };

  useEffect(() => {
    if (videoList?.length > 0) {
      const temp: any = videoList.map((ite: any) => ({
        id: ite._id,
        name: ite.name,
        status: ite.status,
        storeId: ite.storeId,
        type: ite.type,
        createdAt: ite.createdAt ? new Date(parseInt(ite.createdAt)) : '',
        updatedAt: ite.updatedAt ? new Date(parseInt(ite.updatedAt)) : '',
      }));
      const activeId: any = temp.filter((el: any) => el.status === 'Active').map((ele: any) => ele.id);
      setSelectVideo(activeId);
      setRows(temp);
    }
  }, [videoList]);

  const handleClick = () => {
    const selectedVideoIds = rows.filter((ele) => selectVideo.includes(ele.id)).map((el) => el.id);
    videoStatusUpdate({
      variables: {
        updateVideoInput: {
          selectedIds: selectedVideoIds,
          storeId: sid,
        },
      },
    });
  };

  const toastClose = () => {
    setVideoUploadSuccess(false);
  };

  const onFirstDataRendered = useCallback(() => {
    gridRef.current.api.sizeColumnsToFit();
    gridRef.current.api.forEachNode((node) => node.setSelected(!!node.data && node.data.status === 'Active'));
  }, []);

  const onGridSizeChanged = () => {
    sizeToFit();
  };

  const sizeToFit = useCallback(() => {
    if (gridRef?.current !== undefined) {
      gridRef?.current?.api?.sizeColumnsToFit();
    }
  }, []);

  const onRowDragMove = (event) => {
    const movingNode = event.node;
    const { overNode } = event;
    const rowNeedsToMove = movingNode !== overNode;
    if (rowNeedsToMove) {
      const movingData = movingNode?.data;
      const overData = overNode?.data;
      const fromIndex = rows.indexOf(movingData);
      const toIndex = rows.indexOf(overData);
      const newStore = rows.slice();
      moveInArray(newStore, fromIndex, toIndex);
      setRows(newStore);
    }
    function moveInArray(arr, fromIndex, toIndex) {
      const element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
    }
  };

  const getRowNodeId = useCallback((params) => params.id, []);

  const onSelectionChanged = () => {
    const selectedRows = gridRef.current.api.getSelectedRows();
    setSelectVideo(selectedRows.map((el) => el.id));
  };

  const handleChangeDrops = async (e:any) => {
    console.log('dropsData🎈', dropsData);
    await updateStore({
      variables: {
        updateStoreInput: {
          id: sid,
          drops: {
            ...dropsData,
            isVideoEnabled: e.target.checked,
          },
        },
      },
    });
  };

  return {
    rows,
    errFlag,
    selectVideo,
    handleChangeVideo,
    handleClick,
    videoError,
    isLoading,
    brandName,
    fileName,
    videoUploadSuccess,
    toastClose,
    columnDefs,
    defaultColDef,
    isRowSelectable,
    onRowDragMove,
    onFirstDataRendered,
    onGridSizeChanged,
    getRowNodeId,
    onSelectionChanged,
    dropsData,
    handleChangeDrops,
  };
};

export default useVideoUpload;
