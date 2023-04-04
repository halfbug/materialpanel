import useAppContext, {
  useCallback, useContext, useEffect, useState,
} from 'react';
import { PermissionContext } from '@/contexts/permission.context';
import { useQuery } from '@apollo/client';
import { FIND_ADMIN_PERMISSION } from '@/graphql/store.graphql';
import { useRouter } from 'next/router';

export default function usePermission() {
  const [permissionList, setPermissionList] = useState([]);
  const router = useRouter();

  const {
    data, refetch: permissionRefresh,
  } = useQuery(FIND_ADMIN_PERMISSION);

  useEffect(() => {
    permissionRefresh();
  }, [permissionRefresh, router.pathname]);

  useEffect(() => {
    const myPer = [];
    data?.getAdminPermissions.forEach((cid: any) => {
      myPer.push({ route: cid.route, name: cid.title });
    });
    setPermissionList(myPer);
  }, [data]);

  const permissions = useContext(PermissionContext);
  console.log('PermissionContext', permissions);
  const getPermissionRoute = useCallback((pname: any, allPermissions: any) => {
    const user = allPermissions.filter((item:any) => item.name === pname);
    return user;
  }, []);

  const getPermissions = useCallback(
    () => {
      const userPer = [];
      if (permissionList.length > 0) {
        permissions?.userPermission?.permission.forEach((b: any) => {
          const permissionName = getPermissionRoute(b.name, permissionList);
          if (permissionName?.[0]) {
            userPer.push(permissionName[0].route);
          }
        });
      }
      return userPer;
    },
    [permissions, getPermissionRoute],
  );

  return {
    getPermissions,
  };
}
