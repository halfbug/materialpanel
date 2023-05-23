import { DROPS_ACTIVITY, ADMIN_ACTIVITY } from '@/graphql/store.graphql';
import { useQuery } from '@apollo/client';
import { ConstructionOutlined } from '@mui/icons-material';
import { useCallback, useEffect, useState } from 'react';

export default function useAuditLogsQuery(
  currentRoute: string,
  sid: string | string[],
  filters: string,
  isDrops: boolean,
) {
  let vari;
  let queri;
  let queriSkip;
  if (isDrops) {
    vari = { route: currentRoute, storeId: sid, filter: filters };
    queri = DROPS_ACTIVITY;
    queriSkip = !currentRoute && !sid;
  } else {
    vari = { route: currentRoute, filter: filters };
    queri = ADMIN_ACTIVITY;
    queriSkip = !currentRoute;
  }
  const [activityFilters, setActivityFilters] = useState<any[]>(undefined);
  const { data, loading, error } = useQuery(queri, {
    variables: vari,
    fetchPolicy: 'network-only',
    skip: queriSkip,
  });
  console.log('🚀 ~ file: useAuditLogsQuery.ts:9 ~ useAuditLogsQuery ~ data:', data);

  let auditActivity = [];
  if (data?.dropsActivity) {
    auditActivity = data?.dropsActivity;
  }
  if (data?.adminActivity) {
    auditActivity = data?.adminActivity;
  }

  const activityFiterList = useCallback(
    (activityLogs: any[]): any[] => {
      const filterOpts = ['id', 'context', 'operation', 'fieldname', 'oldvalue', 'newValue', 'createdAt', 'parentTitle'];
      activityLogs.forEach((cid: any, index) => {
        Object.keys(cid).forEach((mkey) => {
          if (typeof cid[mkey] === 'string') {
            if (!filterOpts.includes(mkey)) { filterOpts.push(mkey); }
          } else if (typeof cid[mkey] === 'object') {
            if (mkey !== 'user' && cid[mkey] !== null) {
              Object.keys(cid[mkey]).forEach((ikey) => {
                if (typeof cid[mkey][ikey] === 'string') {
                  if (cid[mkey][ikey] !== null) {
                    if (!filterOpts.includes(ikey)) { filterOpts.push(ikey); }
                  }
                }
                if (typeof cid[mkey][ikey] === 'object') {
                  Object.keys(cid[mkey][ikey]).forEach((inkey) => {
                    if (inkey === 'fieldname' && cid[mkey][ikey][inkey] !== null) {
                      // eslint-disable-next-line max-len
                      if (!filterOpts.includes(cid[mkey][ikey][inkey])) { filterOpts.push(cid[mkey][ikey][inkey]); }
                    } else if (cid[mkey][ikey][inkey] !== null && typeof cid[mkey][ikey][inkey] === 'object') {
                      if (!filterOpts.includes(inkey)) { filterOpts.push(inkey); }
                      // Object.keys(cid[mkey][ikey][inkey][0]).forEach((innkey) => {
                      //   if (!filterOpts.includes(innkey)) { filterOpts.push(innkey); }
                      // });
                    } else if (cid[mkey][ikey][inkey] !== null && typeof cid[mkey][ikey][inkey] === 'string') {
                      if (!filterOpts.includes(inkey)) { filterOpts.push(inkey); }
                    }
                  });
                }
              });
            }
          }
        });
      });
      return filterOpts.slice(8);
    },
    [data],
  );

  useEffect(() => {
    if (!loading && activityFilters === undefined) {
      setActivityFilters(activityFiterList(auditActivity));
    }
  }, [data, activityFilters]);

  return {
    auditActivity, loading, error, activityFilters,
  };
}
