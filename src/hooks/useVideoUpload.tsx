/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable radix */
/* eslint-disable @typescript-eslint/no-floating-promises */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {
  DROPS_UPDATE, GET_ALL_VIDEOS, GET_STORE_DETAILS, VIDEOS_REMOVE, VIDEOS_UPDATE, VIDEO_POST,
} from '@/graphql/store.graphql';
import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import {
  useEffect, useState, useMemo, useCallback, useContext,
} from 'react';
import { VideoUpdate } from '@/types/groupshop';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { AuthContext } from '@/contexts/auth.context';
import 'ag-grid-community/styles/ag-grid.css';
import 'ag-grid-community/styles/ag-theme-alpine.css';
import { IconButton } from '@mui/material';
import { DeleteForeverOutlined } from '@mui/icons-material';

const useVideoUpload = (gridRef: any) => {
  const router = useRouter();
  const { sid } = router.query;
  const [errFlag, setErrFlag] = useState<string>('');
  const [selectVideo, setSelectVideo] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [rows, setRows] = useState<any>([]);
  const [videoError, setVideoError] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [storeData, setStoreData] = useState<any>({});
  const [fileName, setFileName] = useState<string>('');
  const [toastData, setToastData] = useState<any>({
    toastTog: false,
    toastMessage: '',
  });

  const VideoSuccessMessage = 'Video uploaded successfully!';
  const VideoRemoveMessage = 'Video removed successfully!';
  const DropsEnabledMessage = 'First of fill all drops filed!';

  const { user } = useContext(AuthContext);

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
    {
      field: 'id',
      headerName: 'Remove video',
      maxWidth: 150,
      cellRendererFramework: (params) => <IconButton aria-label="delete" color="primary" onClick={() => handleRemoveVideo(params.data)}><DeleteForeverOutlined /></IconButton>,
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

  const [videoRemove,
    { data: removedVideoData },
  ] = useMutation<any>(VIDEOS_REMOVE);

  const {
    data: getStoreData, refetch: getStoreRefetch,
  } = useQuery(GET_STORE_DETAILS, {
    skip: !sid,
    variables: { id: sid },
  });

  useEffect(() => {
    if (removedVideoData && removedVideoData.removeVideo && removedVideoData.removeVideo.status) {
      refetch();
      setToastData({ toastTog: true, toastMessage: VideoRemoveMessage });
    }
  }, [removedVideoData]);

  const [refetch] = useLazyQuery(GET_ALL_VIDEOS, {
    variables: { storeId: sid },
    fetchPolicy: 'network-only',
    onCompleted: (getVideo) => {
      console.log('🚀 ~ file: useVideoUpload.tsx:115 ~ useVideoUpload ~ getVideo:', getVideo);
      const sortVideoList = SortingVideoOrder(getVideo?.videos);
      setVideoList(sortVideoList);
    },
  });

  const [updateStore,
    { data: dropsUpdateData }] = useMutation<any>(DROPS_UPDATE);

  useEffect(() => {
    if (dropsUpdateData?.updateStore?.drops) {
      getStoreRefetch();
    }
  }, [dropsUpdateData]);

  const SortingVideoOrder = (VideoList: any) => {
    const VideosOrder0 = VideoList.filter((el: any) => el.orderId === 0);
    const videoOrderData = VideoList.filter((el: any) => el.orderId !== 0)
      .sort((a: any, b: any) => a.orderId - b.orderId);
    return [...videoOrderData, ...VideosOrder0];
  };

  useEffect(() => {
    if (getStoreData?.store && sid) {
      setStoreData(getStoreData?.store);
    }
  }, [getStoreData, sid]);

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
      setToastData({ toastTog: true, toastMessage: VideoSuccessMessage });
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
    const VideoFile = Array.from(e.target.files)
      .filter((ele: any) => videoType.includes(ele?.type));
    const anotherExtensionFile = Array.from(e.target.files)
      .filter((ele: any) => !videoType.includes(ele?.type));
    if (anotherExtensionFile.length && VideoFile.length) {
      setErrFlag('');
      const files: any = VideoFile;
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
                      userId: user?.userId,
                      activity: 'Video Management',
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
      setErrFlag(' Please upload the following file types: MP4');
    } else if (!(Array.from(e.target.files).map((ele: any) => videoType.includes(ele?.type)))
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
                      userId: user?.userId,
                      activity: 'Video Management',
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

  const handleRemoveVideo = (selectRowData: any) => {
    setLoading(true);
    const config = {
      headers: { 'Content-Type': 'multipart/form-data;boundary=None' },
    };
    axios.delete(`${process.env.API_URL}/image/video?key=${selectRowData.name}`, config)
      .then(async (res) => {
        if (res.data.message) {
          await videoRemove({
            variables: {
              id: selectRowData.id,
            },
          });
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
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
          userId: user?.userId,
          activity: 'Video Management',
          selectedIds: selectedVideoIds,
          storeId: sid,
        },
      },
    });
  };

  const toastClose = () => {
    setToastData({ ...toastData, toastTog: false });
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

  const handleChangeDrops = (e: any) => {
    if (storeData?.drops) {
      updateStore({
        variables: {
          updateStoreInput: {
            id: sid,
            drops: {
              ...storeData.drops,
              isVideoEnabled: e.target.checked,
            },
          },
        },
      });
    } else {
      setToastData({ toastTog: true, toastMessage: DropsEnabledMessage });
    }
  };

  return {
    rows,
    errFlag,
    selectVideo,
    handleChangeVideo,
    handleClick,
    videoError,
    isLoading,
    fileName,
    toastData,
    toastClose,
    columnDefs,
    defaultColDef,
    isRowSelectable,
    onRowDragMove,
    onFirstDataRendered,
    onGridSizeChanged,
    getRowNodeId,
    onSelectionChanged,
    storeData,
    handleChangeDrops,
    DropsEnabledMessage,
  };
};

export default useVideoUpload;
