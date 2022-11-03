/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-floating-promises */
import { GET_ALL_VIDEOS, VIDEOS_UPDATE, VIDEO_POST } from '@/graphql/store.graphql';
import { useLazyQuery, useMutation } from '@apollo/client';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { VideoUpdate } from 'types/groupshop';
import { v4 as uuid } from 'uuid';
import { GridColDef } from '@mui/x-data-grid';

const useVideoUpload = () => {
  const router = useRouter();
  const { sid } = router.query;
  const [errFlag, setErrFlag] = useState<string>('');
  const [selectVideo, setSelectVideo] = useState<any[]>([]);
  const [videoList, setVideoList] = useState<any[]>([]);
  const [rows, setRows] = useState<any[]>([]);
  const [videoError, setVideoError] = useState<any[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const [videoPost,
    { data: { createVideo } = { createVideo: {} } },
  ] = useMutation<any | null>(VIDEO_POST);

  const [videoStatusUpdate, { data, loading }] = useMutation<VideoUpdate>(VIDEOS_UPDATE);

  const [refetch] = useLazyQuery(GET_ALL_VIDEOS, {
    variables: { storeId: sid },
    fetchPolicy: 'network-only',
    onCompleted: (getVideo) => {
      setVideoList(getVideo?.videos);
    },
  });

  useEffect(() => {
    if (data) {
      setVideoList(data?.updateVideo);
    }
  }, [data]);

  useEffect(() => {
    setLoading(loading);
  }, [loading]);

  useEffect(() => {
    if (createVideo && createVideo.status) {
      refetch();
    }
  }, [createVideo]);

  useEffect(() => {
    if (sid) {
      refetch();
    }
  }, [sid]);

  const handleChangeVideo = (e: any) => {
    const videoType = ['video/mp4'];
    if (!(Array.from(e.target.files).map((ele: any) => videoType.includes(ele?.type)))
      .includes(false)) {
      setErrFlag('');
      const files: any = Array.from(e.target.files);
      const config = {
        headers: { 'Content-Type': 'multipart/form-data' },
      };
      const fd = new FormData();
      const temp:any[] = [];
      files.forEach((b:any) => {
        if (((b.size / 1024) / 1024) > 11) {
          temp.push(`${b.name} is more then 10 MB`);
        }
      });
      setVideoError(temp);
      if (!temp.length) {
        files.forEach((a: any) => {
          const imgExt = a.name.split('.');
          const imgExt1 = imgExt[imgExt.length - 1];
          const uniqueId = uuid();
          const uniqueLimitId = uniqueId.substring(uniqueId.length - 12);
          fd.append('video', a, `${uniqueLimitId}.${imgExt1}`);
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
                    },
                  },
                });
              });
            }
            setLoading(false);
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    } else {
      setErrFlag('Only mp4 video suppoted');
    }
  };

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 230 },
    { field: 'name', headerName: 'Name', width: 200 },
    { field: 'type', headerName: 'Video URL', width: 480 },
    { field: 'status', headerName: 'Status', width: 200 },
  ];

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

  const handleSelect = (e: any) => {
    if (e.length < 6) {
      setSelectVideo(e);
    }
  };

  const handleClick = () => {
    videoStatusUpdate({
      variables: {
        updateVideoInput: {
          selectedIds: selectVideo,
          storeId: sid,
        },
      },
    });
  };

  return {
    rows,
    errFlag,
    columns,
    selectVideo,
    handleChangeVideo,
    handleSelect,
    handleClick,
    videoList,
    videoError,
    isLoading,
  };
};

export default useVideoUpload;
